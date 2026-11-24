# Feature: Chống Trùng Lịch Chiếu Bằng PostgreSQL Exclusion Constraint

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | CM-000007 |
| **Category** | Core Domain Feature / Database Integrity / Concurrency Control |
| **Target Services** | `core/showtime-service`, `core/core-app (Flyway)`, `frontend/admin-frontend` |
| **Status** | 🟢 Live |
| **Priority** | P0 - Critical |
| **Author / Tech Lead** | Backend Core Team |

---

## 1. Overview

### 1.1 Purpose
Thiết lập cơ chế bảo vệ toàn vẹn lịch chiếu phim (**Showtime Scheduling Integrity**):
1. **Ngăn chặn tuyệt đối tình trạng giao thoa/trùng lịch chiếu (Schedule Collision)** giữa hai hoặc nhiều suất chiếu diễn ra trong cùng một phòng chiếu (`room_id`).
2. **Đảm bảo thời gian đệm chuyển tiếp suất chiếu (Showtime Transition Buffer):** Khoảng đệm tổng quát (generic) phục vụ toàn bộ chu trình giữa hai suất chiếu liên tiếp (bao gồm: dọn dẹp vệ sinh phòng, trả khách/đón khách, bảo dưỡng kỹ thuật, kiểm tra âm thanh/máy chiếu và phát trailer).
3. **Khả năng cấu hình linh hoạt (Dynamically Configurable Buffer):**
   - **Giai đoạn 1 (Hiện tại / MVP):** Cấu hình linh hoạt thông qua biến môi trường (`SHOWTIME_TRANSITION_BUFFER_MINUTES`), fallback qua `application.yml` (mặc định: 15 phút).
   - **Giai đoạn 2 (Tương lai):** Cấu hình động từ **Admin System Settings** (lưu DB), cho phép điều chỉnh realtime mà không cần restart service hoặc phân bổ thời gian đệm riêng theo từng cụm rạp/loại phòng (Standard, IMAX, VIP 3D).
4. **Triển khai kiến trúc phòng thủ 2 lớp (Defense-in-Depth):**
   - **Lớp 1 (Application Level):** Thuật toán Interval Overlap check nhanh và trả thông báo chi tiết (tên phim, khung giờ xung đột).
   - **Lớp 2 (Database Engine Level):** Sử dụng **PostgreSQL Exclusion Constraint (`EXCLUDE USING gist`)** kết hợp **Range Types (`tsrange`)** trên cột `effective_end_time` để chặn đứng hoàn toàn hiện tượng Race Condition ở cấp độ khóa vật lý của Database Engine.

### 1.2 Background & Business Problem
Trong hoạt động vận hành của rạp chiếu phim CineMeow:
* **Kịch bản xung đột:** Khi 2 quản trị viên (hoặc 1 quản trị viên mở 2 tab trình duyệt) cùng lên lịch chiếu phim cho cùng một phòng chiếu:
  * Quản trị viên A xếp lịch: *Phim "Avatar 3" (Phòng 1)* từ `19:00 - 21:30`.
  * Quản trị viên B xếp lịch: *Phim "Conan" (Phòng 1)* từ `21:15 - 23:00`.
* **Kịch bản thiếu thời gian đệm chuyển tiếp:** Suất chiếu A kết thúc lúc `21:30`, suất chiếu B bắt đầu lúc `21:35` (chỉ cách 5 phút). Khán giả suất A chưa kịp ra hết, phòng bẩn, rác chưa dọn, kỹ thuật viên chưa kịp setup máy chiếu thì khách suất B đã ùa vào $\rightarrow$ Gây bức xúc cho khách hàng, hỗn loạn tại cửa phòng chiếu.
* **Hạn chế cốt tử của cách làm thông thường (Check-then-Act Flaw):**
  * Hầu hết các hệ thống dùng câu lệnh `SELECT ... WHERE ...` ở tầng Application để kiểm tra xem có suất chiếu nào trùng không, nếu không thấy thì mới gọi `INSERT`.
  * **Lỗ hổng Race Condition:** Nếu 2 request A và B gửi tới cùng lúc trong cùng 1 mili-giây, cả 2 luồng đều chạy câu lệnh `SELECT` và cùng thấy "phòng trống" $\rightarrow$ Cả 2 cùng thực hiện `INSERT` thành công!
  * **Hạn chế của B-Tree Unique Index:** B-Tree thông thường chỉ so sánh được toán tử bằng (`=`). Nó không thể so sánh toán tử giao thoa khoảng (`&&`) trên các khoảng thời gian liên tục (`[start, end]`).
  * Việc dùng mức cô lập `SERIALIZABLE` hoặc khóa bảng thô bạo (`LOCK TABLE`) sẽ gây tắc nghẽn cổ chai (bottleneck) nghiêm trọng và dễ dẫn đến Deadlock.

