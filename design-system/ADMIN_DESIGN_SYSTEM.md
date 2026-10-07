# CineMeow Admin — Unified Design System Specification

## 1. Overview & Principles
The CineMeow Admin portal adheres to a **Modern Light Enterprise** design system. It focuses on clean, spacious, high-contrast, intuitive user experiences inspired by modern tools like Linear, Stripe, and Apple Developer.

### Core Principles
1. **Simplicity over Clutter**: Remove superfluous subtitles, redundant helper badges, and visual noise.
2. **Intuitive & Self-Evident**: Micro-interactions, clear field placeholders, distinct state indicators (success, warning, danger).
3. **Refined Typography**: Modern geometric sans-serif (`Plus Jakarta Sans` / `Inter`) with strict scale and letter-spacing.
4. **Cohesive Cinema Identity**: Shared brand accent violet (`#7F5AF0` / `#6366F1`) bridging Client Frontend and Admin Portal.

---

## 2. Typography System
- **Primary Typeface**: `Plus Jakarta Sans`, `Inter`, -apple-system, BlinkMacSystemFont, sans-serif
- **Code / Monospace**: `JetBrains Mono`, `ui-monospace`, monospace

| Scale | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| **Display** | 32px - 36px | 1.2 | 800 (Extrabold) | Hero titles, KPI large metrics |
| **Heading 1** | 24px - 28px | 1.25 | 700 (Bold) | Page titles, major modal headers |
| **Heading 2** | 18px - 20px | 1.3 | 700 (Bold) | Section headers, card titles |
| **Body Large** | 15px - 16px | 1.5 | 500 / 600 | Emphasized text, lead inputs |
| **Body Base** | 13px - 14px | 1.5 | 400 (Regular) | Standard data tables, form inputs |
| **Caption / Badge** | 11px - 12px | 1.4 | 600 (Semibold) | Meta info, badges, pills, timestamps |

---

## 3. Color Tokens

### Surface & Backgrounds
| Token | Hex Value | Usage |
|---|---|---|
| `--color-admin-bg` | `#F8FAFC` | Page background (slate-50 tint) |
| `--color-admin-surface` | `#FFFFFF` | Cards, modals, sidebars |
| `--color-admin-border` | `#E2E8F0` | Default component borders |
| `--color-admin-border-subtle` | `#F1F5F9` | Dividers, subtle cell borders |

### Text Hierarchy
| Token | Hex Value | Usage |
|---|---|---|
| `--color-admin-text` | `#0F172A` | Primary text, headings (Slate-900) |
| `--color-admin-text-muted` | `#64748B` | Secondary text, descriptions (Slate-500) |
| `--color-admin-text-subtle` | `#94A3B8` | Placeholders, inactive icons (Slate-400) |

### Brand Accents
| Token | Hex Value | Usage |
|---|---|---|
| `--color-violet` | `#7F5AF0` | CineMeow signature brand accent |
| `--color-admin-primary` | `#6366F1` | Primary CTA buttons, active tabs |
| `--color-admin-primary-hover` | `#4F46E5` | Button hover state |

### Functional / Feedback Colors
| State | Background | Border | Text |
|---|---|---|---|
| **Success** | `#ECFDF5` (`emerald-50`) | `#A7F3D0` | `#047857` (`emerald-700`) |
| **Warning** | `#FFFBEB` (`amber-50`) | `#FDE68A` | `#B45309` (`amber-700`) |
| **Danger** | `#FEF2F2` (`rose-50`) | `#FECDD3` | `#B91C1C` (`rose-700`) |
| **Info** | `#F0F9FF` (`sky-50`) | `#BAE6FD` | `#0369A1` (`sky-700`) |

---

## 4. Components & Form Guidelines

### Input Fields
- **No redundant labels** when placeholders are self-explanatory.
- **Height**: 44px - 48px (`h-11` to `h-12`) for clean ergonomics.
- **Normal state**: `bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl`.
- **Focus state**: `bg-white border-violet-600 ring-4 ring-violet-500/10 outline-none`.
- **Error state**: `border-rose-400 focus:border-rose-500 focus:ring-rose-500/15`.

