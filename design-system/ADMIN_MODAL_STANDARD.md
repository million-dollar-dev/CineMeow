# CineMeow Admin — Quy Chuẩn Thiết Kế Modal (Admin Modal Standard)

> **Mục tiêu**: Chuẩn hóa 100% cấu trúc thị giác, kích thước, hiệu ứng chuyển động và hành vi tương tác cho toàn bộ các cửa sổ Dialog / Modal trong hệ thống quản trị CineMeow Admin (`ShowtimeModal`, `MovieModal`, `CinemaModal`, `RoomModal`, `PromotionModal`, v.v.).

---

## 1. Cấu Trúc Tổng Thể (Modal Anatomy)

Mọi Modal trong hệ thống Admin bắt buộc tuân theo cấu trúc 4 tầng chuẩn mực:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [1] TOP GRADIENT STRIPE (h-1.5: Violet -> Indigo -> Purple)            │
├────────────────────────────────────────────────────────────────────────┤
│ [2] MODAL HEADER                                                       │
│   [Icon Box: 44x44]  [Tiêu đề chính: 18px Bold] [Badge: Tạo mới/Update] │ [Close Button]
│                      [Mô tả phụ: 12px Slate-400]                       │   (36x36)
├────────────────────────────────────────────────────────────────────────┤
│ [3] MODAL BODY (Scrollable, maxHeight: 92vh, padding: 24px)           │
│   - Bố cục lưới responsive (Grid 12 cols: 7-5 hoặc 8-4)                │
│   - Form cards: nền trắng, viền slate-200/80, bo góc rounded-2xl       │
│   - Live preview / Specs panel ở cột phụ bên phải                      │
├────────────────────────────────────────────────────────────────────────┤
│ [4] MODAL FOOTER (Sticky / Fixed bottom, Slate-50/90)                  │
│   * Các trường có dấu sao đỏ là bắt buộc nhập       [Hủy bỏ]  [Lưu/Tạo]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Thông Số Khung Dialog (Paper Specs)

Sử dụng Material UI `<Dialog>` kết hợp `slotProps.paper.sx`:

```javascript
slotProps={{
    paper: {
        sx: {
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
            background: "#ffffff",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
        },
    },
}}
```

### Kích thước tiêu chuẩn (`maxWidth`)
- **`maxWidth="md"`**: Cho các modal xác nhận nhanh, modal tạo đơn giản (< 4 trường).
- **`maxWidth="lg"`** *(Mặc định)*: Cho các form quản lý chuẩn (Phòng chiếu, Suất chiếu, Cụm rạp).
- **`maxWidth="xl"`**: Cho các form phức tạp có Live Preview lớn (Kho phim, Sơ đồ ghế ngồi Cinema Floor Studio).

---

## 3. Chi Tiết Từng Thành Phần

### 3.1. Dải Gradient Đỉnh (Top Gradient Stripe)
Nằm trên cùng của Dialog Paper, tạo nhận diện thương hiệu CineMeow đồng nhất:
```jsx
<div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />
```

---

### 3.2. Modal Header

```jsx
<div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
    {/* Left: Icon Box & Title */}
    <div className="flex items-center gap-3.5">
        {/* Icon Container: 44x44px rounded-2xl */}
        <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${
                mode === "add"
                    ? "bg-violet-50 text-violet-600 border border-violet-100"
                    : "bg-indigo-50 text-indigo-600 border border-indigo-100"
            }`}
        >
            <EntityIcon sx={{ fontSize: 24 }} />
        </div>

        <div>
            {/* Title & Status Badge */}
            <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {mode === "add" ? "Thêm [Đối tượng] Mới" : `Hiệu Chỉnh: ${entityName}`}
                </h2>
                <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border tracking-wider ${
                        mode === "add"
                            ? "bg-violet-50 text-violet-700 border-violet-200"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}
                >
                    {mode === "add" ? "Tạo mới" : "Cập nhật"}
                </span>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-slate-400 font-medium mt-0.5">
                {subtitleText}
            </p>
        </div>
    </div>

    {/* Right: Actions / Tab switcher (nếu có) & Nút đóng */}
    <div className="flex items-center gap-2.5">
        {/* Nút đóng chuẩn (36x36px rounded-xl) */}
        <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer"
            title="Đóng cửa sổ"
        >
            <CloseOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
    </div>