---

## 2. Goals & Success Metrics

- **Mục tiêu kỹ thuật & vận hành:**
  - **100% ngăn chặn trùng lịch chiếu:** Không bao giờ xuất hiện 2 bản ghi suất chiếu trong cùng một phòng bị đè giờ lên nhau trong Database.
  - **Tự động bảo toàn thời gian đệm chuyển tiếp linh hoạt:** Giữa `end_time` của suất trước và `start_time` của suất sau trong cùng phòng luôn cách nhau $\ge B\text{ phút}$ (theo cấu hình hiện hành).
  - **Phi tập trung hóa tham số Buffer:** Database Engine không hardcode giá trị cố định `15 minutes`, mà thực hiện ràng buộc dựa trên cột tính toán `effective_end_time` được chuẩn hóa từ Application.
  - **Khả năng chịu tải Concurrency:** Chặn đứng 100% các trường hợp tranh chấp đồng thời (Concurrent Inserts) mà không cần dùng Distributed Lock đắt đỏ.
  - **Tối ưu tốc độ truy vấn:** Tận dụng chỉ mục cây không gian **GiST (Generalized Search Tree)** để câu lệnh kiểm tra overlap hoàn tất trong thời gian $< 5\text{ ms}$.
- **Success Metrics:**
  - 0 trường hợp trùng lịch xảy ra trong toàn bộ hệ thống.
  - Mã lỗi rõ ràng, tường minh trả về cho Admin Portal khi xung đột lịch.

---

## 3. Business Rules & Mathematical Model

### 3.1 Định nghĩa khoảng thời gian chiếm dụng phòng (Effective Occupied Range)
Mỗi suất chiếu $S$ có:
- Thời gian bắt đầu chiếu: $T_{\text{start}}$
- Thời gian kết thúc phim: $T_{\text{end}}$
- Thời gian đệm chuyển tiếp (Showtime Transition Buffer): $B$ (phút)
  - Giá trị $B$ được nạp từ cấu hình hệ thống: `SHOWTIME_TRANSITION_BUFFER_MINUTES` (default: 15 phút).
- Thời gian kết thúc hiệu dụng (Effective End Time):
  $$T_{\text{effective\_end}} = T_{\text{end}} + B$$

Khoảng thời gian phòng bị chiếm dụng hiệu dụng được định nghĩa là một nửa khoảng đóng-mở (Half-open interval) trong toán học:
$$\text{OccupiedInterval}(S) = \big[ T_{\text{start}}, \; T_{\text{effective\_end}} \big)$$

> [!NOTE]
> Sử dụng khoảng nửa đóng - nửa mở `[start, end)` để: nếu Suất 1 chiếm dụng hiệu dụng đến đúng `21:45`, thì Suất 2 bắt đầu đúng vào `21:45` sẽ **HOÀN TOÀN HỢP LỆ** (không bị coi là trùng tại thời điểm tiếp giáp).

### 3.2 Điều kiện xung đột giao thoa (Overlap Condition)
Hai suất chiếu $S_1$ và $S_2$ diễn ra tại cùng một phòng chiếu ($R_{S_1} = R_{S_2}$) được coi là **xung đột** khi và chỉ khi:
$$\text{OccupiedInterval}(S_1) \cap \text{OccupiedInterval}(S_2) \neq \emptyset$$

Biểu diễn theo điều kiện thời gian:
$$T_{\text{start}}(S_1) < T_{\text{effective\_end}}(S_2) \quad \text{VÀ} \quad T_{\text{start}}(S_2) < T_{\text{effective\_end}}(S_1)$$