### Buttons
- **Primary Action**: Gradient `from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-violet-600/20 active:scale-[0.99]`.
- **Secondary / Ghost**: `bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-sm`.
- **Pill Badges**: `px-2.5 py-1 rounded-full text-xs font-semibold`.

### Cards & Elevation
- **Card**: `bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs`.
- **Subtle Ambient Backdrop**: Radial gradients with light blur on slate backgrounds.

### Page Header Banner Standard (Quy Chuẩn Tiêu Đề & Thanh Hành Động Trang)
Lấy trang **Quản Lý Suất Chiếu (`ShowtimePage`)** làm chuẩn mực thống nhất cho toàn bộ các trang Quản trị Admin (`CinemaManagementPage`, `MovieManagementPage`, `BrandManagementPage`, `PricingManagementPage`, `FnBManagementPage`, `PromotionManagementPage`):

1. **Khung chứa Header**:
   - `flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6`

2. **Cột Tiêu đề (Bên Trái)**:
   - **H2 Tiêu đề**:
     `h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5"`
     - Icon biểu trưng trang: `<[PageIcon] className="text-violet-600" />`
     - Tên trang: `<span>[Tên Trang]</span>`
   - **Mô tả phụ (Subtitle)**:
     `p className="text-xs text-slate-400 font-medium mt-1"`
     - Chú thích rõ ràng, súc tích về chức năng và phạm vi quản trị của trang.
   - *Quy tắc*: Loại bỏ breadcrumbs rườm rà hoặc pill badge phụ phía trên/trong h2 để đảm bảo độ thoáng và tính nhất quán tuyệt đối.

3. **Cột Hành động (Bên Phải)**:
   - Khung chứa: `flex items-center gap-2.5`
   - **Nút "Làm mới" (Outlined Refresh Button)**:
     ```jsx
     <Button
         variant="outlined"
         onClick={handleRefresh}
         startIcon={<RefreshOutlinedIcon />}
         sx={{
             textTransform: "none",
             fontWeight: 700,
             fontSize: "12px",
             borderRadius: "12px",
             borderColor: "#E2E8F0",
             color: "#475569",
             "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
         }}
     >
         Làm mới
     </Button>
     ```
   - **Nút Hành Động Chính (Contained Primary Button)**:
     ```jsx
     <Button
         variant="contained"
         onClick={handlePrimaryAction}
         startIcon={<AddOutlinedIcon />}
         sx={{
             textTransform: "none",
             fontWeight: 800,
             fontSize: "12px",
             borderRadius: "12px",
             background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
             boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
             "&:hover": {
                 background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
             },
         }}
     >
         [Tên Hành Động]
     </Button>
     ```

### Stats KPI Overview Grid Standard (Quy Chuẩn Thẻ Thống Kê Tổng Quan)
Toàn bộ các trang quản trị admin bắt buộc sử dụng CSS Grid đồng bộ thay vì flex/MUI Grid để đảm bảo các thẻ chia đều 100% kích thước, khoảng cách hoàn hảo và không bị tràn lề:
1. **Khung chứa Grid**:
   - `className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"`
2. **Thành phần hiển thị (`StatCard`)**:
   - **Kích thước tiêu chuẩn**: `minHeight: { xs: 104, sm: 110 }`, padding `p: { xs: 2, sm: 2.25 }`, gap `2`.
   - **Typography**:
     - Tiêu đề: `text-transform: uppercase`, font `11px`, `fontWeight: 700`, `whiteSpace: nowrap`.
     - Giá trị số (`value`): Căn chỉnh responsive tự động (nếu chuỗi dài > 5 ký tự như tiền tệ thì dùng font `22px`, ngắn thì dùng `28px`), `whiteSpace: nowrap` chống gãy dòng làm giãn thẻ.
     - Phụ đề (`subtitle`): font `11px`, `fontWeight: 500`, `whiteSpace: nowrap`.
   - **Nội dung thẻ thứ 4**: Luôn là chỉ số phân loại nghiệp vụ chuẩn mực (ví dụ: số định dạng phòng chiếu, phân hạng ghế, khu vực phủ sóng) thay vì khoảng tỷ lệ phần trăm phụ thu.

