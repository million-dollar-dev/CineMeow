# Feature: Chống Trùng Lịch Chiếu Bằng PostgreSQL Exclusion Constraint

| Metadata | Details |
| :--- | :--- |
| **Feature ID** | CM-000007 |
| **Category** | Core Domain Feature / Database Integrity / Concurrency Control |
| **Target Services** | `core/showtime-service`, `core/core-app (Flyway)`, `frontend/admin-frontend` |
| **Status** | 🟣 In Design |
| **Priority** | P0 - Critical |
| **Author / Tech Lead** | Backend Core Team |

---

## 1. Overview

### 1.1 Purpose
Thiết lập cơ chế bảo vệ toàn vẹn lịch chiếu phim (**Showtime Scheduling Integrity**):
1. **Ngăn chặn tuyệt đối tình trạng giao thoa/trùng lịch chiếu (Schedule Collision)** giữa hai hoặc nhiều suất chiếu diễn ra trong cùng một phòng chiếu (`room_id`).
2. **Đảm bảo thời gian đệm vệ sinh phòng chiếu (Cleaning Buffer Time)** tối thiểu **15 phút** giữa hai suất chiếu liên tiếp, giúp nhân viên rạp kịp dọn dẹp bắp nước, kiểm tra kỹ thuật và đón lượt khách tiếp theo.
3. **Triển khai kiến trúc phòng thủ 2 lớp (Defense-in-Depth):**
   - **Lớp 1 (Application Level):** Thuật toán Interval Overlap check nhanh và trả thông báo chi tiết (tên phim, khung giờ xung đột).
   - **Lớp 2 (Database Engine Level):** Sử dụng **PostgreSQL Exclusion Constraint (`EXCLUDE USING gist`)** kết hợp **Range Types (`tsrange`)** để chặn đứng hoàn toàn hiện tượng Race Condition ở cấp độ khóa vật lý của Database Engine.

### 1.2 Background & Business Problem
Trong hoạt động vận hành của rạp chiếu phim CineMeow:
* **Kịch bản xung đột:** Khi 2 quản trị viên (hoặc 1 quản trị viên mở 2 tab trình duyệt) cùng lên lịch chiếu phim cho cùng một phòng chiếu:
  * Quản trị viên A xếp lịch: *Phim "Avatar 3" (Phòng 1)* từ `19:00 - 21:30`.
  * Quản trị viên B xếp lịch: *Phim "Conan" (Phòng 1)* từ `21:15 - 23:00`.
* **Kịch bản thiếu thời gian dọn rạp:** Suất chiếu A kết thúc lúc `21:30`, suất chiếu B bắt đầu lúc `21:35` (chỉ cách 5 phút). Khán giả suất A chưa kịp ra hết, phòng bẩn, rác chưa dọn thì khán giả suất B đã vào $\rightarrow$ Gây bức xúc cho khách hàng, hỗn loạn tại cửa phòng chiếu.
* **Hạn chế cốt tử của cách làm thông thường (Check-then-Act Flaw):**
  * Hầu hết các hệ thống dùng câu lệnh `SELECT ... WHERE ...` ở tầng Application để kiểm tra xem có suất chiếu nào trùng không, nếu không thấy thì mới gọi `INSERT`.
  * **Lỗ hổng Race Condition:** Nếu 2 request A và B gửi tới cùng lúc trong cùng 1 mili-giây, cả 2 luồng đều chạy câu lệnh `SELECT` và cùng thấy "phòng trống" $\rightarrow$ Cả 2 cùng thực hiện `INSERT` thành công!
  * **Hạn chế của B-Tree Unique Index:** B-Tree thông thường chỉ so sánh được toán tử bằng (`=`). Nó không thể so sánh toán tử giao thoa khoảng (`&&`) trên các khoảng thời gian liên tục (`[start, end]`).
  * Việc dùng mức cô lập `SERIALIZABLE` hoặc khóa bảng thô bạo (`LOCK TABLE`) sẽ gây tắc nghẽn cổ chai (bottleneck) nghiêm trọng và dễ dẫn đến Deadlock.