### 3.3 Ma trận kịch bản kiểm tra (Collision Test Matrix)
Giả sử Suất chiếu hiện tại $S_1$: **19:00 - 21:00** (Phòng 1, Transition Buffer $B = 15\text{m} \rightarrow$ Chiếm dụng hiệu dụng: **19:00 - 21:15**).

| Kịch bản | Suất chiếu mới $S_2$ đề xuất | Khoảng chiếm dụng $S_2$ | Kết quả | Lý do nghiệp vụ |
| :---: | :---: | :---: | :---: | :--- |
| **KB-01** | `17:00 - 18:45` | `[17:00, 19:00)` |  **HỢP LỆ** | Suất $S_2$ kết thúc 18:45 + 15m buffer = 19:00, vừa đúng lúc Suất $S_1$ bắt đầu. |
| **KB-02** | `17:00 - 18:50` | `[17:00, 19:05)` | ❌ **XUNG ĐỘT** | Suất $S_2$ chiếm dụng đến 19:05, lẹm 5 phút vào giờ chiếu của $S_1$ (Chưa đủ thời gian chuyển tiếp buffer). |
| **KB-03** | `20:00 - 22:00` | `[20:00, 22:15)` | ❌ **XUNG ĐỘT** | Đè trực tiếp lên khung giờ đang chiếu của $S_1$ (19:00 - 21:00). |
| **KB-04** | `19:30 - 20:30` | `[19:30, 20:45)` | ❌ **XUNG ĐỘT** | Nằm lọt thỏm hoàn toàn bên trong thời gian chiếu của $S_1$. |
| **KB-05** | `18:00 - 22:00` | `[18:00, 22:15)` | ❌ **XUNG ĐỘT** | Bao trùm hoàn toàn thời gian chiếu của $S_1$. |
| **KB-06** | `21:15 - 23:00` | `[21:15, 23:15)` |  **HỢP LỆ** | Bắt đầu lúc 21:15, vừa vặn sau khi $S_1$ kết thúc thời gian chiếm dụng hiệu dụng lúc 21:15. |
| **KB-07** | `20:00 - 22:00` *(Phòng 2)* | `[20:00, 22:15)` |  **HỢP LỆ** | Khác phòng chiếu (`room_id` khác nhau). |
| **KB-08** | `20:00 - 22:00` *(Status = CANCELLED)* | - |  **HỢP LỆ** | Suất chiếu đã bị hủy không còn chiếm dụng phòng. |

---

## 4. Architecture & Technical Design

### 4.1 Chiến lược Cấu hình Buffer Linh hoạt (Configurable Buffer Strategy)

Nhằm đáp ứng yêu cầu linh hoạt và khả năng tiến hóa kiến trúc trong tương lai:

```
┌────────────────────────────────────────────────────────┐
│             SHOWTIME TRANSITION BUFFER                 │
└────────────────────────────────────────────────────────┘
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
 [Giai đoạn 1 - Hiện tại]              [Giai đoạn 2 - Mở rộng]
 Biến môi trường (ENV)                Admin System Settings
 `SHOWTIME_TRANSITION_BUFFER_MINUTES`  Lưu cấu hình động trong DB
 Fallback: application.yml (15m)       Cho phép tùy biến theo rạp/phòng
       │                                       │
       └───────────────────┬───────────────────┘
                           ▼
               ┌───────────────────────┐
               │ ShowtimeBufferService │  (Strategy Pattern)
               └───────────────────────┘
                           │
                           ▼
          Tính toán effective_end_time = end_time + buffer
                           │
                           ▼
         Lưu vào Database & Kiểm tra Exclusion Constraint
```

#### Cấu hình Spring Boot:
File `core/showtime-service/src/main/resources/application.yml`:
```yaml
app:
  showtime:
    transition-buffer-minutes: ${SHOWTIME_TRANSITION_BUFFER_MINUTES:15}
```

---

### 4.2 Thiết kế Cơ sở Dữ liệu & PostgreSQL Exclusion Constraint

Thay vì hardcode `interval '15 minutes'` trực tiếp trong DDL của Database, bảng `show_times` được bổ sung 2 cột:
1. `transition_buffer_minutes INT NOT NULL DEFAULT 15`: Lưu số phút đệm áp dụng cho suất chiếu (hỗ trợ audit và hiển thị).
2. `effective_end_time TIMESTAMP NOT NULL`: Lưu mốc thời gian kết thúc hiệu dụng ($T_{\text{end}} + B$).

