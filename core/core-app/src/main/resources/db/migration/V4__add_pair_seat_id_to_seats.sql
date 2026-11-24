-- =============================================================================
-- Migration: V4__add_pair_seat_id_to_seats.sql
-- Description: Thêm trường pair_seat_id để quản lý liên kết ghế đôi Sweetbox (CM-000008)
-- =============================================================================

-- Bước 1: Thêm cột pair_seat_id vào bảng seats
ALTER TABLE seats
ADD COLUMN IF NOT EXISTS pair_seat_id BIGINT;

-- Bước 2: Thêm ràng buộc khóa ngoại tự tham chiếu
ALTER TABLE seats
ADD CONSTRAINT fk_seats_pair_seat
FOREIGN KEY (pair_seat_id) REFERENCES seats(id)
ON DELETE SET NULL;

-- Bước 3: Tạo Index tối ưu hóa truy vấn tìm kiếm ghế cặp
CREATE INDEX IF NOT EXISTS idx_seats_pair_seat_id
ON seats (pair_seat_id)
WHERE pair_seat_id IS NOT NULL;

-- Bước 4: Tự động ghép cặp các ghế COUPLE hiện có trên cùng hàng
WITH couple_pairs AS (
    SELECT 
        s1.id AS seat1_id,
        s2.id AS seat2_id
    FROM seats s1
    JOIN seats s2 ON s1.room_id = s2.room_id 
                 AND s1.row_index = s2.row_index 
                 AND s1.type = 'COUPLE' 
                 AND s2.type = 'COUPLE'
                 AND s2.column_index = s1.column_index + 1
                 AND (s1.column_index % 2) = 1
)
UPDATE seats
SET pair_seat_id = CASE 
    WHEN seats.id = cp.seat1_id THEN cp.seat2_id
    WHEN seats.id = cp.seat2_id THEN cp.seat1_id
END
FROM couple_pairs cp
WHERE seats.id = cp.seat1_id OR seats.id = cp.seat2_id;