---

## 2. Goals & Success Metrics

- **Mục tiêu kỹ thuật & vận hành:**
  - **100% ngăn chặn trùng lịch chiếu:** Không bao giờ xuất hiện 2 bản ghi suất chiếu trong cùng một phòng bị đè giờ lên nhau trong Database.
  - **Tự động bảo toàn thời gian dọn phòng 15 phút:** Giữa `end_time` của suất trước và `start_time` của suất sau trong cùng phòng luôn cách nhau $\ge 15\text{ phút}$.
  - **Khả năng chịu tải Concurrency:** Chặn đứng 100% các trường hợp tranh chấp đồng thời (Concurrent Inserts) mà không cần dùng Distributed Lock đắt đỏ.
  - **Tối ưu tốc độ truy vấn:** Tận dụng chỉ mục cây không gian **GiST (Generalized Search Tree)** để câu lệnh kiểm tra overlap hoàn tất trong thời gian $< 5\text{ ms}$.
- **Success Metrics:**
  - 0 trường hợp trùng lịch xảy ra trong toàn bộ hệ thống.
  - Mã lỗi rõ ràng, tường minh trả về cho Admin Portal khi xung đột lịch.

---

## 3. Business Rules & Mathematical Model

### 3.1 Định nghĩa khoảng thời gian chiếm dụng phòng (Effective Occupied Range)
Mỗi suất chiếu $S$ có:
- Thời gian bắt đầu: $T_{\text{start}}$
- Thời gian kết thúc phim: $T_{\text{end}}$
- Thời gian đệm dọn dẹp (Cleaning Buffer): $B = 15\text{ phút}$

Khoảng thời gian phòng bị chiếm dụng hiệu dụng được định nghĩa là một nửa khoảng đóng-mở (Half-open interval) trong toán học:
$$\text{OccupiedInterval}(S) = \big[ T_{\text{start}}, \; T_{\text{end}} + B \big)$$

> [!NOTE]
> Sử dụng khoảng nửa đóng - nửa mở `[start, end)` để: nếu Suất 1 chiếm dụng đến đúng `21:45`, thì Suất 2 bắt đầu đúng vào `21:45` sẽ **HOÀN TOÀN HỢP LỆ** (không bị coi là trùng tại thời điểm tiếp giáp).

### 3.2 Điều kiện xung đột giao thoa (Overlap Condition)
Hai suất chiếu $S_1$ và $S_2$ diễn ra tại cùng một phòng chiếu ($R_{S_1} = R_{S_2}$) được coi là **xung đột** khi và chỉ khi:
$$\text{OccupiedInterval}(S_1) \cap \text{OccupiedInterval}(S_2) \neq \emptyset$$

Biểu diễn theo điều kiện thời gian:
$$T_{\text{start}}(S_1) < \big( T_{\text{end}}(S_2) + B \big) \quad \text{VÀ} \quad T_{\text{start}}(S_2) < \big( T_{\text{end}}(S_1) + B \big)$$

### 3.3 Ma trận kịch bản kiểm tra (Collision Test Matrix)
Giả sử Suất chiếu hiện tại $S_1$: **19:00 - 21:00** (Phòng 1, Buffer 15m $\rightarrow$ Chiếm dụng hiệu dụng: **19:00 - 21:15**).