Exclusion Constraint trên PostgreSQL sẽ kiểm tra giao thoa trực tiếp trên `[start_time, effective_end_time)`:

```
                              Bảng show_times
   ┌──────────────────────────────────────────────────────────────────────────────┐
   │ room_id (VARCHAR) │ start_time (TIMESTAMP) │ effective_end_time (TIMESTAMP) │
   └──────────────────────────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            ▼                                                   ▼
      Toán tử B-Tree (=)                                Toán tử GiST Range (&&)
      So khớp cùng phòng chiếu:                         So khớp giao thoa thời gian:
      room_id WITH =                                    tsrange(start_time, effective_end_time) WITH &&
            │                                                   │
            └─────────────────────────┬─────────────────────────┘
                                      │
                                      ▼
                 ┌─────────────────────────────────────────┐
                 │   EXCLUDE USING gist (...)              │
                 │   WHERE (status != 'CANCELLED')         │
                 │                                         │
                 │  Nếu TỒN TẠI dòng nào thỏa mãn:         │
                 │    (room_id_A = room_id_B)              │
                 │    VÀ (Range_A && Range_B)              │
                 │  ==> NÉM LỖI VI PHẠM RÀNG BUỘC (23P01)  │
                 └─────────────────────────────────────────┘
```

#### Lợi ích cốt lõi của thiết kế này:
1. **Hoàn toàn độc lập với giá trị cấu hình:** Khi thay đổi `SHOWTIME_TRANSITION_BUFFER_MINUTES` qua ENV hoặc Admin Settings, cấu trúc DDL và Constraint của DB **không cần sửa đổi hay recreate**.
2. **Hỗ trợ thời gian đệm biến thiên (Heterogeneous Buffers):** Cho phép các suất chiếu khác nhau có buffer khác nhau (ví dụ: phòng IMAX cần 20 phút, phòng thông thường 15 phút).
3. **Hiệu năng & Khóa Index tối đa:** Tận dụng chỉ mục GiST không khóa toàn bảng.

---

### 4.3 Script Database Migration (Flyway)

Tạo file migration: `core/core-app/src/main/resources/db/migration/V4__add_showtime_exclusion_constraint.sql`:

```sql
-- =============================================================================
-- Migration: V4__add_showtime_exclusion_constraint.sql
-- Description: Kích hoạt btree_gist, bổ sung transition buffer và Exclusion Constraint
-- =============================================================================

-- Bước 1: Kích hoạt extension btree_gist
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Bước 2: Bổ sung các cột phục vụ dynamic transition buffer
ALTER TABLE show_times
ADD COLUMN IF NOT EXISTS transition_buffer_minutes INT NOT NULL DEFAULT 15,
ADD COLUMN IF NOT EXISTS effective_end_time TIMESTAMP;

-- Bước 3: Đồng bộ dữ liệu lịch sử cho các suất chiếu cũ
UPDATE show_times
SET effective_end_time = end_time + (transition_buffer_minutes || ' minutes')::interval
WHERE effective_end_time IS NULL;

ALTER TABLE show_times
ALTER COLUMN effective_end_time SET NOT NULL;

-- Bước 4: Thêm Exclusion Constraint trên bảng show_times
-- Kiểm tra giao thoa giữa các khoảng [start_time, effective_end_time) trong cùng một phòng chiếu
-- Bỏ qua các suất chiếu có status = 'CANCELLED'
ALTER TABLE show_times
ADD CONSTRAINT exclude_overlapping_showtimes
EXCLUDE USING gist (
    room_id WITH =,
    tsrange(start_time, effective_end_time, '[)') WITH &&
)
WHERE (status != 'CANCELLED');

-- Bước 5: Tạo Index hỗ trợ truy vấn tìm kiếm nhanh theo khoảng thời gian
CREATE INDEX IF NOT EXISTS idx_showtimes_room_effective_range
ON show_times USING gist (
    room_id,
    tsrange(start_time, effective_end_time, '[)')
);
```

---

### 4.4 Kiến trúc Phòng thủ 2 lớp (Defense-in-Depth Implementation)

#### Lớp 1: Service Validation (Kiểm tra nghiệp vụ & Trả lỗi tường minh)
Trong [`ShowtimeServiceImpl.java`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/core/showtime-service/src/main/java/com/cinemeow/showtime_service/service/impl/ShowtimeServiceImpl.java):

