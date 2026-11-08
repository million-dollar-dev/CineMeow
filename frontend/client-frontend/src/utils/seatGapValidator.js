/**
 * Utility to enforce the Single-Seat Gap Prevention Rule (CM-000004) on Frontend.
 * Prevents users from booking seats that leave a single isolated empty seat
 * between booked seats or between a booked seat and an aisle/wall.
 */

/**
 * Checks if the selected seats create any new single isolated empty seat.
 *
 * @param {Array} allSeats - List of all seats in the room layout.
 * @param {Array|Set} selectedSeatIds - Selected seat objects or seat IDs.
 * @returns {{ valid: boolean, violatedSeat: object|null, message: string|null }}
 */
export const checkSeatGapRule = (allSeats, selectedSeatIds) => {
    if (!Array.isArray(allSeats) || allSeats.length === 0) {
        return { valid: true, violatedSeat: null, message: null };
    }

    const selectedSet = new Set(
        Array.isArray(selectedSeatIds)
            ? selectedSeatIds.map((s) => (typeof s === "object" && s !== null ? s.id : s))
            : selectedSeatIds
    );

    if (selectedSet.size === 0) {
        return { valid: true, violatedSeat: null, message: null };
    }

    // Group non-empty seats by rowIndex
    const rows = {};
    allSeats.forEach((seat) => {
        if (seat.type !== "EMPTY") {
            const row = seat.rowIndex ?? 0;
            if (!rows[row]) rows[row] = [];
            rows[row].push(seat);
        }
    });

    // Check rows containing at least one of the selected seats
    for (const rowIndex of Object.keys(rows)) {
        const rowSeats = rows[rowIndex];
        const hasSelectedSeat = rowSeats.some((s) => selectedSet.has(s.id));
        if (!hasSelectedSeat) continue;

        // Sort seats from left to right by colIndex
        rowSeats.sort((a, b) => (a.colIndex ?? 0) - (b.colIndex ?? 0));

        // Partition into contiguous physical segments separated by aisles (colIndex step > 1)
        const segments = partitionIntoContiguousSegments(rowSeats);

        for (const segment of segments) {
            const orphansBefore = findOrphanSeats(segment, new Set());
            const orphansAfter = findOrphanSeats(segment, selectedSet);

            // If the selection increases the number of isolated seats, reject!
            if (orphansAfter.length > orphansBefore.length) {
                const beforeIds = new Set(orphansBefore.map((s) => s.id));
                const newlyCreatedOrphan = orphansAfter.find((s) => !beforeIds.has(s.id)) || orphansAfter[0];

                const seatLabel = newlyCreatedOrphan.label ||
                    `Hàng ${(newlyCreatedOrphan.rowIndex ?? 0) + 1}, Ghế ${(newlyCreatedOrphan.colIndex ?? 0) + 1}`;

                return {
                    valid: false,
                    violatedSeat: newlyCreatedOrphan,
                    message: `Không thể để trống 1 ghế đơn độc (${seatLabel}). Vui lòng chọn ghế liền kề hoặc cách ít nhất 2 ghế.`,
                };
            }
        }
    }

    return { valid: true, violatedSeat: null, message: null };
};

/**
 * Partitions row seats into contiguous segments where colIndex[i] === colIndex[i-1] + 1.
 */
const partitionIntoContiguousSegments = (rowSeats) => {
    const segments = [];
    if (!rowSeats || rowSeats.length === 0) return segments;

    let currentSegment = [rowSeats[0]];

    for (let i = 1; i < rowSeats.length; i++) {
        const prev = rowSeats[i - 1];
        const curr = rowSeats[i];

        if ((curr.colIndex ?? 0) === (prev.colIndex ?? 0) + 1) {
            currentSegment.push(curr);
        } else {
            segments.push(currentSegment);
            currentSegment = [curr];
        }
    }
    segments.push(currentSegment);
    return segments;
};

/**
 * Finds all single isolated empty seats (blocks of contiguous available seats of size == 1).
 */
const findOrphanSeats = (segment, selectedSet) => {
    const orphans = [];
    let currentAvailableBlock = [];

    for (const seat of segment) {
        const isAvailable = (seat.status === "AVAILABLE" || !seat.status) && !selectedSet.has(seat.id);

        if (isAvailable) {
            currentAvailableBlock.push(seat);
        } else {
            if (currentAvailableBlock.length === 1) {
                orphans.push(currentAvailableBlock[0]);
            }
            currentAvailableBlock = [];
        }
    }

    if (currentAvailableBlock.length === 1) {
        orphans.push(currentAvailableBlock[0]);
    }

    return orphans;
};