### Toolbar Controls: Search Input & Filter/Sort Dropdown
Toàn bộ các trang danh sách quản trị (`CinemaManagementPage`, `ShowtimePage`, `BrandManagementPage`, `PricingManagementPage`, `MovieManagementPage`, `FnBManagementPage`, `PromotionManagementPage`) bắt buộc áp dụng chuẩn thanh công cụ tìm kiếm và bộ lọc sắp xếp đồng bộ:

1. **Khung chứa Toolbar**:
   - `p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4`

2. **Ô tìm kiếm chuẩn (Search Input)**:
   ```jsx
   <div className="relative flex-1 min-w-[240px] max-w-md">
       <SearchOutlinedIcon
           sx={{ fontSize: 18 }}
           className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
       />
       <input
           type="text"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
           placeholder="Tìm kiếm..."
           className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs placeholder:text-slate-400 text-slate-800"
       />
       {searchQuery && (
           <button
               type="button"
               onClick={() => setSearchQuery("")}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
           >
               <CloseOutlinedIcon sx={{ fontSize: 15 }} />
           </button>
       )}
   </div>
   ```

3. **Dropdown Bộ Lọc & Sắp Xếp chuẩn (Sort / Filter Select)**:
   - Tuyệt đối không dùng MUI `TextField select` gây lệch chiều cao và font chữ.
   - Áp dụng cấu trúc `select` bo góc `rounded-xl`, chiều cao khớp chuẩn ô tìm kiếm (`py-2`), có icon dẫn đầu `FilterListOutlinedIcon` và chevron tùy chỉnh `KeyboardArrowDownIcon`:
   ```jsx
   <div className="relative min-w-[200px]">
       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
           <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
       </div>
       <select
           value={sortBy}
           onChange={(e) => setSortBy(e.target.value)}
           className="w-full pl-8.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
       >
           <option value="DEFAULT">Sắp xếp: Mặc định</option>
           <option value="...">...</option>
       </select>
       <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
           <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
       </div>
   </div>
   ```

4. **Nút đặt lại (Reset Filters)** & **Huy hiệu đếm (Count Badge)**:
   - Nút đặt lại: `px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer`.
   - Huy hiệu đếm: `px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600 flex items-center gap-1.5` kết hợp đèn xung xanh `w-2 h-2 rounded-full bg-emerald-500 animate-pulse`.

5. **Quy chuẩn Toolbar Đa Bộ Lọc (Multi-Filter 2-Row Layout)**:
   - Đối với các trang có từ 3 bộ lọc trở lên (ví dụ: `ShowtimePage`, `FnBManagementPage`), **bắt buộc tách Toolbar thành 2 hàng** để tránh hiện tượng khi xuất hiện nút "Đặt lại" sẽ ép panel đếm số lượng rơi xuống dòng làm vỡ bố cục:
     - **Hàng 1**: Quick Tabs phân loại/trạng thái (bên trái) + Nút "Đặt lại" và Panel đếm số lượng (bên phải).
     - **Hàng 2**: Ô tìm kiếm co giãn linh hoạt (`flex-1`) + Các dropdown bộ lọc còn lại (`Brand`, `Status`, `Sort`).

---

## 5. Modal & Dialog System
All Admin Modals (`ShowtimeModal`, `MovieModal`, `CinemaModal`, `RoomModal`, etc.) strictly conform to the unified standard in [`ADMIN_MODAL_STANDARD.md`](./ADMIN_MODAL_STANDARD.md):
- **Paper**: `borderRadius: 24px`, `maxHeight: 92vh`, `boxShadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35)`.
- **Top Stripe**: `h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500`.
- **Header**: Icon box (44x44px `rounded-2xl`), title (`text-lg font-black`), mode badge (`Tạo mới` / `Cập nhật`), close button (36x36px `rounded-xl`).
- **Footer**: Sticky bottom bar with asterisk hint, Cancel button (`rounded-xl border border-slate-200`), and Primary gradient button with spinner and check icon.