```java
@Service
@RequiredArgsConstructor
public class ShowtimeServiceImpl implements ShowtimeService {

    private final ShowtimeRepository showtimeRepository;
    private final ShowtimeMapper showtimeMapper;
    
    @Value("${app.showtime.transition-buffer-minutes:15}")
    private int defaultBufferMinutes;

    public int getTransitionBufferMinutes() {
        // Giai đoạn 1: Lấy từ cấu hình env/yml
        // Giai đoạn 2: Có thể nạp từ SettingService/AdminSettings nếu có
        return defaultBufferMinutes;
    }

    @Override
    @Transactional
    public ShowtimeResponse create(ShowtimeRequest request) {
        LocalDateTime startTime = request.getStartTime();
        LocalDateTime endTime = request.getEndTime();
        int bufferMinutes = getTransitionBufferMinutes();
        LocalDateTime effectiveEndTime = endTime.plusMinutes(bufferMinutes);

        // 1. Kiểm tra Lớp 1: Truy vấn tìm suất chiếu bị xung đột trong phòng
        List<Showtime> conflicts = showtimeRepository.findConflictingShowtimes(
                request.getRoomId(),
                startTime,
                effectiveEndTime,
                ShowtimeStatus.CANCELLED.name()
        );

        if (!conflicts.isEmpty()) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        // 2. Lưu vào DB (Nếu lọt qua do Race Condition, Lớp 2 Exclusion Constraint sẽ bắt lại)
        Showtime showtime = showtimeMapper.toShowtime(request);
        showtime.setTransitionBufferMinutes(bufferMinutes);
        showtime.setEffectiveEndTime(effectiveEndTime);

        try {
            showtimeRepository.save(showtime);
        } catch (DataIntegrityViolationException ex) {
            // Bắt lỗi vi phạm Exclusion Constraint từ PostgreSQL
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        return buildFullShowtimeResponse(showtime);
    }
}
```

#### Query Repository tại [`ShowtimeRepository.java`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/core/showtime-service/src/main/java/com/cinemeow/showtime_service/repository/ShowtimeRepository.java):
```java
@Query(value = """
    SELECT * FROM show_times s
    WHERE s.room_id = :roomId
      AND s.status != :cancelledStatus
      AND s.start_time < :effectiveEndTime
      AND s.effective_end_time > :startTime
    LIMIT 1
""", nativeQuery = true)
List<Showtime> findConflictingShowtimes(
    @Param("roomId") String roomId,
    @Param("startTime") LocalDateTime startTime,
    @Param("effectiveEndTime") LocalDateTime effectiveEndTime,
    @Param("cancelledStatus") String cancelledStatus
);
```

#### Lớp 2: Xử lý ngoại lệ toàn cục tại GlobalExceptionHandler
Bắt mã lỗi chuẩn của PostgreSQL **`23P01` (exclusion_violation)**:

```java
@ExceptionHandler(DataIntegrityViolationException.class)
public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
    Throwable rootCause = ex.getRootCause();
    if (rootCause != null && rootCause.getMessage() != null) {
        if (rootCause.getMessage().contains("exclude_overlapping_showtimes") 
            || rootCause.getMessage().contains("23P01")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ApiResponse.<Void>builder()
                    .code(ErrorCode.SHOWTIME_OVERLAPPED.getCode())
                    .message(ErrorCode.SHOWTIME_OVERLAPPED.getMessage())
                    .build()
            );
        }
    }
    // Xử lý các lỗi constraint khác...
}
```

---

### 4.5 Error Contract Specification

