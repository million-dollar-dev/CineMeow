/**
 * Mock data for testing and developing the Booking flow (/showtimes/booking/:id)
 * Allows testing full UI/UX without needing backend services online.
 */

export const MOCK_SHOWTIME = {
    id: "mock-showtime-01",
    movieId: "mock-movie-avatar",
    brandId: "mock-brand-cinemeow",
    brandName: "CineMeow Cinemas",
    cinemaId: "mock-cinema-royal",
    cinemaName: "CineMeow Royal City",
    roomId: "mock-room-03",
    roomName: "Phòng Chiếu 03",
    roomType: "_2D",
    startTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
};

export const MOCK_MOVIE = {
    id: "mock-movie-avatar",
    title: "Avatar: Dòng Chảy Của Nước",
    posterUrl: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Hành động"],
    duration: 192,
    ageRating: "T13",
    releaseDate: "2026-10-01",
    description:
        "Lấy bối cảnh hơn một thập kỷ sau các sự kiện của phần phim đầu tiên, gia đình Sully phải đối mặt với những hiểm nguy mới để bảo vệ lẫn nhau.",
};

export const MOCK_PRICES = [
    { seatType: "NORMAL", roomType: "_2D", price: 75000 },
    { seatType: "VIP", roomType: "_2D", price: 95000 },
    { seatType: "COUPLE", roomType: "_2D", price: 160000 },
    { seatType: "NORMAL", roomType: "_3D", price: 105000 },
    { seatType: "VIP", roomType: "_3D", price: 125000 },
    { seatType: "COUPLE", roomType: "_3D", price: 210000 },
    { seatType: "NORMAL", roomType: "_IMAX", price: 155000 },
    { seatType: "VIP", roomType: "_IMAX", price: 185000 },
];

export const MOCK_FNBS = [
    {
        id: "fnb-1",
        name: "Combo Solo Bắp Ngọt",
        price: 85000,
        imageUrl: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80",
        description: "1 Bắp rang bơ ngọt 64oz + 1 Nước ngọt có ga 32oz (Coca/Sprite/Fanta)",
    },
    {
        id: "fnb-2",
        name: "Combo Couple Rực Rỡ",
        price: 135000,
        imageUrl: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&q=80",
        description: "1 Bắp rang bơ phô mai lớn + 2 Nước ngọt có ga 32oz + 1 Snack khoai tây",
    },
    {
        id: "fnb-3",
        name: "Combo CineMeow Party",
        price: 199000,
        imageUrl: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=400&q=80",
        description: "2 Bắp vị Caramel & Phô mai + 4 Nước ngọt + 2 Snack xúc xích nướng",
    },
    {
        id: "fnb-4",
        name: "Bắp Rang Bơ Caramel Size L",
        price: 65000,
        imageUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&q=80",
        description: "Hạt bắp nổ thơm lừng quyện sốt caramel giòn tan hảo hạng",
    },
    {
        id: "fnb-5",
        name: "Trà Đào Cam Sả Tươi",
        price: 45000,
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
        description: "Trà đào mát lạnh kết hợp hương cam sả thơm dịu thanh mát",
    },
];

/**
 * Generates an 8x12 cinema seat grid (Rows A to H, Cols 1 to 12).
 * Row A-C: NORMAL
 * Row D-G: VIP
 * Row H: COUPLE
 */
export const generateMockSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seats = [];

    // Pre-booked seat labels to test disabled/occupied seats
    const occupiedLabels = new Set(["B4", "B5", "D6", "D7", "E6", "E7", "G3"]);

    rows.forEach((rowLetter, rowIndex) => {
        const isCoupleRow = rowLetter === "H";
        const isVipRow = ["D", "E", "F", "G"].includes(rowLetter);

        if (isCoupleRow) {
            // 6 Couple seats across row H
            for (let col = 1; col <= 11; col += 2) {
                const label = `${rowLetter}${col}-${col + 1}`;
                const seatId = `seat-${rowLetter}-${col}`;
                const isOccupied = occupiedLabels.has(`${rowLetter}${col}`);

                seats.push({
                    id: seatId,
                    label,
                    rowIndex,
                    colIndex: col - 1,
                    type: "COUPLE",
                    status: isOccupied ? "OCCUPIED" : "AVAILABLE",
                    reservedUntil: null,
                    bookingId: null,
                });
            }
        } else {
            // Standard 12 seats
            for (let col = 1; col <= 12; col++) {
                const label = `${rowLetter}${col}`;
                const seatId = `seat-${rowLetter}-${col}`;
                const isOccupied = occupiedLabels.has(label);

                seats.push({
                    id: seatId,
                    label,
                    rowIndex,
                    colIndex: col - 1,
                    type: isVipRow ? "VIP" : "NORMAL",
                    status: isOccupied ? "OCCUPIED" : "AVAILABLE",
                    reservedUntil: null,
                    bookingId: null,
                });
            }
        }
    });

    return seats;
};

export const MOCK_SEAT_MAP = {
    roomId: "mock-room-03",
    roomName: "Phòng Chiếu 03",
    totalRows: 8,
    totalCols: 12,
    seats: generateMockSeats(),
};

export const MOCK_VOUCHERS = {
    CINEMEOW20: {
        valid: true,
        code: "CINEMEOW20",
        discountAmount: 20000,
        message: "Áp dụng mã giảm giá CINEMEOW20 (-20.000₫)",
    },
    MEOW50K: {
        valid: true,
        code: "MEOW50K",
        discountAmount: 50000,
        message: "Áp dụng mã giảm giá MEOW50K (-50.000₫)",
    },
    VIP2026: {
        valid: true,
        code: "VIP2026",
        discountAmount: 30000,
        message: "Áp dụng mã giảm giá thành viên VIP2026 (-30.000₫)",
    },
};