| Kịch bản | Suất chiếu mới $S_2$ đề xuất | Khoảng chiếm dụng $S_2$ | Kết quả | Lý do nghiệp vụ |
| :---: | :---: | :---: | :---: | :--- |
| **KB-01** | `17:00 - 18:45` | `[17:00, 19:00)` |  **HỢP LỆ** | Suất $S_2$ kết thúc 18:45 + 15m dọn phòng = 19:00, vừa đúng lúc Suất $S_1$ bắt đầu. |
| **KB-02** | `17:00 - 18:50` | `[17:00, 19:05)` | ❌ **XUNG ĐỘT** | Suất $S_2$ dọn đến 19:05, lẹm 5 phút vào giờ chiếu của $S_1$ (Chưa đủ thời gian dọn phòng). |
| **KB-03** | `20:00 - 22:00` | `[20:00, 22:15)` | ❌ **XUNG ĐỘT** | Đè trực tiếp lên khung giờ đang chiếu của $S_1$ (19:00 - 21:00). |
| **KB-04** | `19:30 - 20:30` | `[19:30, 20:45)` | ❌ **XUNG ĐỘT** | Nằm lọt thỏm hoàn toàn bên trong thời gian chiếu của $S_1$. |
| **KB-05** | `18:00 - 22:00` | `[18:00, 22:15)` | ❌ **XUNG ĐỘT** | Bao trùm hoàn toàn thời gian chiếu của $S_1$. |
| **KB-06** | `21:15 - 23:00` | `[21:15, 23:15)` |  **HỢP LỆ** | Bắt đầu lúc 21:15, vừa vặn sau khi $S_1$ kết thúc chiếu lúc 21:00 và dọn phòng 15 phút. |
| **KB-07** | `20:00 - 22:00` *(Phòng 2)* | `[20:00, 22:15)` |  **HỢP LỆ** | Khác phòng chiếu (`room_id` khác nhau). |
| **KB-08** | `20:00 - 22:00` *(Status = CANCELLED)* | - |  **HỢP LỆ** | Suất chiếu đã bị hủy không còn chiếm dụng phòng. |

---

## 4. Architecture & Technical Design

### 4.1 Cơ chế PostgreSQL Exclusion Constraint

PostgreSQL hỗ trợ tính năng độc nhất vô nhị trong giới cơ sở dữ liệu quan hệ: **Exclusion Constraint** (kết hợp với extension `btree_gist`).

```
                              Bảng show_times
   ┌─────────────────────────────────────────────────────────────────┐
   │ room_id (VARCHAR)  │ start_time (TIMESTAMP) │ end_time (TIMESTAMP)│
   └─────────────────────────────────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
     Toán tử B-Tree (=)                                Toán tử GiST Range (&&)
     So khớp cùng phòng chiếu:                         So khớp giao thoa thời gian:
     room_id WITH =                                    tsrange(start, end + 15m) WITH &&
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

#### Ưu thế vượt trội của PostgreSQL Exclusion Constraint:
1. **Kiểm tra đa chiều nguyên tử (Atomic Multi-dimensional Check):** Vừa kiểm tra đẳng thức trên chuỗi (`room_id = room_id`), vừa kiểm tra giao thoa trên dải liên tục (`range && range`).
2. **Khóa dựa trên Index (Index-level Locking):** Khi thực hiện câu lệnh `INSERT`, PostgreSQL chỉ khóa trên cây chỉ mục GiST tương ứng với vùng không gian đó, **không khóa toàn bảng**, cho phép các phòng chiếu khác ghi song song với hiệu năng tối đa.
3. **Bất biến trước Concurrency:** Dù 100 threads cùng `INSERT` tại cùng 1 mili-giây, chỉ đúng 1 thread ghi thành công, 99 threads còn lại bị PostgreSQL chặn đứng ngay tại tầng lưu trữ.

---

### 4.2 Script Database Migration (Flyway)

Tạo file migration: `core/core-app/src/main/resources/db/migration/V3__add_showtime_exclusion_constraint.sql`:

```sql
-- =============================================================================
-- Migration: V3__add_showtime_exclusion_constraint.sql
-- Description: Kích hoạt btree_gist và thêm Exclusion Constraint chống trùng lịch
-- =============================================================================

-- Bước 1: Kích hoạt extension btree_gist để cho phép dùng toán tử '=' trong GiST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Bước 2: Dọn dẹp dữ liệu trùng lặp cũ nếu có (bảo vệ an toàn khi migration)
-- (Tùy chọn: ghi log các bản ghi trùng trước khi xử lý)