Khi có xung đột lịch chiếu, hệ thống trả về mã lỗi HTTP 409 Conflict:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "code": 1089,
  "message": "Phòng chiếu đã có lịch chiếu khác trong khoảng thời gian này hoặc không đủ thời gian chuyển tiếp giữa 2 suất chiếu!",
  "data": null
}
```

---

## 5. Implementation Roadmap

### Phase 1: Dynamic Configuration & Database Migration
- [ ] Bổ sung cấu hình `app.showtime.transition-buffer-minutes: ${SHOWTIME_TRANSITION_BUFFER_MINUTES:15}` trong `application.yml`.
- [ ] Soạn thảo file Flyway migration `V4__add_showtime_exclusion_constraint.sql`.
- [ ] Thêm các cột `transition_buffer_minutes` và `effective_end_time` vào entity `Showtime.java`.
- [ ] Kiểm tra môi trường Docker PostgreSQL đảm bảo extension `btree_gist` và constraint kích hoạt thành công.

### Phase 2: Backend Core & Error Handling
- [ ] Bổ sung `ErrorCode.SHOWTIME_OVERLAPPED (1089)` vào `ErrorCode.java`.
- [ ] Thêm câu query `findConflictingShowtimes` vào `ShowtimeRepository`.
- [ ] Cập nhật method `create` và `updateById` trong `ShowtimeServiceImpl` tính toán `effectiveEndTime`.
- [ ] Cấu hình `GlobalExceptionHandler` bắt mã lỗi `23P01` (exclusion violation).

### Phase 3: Unit & Concurrency Testing
- [ ] Viết Unit Test `ShowtimeOverlapValidatorTest` phủ 8 kịch bản trong Ma trận kiểm tra (Mục 3.3).
- [ ] Viết Concurrency Integration Test (`ShowtimeConcurrencyTest`):
  - Dùng `ExecutorService` với 50 luồng đồng thời cố gắng tạo suất chiếu bị đè giờ vào cùng một phòng.
  - Xác thực đúng 1 suất tạo thành công và 49 suất còn lại nhận lỗi `409 Conflict`.

### Phase 4: Admin Frontend UX Integration
- [ ] Khi Admin tạo hoặc chỉnh sửa suất chiếu trên giao diện [`ShowtimePage.jsx`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/frontend/admin-frontend/src/pages/ShowtimePage.jsx):
  - Hiển thị trực quan thanh timeline của phòng chiếu với các ô màu xám (khoảng đệm chuyển tiếp buffer).
  - Bắt lỗi `1089` từ API và hiển thị Toast thông báo đỏ cảnh báo trùng lịch.

---

## 6. Risks & Mitigation

| Rủi ro kỹ thuật | Mức độ | Biện pháp giảm thiểu |
| :--- | :---: | :--- |
| **Dữ liệu cũ trong DB bị trùng** khiến lệnh `ALTER TABLE ADD CONSTRAINT` bị fail | Medium | Chạy script kiểm tra và dọn dẹp (hoặc chuyển status thành `CANCELLED`) các bản ghi trùng lặp lịch sử trước khi apply constraint. |
| **Thay đổi Buffer thời gian thực** khi Admin cập nhật giá trị mới | Low | Thiết kế cột `effective_end_time` độc lập giúp việc đổi buffer qua ENV/Admin Setting chỉ áp dụng cho các suất mới tạo mà không làm gãy constraint của các suất cũ. |
| **Chênh lệch múi giờ (Timezone Mismatch)** giữa JVM và PostgreSQL Server | Medium | Bắt buộc cấu hình đồng nhất `UTC` trên cả Spring Boot (`TimeZone.setDefault(TimeZone.getTimeZone("UTC"))`) và PostgreSQL (`timezone = 'UTC'`). Kiểu dữ liệu `tsrange` (timestamp without timezone) được ánh xạ 1:1 với `LocalDateTime`. |

---

## 7. Definition of Done (DoD)

- [x] File Flyway migration `V5__add_showtime_exclusion_constraint.sql` được apply thành công trên PostgreSQL.
- [x] Thử nghiệm chèn 2 bản ghi trùng giờ hoặc vi phạm khoảng đệm buffer trực tiếp bằng SQL thô: PostgreSQL tự động từ chối với lỗi `23P01`.
- [x] API `POST /showtimes` đọc buffer từ `SHOWTIME_TRANSITION_BUFFER_MINUTES` và trả về đúng mã lỗi `1089` và HTTP `409 Conflict` khi xếp trùng giờ.
- [x] Suất chiếu có trạng thái `CANCELLED` không gây cản trở việc xếp suất chiếu mới vào phòng.
- [x] Concurrency Test và Unit Test `ShowtimeCollisionTest` đạt kết quả an toàn 100%.
- [x] Cập nhật trạng thái tính năng `CM-000007` trong `docs/wiki/Feature-Index.md` sang `🟢 Live`.
