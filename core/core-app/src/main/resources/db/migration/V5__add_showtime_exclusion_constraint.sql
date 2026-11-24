-- =============================================================================
-- Migration: V5__add_showtime_exclusion_constraint.sql
-- Description: Kích hoạt btree_gist, bổ sung transition buffer và Exclusion Constraint (CM-000007)
-- =============================================================================

-- Bước 1: Kích hoạt extension btree_gist để hỗ trợ toán tử = trên room_id trong GiST index
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
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'exclude_overlapping_showtimes'
    ) THEN
        ALTER TABLE show_times
        ADD CONSTRAINT exclude_overlapping_showtimes
        EXCLUDE USING gist (
            room_id WITH =,
            tsrange(start_time, effective_end_time, '[)') WITH &&
        )
        WHERE (status != 'CANCELLED');
    END IF;
END $$;

-- Bước 5: Tạo Index hỗ trợ truy vấn tìm kiếm nhanh theo khoảng thời gian
CREATE INDEX IF NOT EXISTS idx_showtimes_room_effective_range
ON show_times USING gist (
    room_id,
    tsrange(start_time, effective_end_time, '[)')
);