-- Bước 3: Thêm Exclusion Constraint trên bảng show_times
-- Buffer time: 15 minutes (có thể điều chỉnh theo tham số nghiệp vụ)
-- Áp dụng khoảng [start_time, end_time + interval '15 minutes')
-- Điều kiện lọc: Bỏ qua các suất chiếu có status = 'CANCELLED'
ALTER TABLE show_times
ADD CONSTRAINT exclude_overlapping_showtimes
EXCLUDE USING gist (
    room_id WITH =,
    tsrange(start_time, end_time + interval '15 minutes', '[)') WITH &&
)
WHERE (status != 'CANCELLED');

-- Bước 4: Tạo Index hỗ trợ truy vấn tìm kiếm nhanh theo khoảng thời gian
CREATE INDEX IF NOT EXISTS idx_showtimes_room_time_range
ON show_times USING gist (
    room_id,
    tsrange(start_time, end_time, '[)')
);
```

---

### 4.3 Kiến trúc Phòng thủ 2 lớp (Defense-in-Depth Implementation)

#### Lớp 1: Service Validation (Kiểm tra nghiệp vụ & Trả lỗi tường minh)
Trong [`ShowtimeServiceImpl.java`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/core/showtime-service/src/main/java/com/cinemeow/showtime_service/service/impl/ShowtimeServiceImpl.java):

```java
@Override
@Transactional
public ShowtimeResponse create(ShowtimeRequest request) {
    LocalDateTime startTime = request.getStartTime();
    LocalDateTime endTime = request.getEndTime();
    int bufferMinutes = 15;
    LocalDateTime bufferedEndTime = endTime.plusMinutes(bufferMinutes);

    // 1. Kiểm tra Lớp 1: Truy vấn tìm suất chiếu bị xung đột trong phòng
    List<Showtime> conflicts = showtimeRepository.findConflictingShowtimes(
            request.getRoomId(),
            startTime,
            bufferedEndTime,
            ShowtimeStatus.CANCELLED
    );

    if (!conflicts.isEmpty()) {
        Showtime conflict = conflicts.get(0);
        throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
    }

    // 2. Lưu vào DB (Nếu lọt qua do Race Condition, Lớp 2 Exclusion Constraint sẽ bắt lại)
    Showtime showtime = showtimeMapper.toShowtime(request);
    try {
        showtimeRepository.save(showtime);
    } catch (DataIntegrityViolationException ex) {
        // Bắt lỗi vi phạm Exclusion Constraint từ PostgreSQL
        throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
    }

    return buildFullShowtimeResponse(showtime);
}
```

#### Query Repository tại [`ShowtimeRepository.java`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/core/showtime-service/src/main/java/com/cinemeow/showtime_service/repository/ShowtimeRepository.java):
```java
@Query(value = """
    SELECT * FROM show_times s
    WHERE s.room_id = :roomId
      AND s.status != :cancelledStatus
      AND s.start_time < :bufferedEndTime
      AND (s.end_time + INTERVAL '15 minutes') > :startTime
    LIMIT 1
""", nativeQuery = true)
List<Showtime> findConflictingShowtimes(
    @Param("roomId") String roomId,
    @Param("startTime") LocalDateTime startTime,
    @Param("bufferedEndTime") LocalDateTime bufferedEndTime,
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

### 4.4 Error Contract Specification

Khi có xung đột lịch chiếu, hệ thống trả về mã lỗi HTTP 409 Conflict:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "code": 1089,
  "message": "Phòng chiếu đã có lịch chiếu khác trong khoảng thời gian này hoặc chưa đủ thời gian dọn dẹp (15 phút)!",
  "data": null
}
```

---

## 5. Implementation Roadmap

### Phase 1: Database Setup & Migration
- [ ] Soạn thảo file Flyway migration `V3__add_showtime_exclusion_constraint.sql`.
- [ ] Kiểm tra môi trường Docker PostgreSQL đảm bảo extension `btree_gist` được kích hoạt thành công.
- [ ] Viết script kiểm tra dữ liệu cũ trong bảng `show_times`.

### Phase 2: Backend Core & Error Handling
- [ ] Bổ sung `ErrorCode.SHOWTIME_OVERLAPPED (1089)` vào `ErrorCode.java`.
- [ ] Thêm câu query `findConflictingShowtimes` vào `ShowtimeRepository`.
- [ ] Cập nhật method `create` và `updateById` trong `ShowtimeServiceImpl`.
- [ ] Cấu hình `GlobalExceptionHandler` bắt mã lỗi `23P01` (exclusion violation).

### Phase 3: Unit & Concurrency Testing
- [ ] Viết Unit Test `ShowtimeOverlapValidatorTest` phủ 8 kịch bản trong Ma trận kiểm tra (Mục 3.3).
- [ ] Viết Concurrency Integration Test (`ShowtimeConcurrencyTest`):
  - Dùng `ExecutorService` với 50 luồng đồng thời cố gắng tạo suất chiếu bị đè giờ vào cùng một phòng.
  - Xác thực đúng 1 suất tạo thành công và 49 suất còn lại nhận lỗi `409 Conflict`.

### Phase 4: Admin Frontend UX Integration
- [ ] Khi Admin tạo hoặc chỉnh sửa suất chiếu trên giao diện [`ShowtimePage.jsx`](file:///e:/Workspace/LEARN/springboot_projects/CineMeow/frontend/admin-frontend/src/pages/ShowtimePage.jsx):
  - Hiển thị trực quan thanh timeline của phòng chiếu với các ô màu xám (15 phút dọn dẹp).
  - Bắt lỗi `1089` từ API và hiển thị Toast thông báo đỏ cảnh báo trùng lịch.

---

## 6. Risks & Mitigation

| Rủi ro kỹ thuật | Mức độ | Biện pháp giảm thiểu |
| :--- | :---: | :--- |
| **Dữ liệu cũ trong DB bị trùng** khiến lệnh `ALTER TABLE ADD CONSTRAINT` bị fail | Medium | Chạy script kiểm tra và dọn dẹp (hoặc chuyển status thành `CANCELLED`) các bản ghi trùng lặp lịch sử trước khi apply constraint. |
| **Độ trễ tính toán Buffer** khi cập nhật thời gian dọn dẹp linh hoạt (VD: phim dài cần dọn 20m, phim ngắn dọn 10m) | Low | Giữ buffer 15 phút cố định ở constraint DB như một ngưỡng an toàn tối thiểu (Hard Limit), còn buffer biến thiên sẽ validate thêm ở Lớp 1 (Soft Limit). |
| **Chênh lệch múi giờ (Timezone Mismatch)** giữa JVM và PostgreSQL Server | Medium | Bắt buộc cấu hình đồng nhất `UTC` trên cả Spring Boot (`TimeZone.setDefault(TimeZone.getTimeZone("UTC"))`) và PostgreSQL (`timezone = 'UTC'`). Kiểu dữ liệu `tsrange` (timestamp without timezone) được ánh xạ 1:1 với `LocalDateTime`. |

---

## 7. Definition of Done (DoD)

- [ ] File Flyway migration được apply thành công trên PostgreSQL container.
- [ ] Thử nghiệm chèn 2 bản ghi trùng giờ trực tiếp bằng câu lệnh SQL thô: PostgreSQL tự động từ chối với lỗi `23P01`.
- [ ] API `POST /showtimes` trả về đúng mã lỗi `1089` và HTTP `409 Conflict` khi xếp trùng giờ hoặc cách dưới 15 phút.
- [ ] Suất chiếu có trạng thái `CANCELLED` không gây cản trở việc xếp suất chiếu mới vào phòng.
- [ ] Concurrency Test với 50 luồng chạy đồng thời đạt kết quả an toàn 100%.
- [ ] Cập nhật trạng thái tính năng `CM-000007` trong `docs/wiki/Feature-Index.md`.