</div>
```

---

### 3.3. Modal Body (Vùng chứa nội dung Form)

- **Container**: `flex-1 overflow-y-auto px-6 py-6`
- **Khung chứa nhóm trường (Form Card Section)**:
  ```jsx
  <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
              <SectionIcon sx={{ fontSize: 18 }} className="text-violet-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  1. Tên Nhóm Thông Tin
              </h3>
          </div>
      </div>
      
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Inputs... */}
      </div>
  </div>
  ```

---

### 3.4. Modal Footer (Thanh hành động chân trang)

Bắt buộc cố định ở đáy modal, có viền ngăn cách `border-t border-slate-100` và nền `bg-slate-50/90`:

```jsx
<div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
    {/* Left: Ghi chú bắt buộc */}
    <span className="text-xs text-slate-400 font-medium">
        * Các trường có dấu sao đỏ là bắt buộc nhập
    </span>

    {/* Right: Cặp nút Hủy bỏ & Lưu/Tạo mới */}
    <div className="flex items-center gap-2.5">
        {/* Nút Hủy / Đóng */}
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold cursor-pointer transition"
        >
            Hủy bỏ
        </button>

        {/* Nút Submit / Lưu dữ liệu chính */}
        <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-violet-500/20 flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
        >
            {isLoading ? (
                <>
                    <CircularProgress size={15} color="inherit" />
                    <span>Đang xử lý...</span>
                </>
            ) : (
                <>
                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>{mode === "add" ? "Tạo Mới" : "Lưu Thay Đổi"}</span>
                </>
            )}
        </button>
    </div>
</div>
```

---

## 4. Bảng Tra Cứu Màu Sắc & Class Tokens

| Thành phần | Thuộc tính / Tailwind Class | Mục đích |
|---|---|---|
| **Dải sọc đỉnh** | `h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500` | Nhận diện CineMeow |
| **Bo góc Modal** | `borderRadius: "24px"` | Bo tròn hiện đại chuẩn Apple/Linear |
| **Đổ bóng Modal** | `boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)"` | Tách biệt hoàn hảo khỏi backdrop |
| **Icon Box (Add)** | `w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100` | Trạng thái tạo mới |
| **Icon Box (Edit)** | `w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100` | Trạng thái chỉnh sửa |
| **Nút Đóng** | `w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-100/80 text-slate-400 hover:text-slate-700` | Nút thoát góc phải |
| **Nút Hủy bỏ** | `px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100/80 text-xs font-semibold` | Nút phụ bên chân trang |
| **Nút Chính (Submit)** | `px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black shadow-md shadow-violet-500/20` | Hành động chính của modal |
| **Card khối form** | `p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs` | Chia nhóm các field |

---

## 5. Checklist Kiểm Duyệt Trước Khi Hoàn Thiện Modal Mới

- [ ] Có dải màu gradient đỉnh `h-1.5` chuẩn tím violet.
- [ ] Header có hộp icon `44x44px`, tiêu đề `text-lg font-black`, badge `Tạo mới` / `Cập nhật` và nút đóng `36x36px`.
- [ ] Chân trang cố định (Footer) có dòng ghi chú dấu sao đỏ bên trái.
- [ ] Nút Hủy và Lưu sử dụng đúng class token đồng bộ (font chữ, padding, bo góc `rounded-xl`).
- [ ] Nút Lưu có trạng thái loading spinner `CircularProgress size={15}` và disable khi đang gửi API.
- [ ] Khi đóng modal, form được reset về trạng thái trắng sạch sẽ.
- [ ] Các input có khoảng cách rõ ràng (`gap-4` hoặc `gap-5`), tuyệt đối không dính sát vào nhau.
