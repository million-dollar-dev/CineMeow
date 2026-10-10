import dayjs from "dayjs";

export const MOCK_BRANDS = [
    {
        id: "cgv",
        name: "CGV Cinema",
        logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
    },
    {
        id: "bhd",
        name: "BHD Star",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
    },
    {
        id: "lotte",
        name: "Lotte Cinema",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104719-637644580392942838.png",
    },
    {
        id: "galaxy",
        name: "Galaxy Cinema",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104644-637644580047392686.png",
    },
    {
        id: "beta",
        name: "Beta Cinemas",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104603-637644579633857850.png",
    },
    {
        id: "cinestar",
        name: "Cinestar",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104631-637644579918239088.png",
    },
    {
        id: "megags",
        name: "Mega GS",
        logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104740-637644580602324908.png",
    },
];

export const MOCK_CINEMAS = [
    {
        id: "cgv-hung-vuong",
        name: "CGV Hùng Vương Plaza",
        address: "Tầng 7, Hùng Vương Plaza, 126 Hùng Vương, Quận 5, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "cgv",
        brand: {
            id: "cgv",
            name: "CGV Cinema",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
        },
        formats: ["2D", "3D", "IMAX"],
        phone: "1900 6017",
    },
    {
        id: "cgv-landmark-81",
        name: "CGV Vincom Landmark 81",
        address: "Tầng B1, Vincom Center Landmark 81, 772 Điện Biên Phủ, P.22, Bình Thạnh, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "cgv",
        brand: {
            id: "cgv",
            name: "CGV Cinema",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
        },
        formats: ["2D", "IMAX", "Gold Class"],
        phone: "1900 6017",
    },
    {
        id: "cgv-su-van-hanh",
        name: "CGV Vạn Hạnh Mall",
        address: "Tầng 6, Vạn Hạnh Mall, 11 Sư Vạn Hạnh, Phường 12, Quận 10, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "cgv",
        brand: {
            id: "cgv",
            name: "CGV Cinema",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
        },
        formats: ["2D", "3D", "4DX"],
        phone: "1900 6017",
    },
    {
        id: "bhd-bitexco",
        name: "BHD Star Bitexco",
        address: "Tầng 3 & 4, TTTM Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "bhd",
        brand: {
            id: "bhd",
            name: "BHD Star",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
        },
        formats: ["2D", "3D"],
        phone: "1900 2099",
    },
    {
        id: "bhd-thao-dien",
        name: "BHD Star Thảo Điền",
        address: "Tầng 5, Vincom Mega Mall, 159 Xa Lộ Hà Nội, Thảo Điền, TP. Thủ Đức, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "bhd",
        brand: {
            id: "bhd",
            name: "BHD Star",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
        },
        formats: ["2D", "3D", "First Class"],
        phone: "1900 2099",
    },
    {
        id: "lotte-cantavil",
        name: "Lotte Cinema Cantavil",
        address: "Tầng 7, Cantavil Premier, An Phú, TP. Thủ Đức, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "lotte",
        brand: {
            id: "lotte",
            name: "Lotte Cinema",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104719-637644580392942838.png",
        },
        formats: ["2D", "3D"],
        phone: "028 3740 6777",
    },
    {
        id: "lotte-nowzone",
        name: "Lotte Cinema Nowzone",
        address: "Tầng 5, TTTM Nowzone, 235 Nguyễn Văn Cừ, Quận 1, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "lotte",
        brand: {
            id: "lotte",
            name: "Lotte Cinema",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104719-637644580392942838.png",
        },
        formats: ["2D"],
        phone: "028 3926 2255",
    },
    {
        id: "galaxy-nguyen-du",
        name: "Galaxy Nguyễn Du",
        address: "116 Nguyễn Du, Phường Bến Thành, Quận 1, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "galaxy",
        brand: {
            id: "galaxy",
            name: "Galaxy Cinema",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104644-637644580047392686.png",
        },
        formats: ["2D", "3D"],
        phone: "1900 2224",
    },
    {
        id: "beta-quang-trung",
        name: "Beta Cinemas Quang Trung",
        address: "645 Quang Trung, Phường 11, Gò Vấp, TP.HCM",
        city: "Hồ Chí Minh",
        brandId: "beta",
        brand: {
            id: "beta",
            name: "Beta Cinemas",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104603-637644579633857850.png",
        },
        formats: ["2D"],
        phone: "1800 646 420",
    },
    // Hà Nội
    {
        id: "cgv-vincom-ba-trieu",
        name: "CGV Vincom Bà Triệu",
        address: "Tầng 6, Vincom Center Hanoi, 191 Bà Triệu, Hai Bà Trưng, Hà Nội",
        city: "Hà Nội",
        brandId: "cgv",
        brand: {
            id: "cgv",
            name: "CGV Cinema",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
        },
        formats: ["2D", "3D", "IMAX"],
        phone: "1900 6017",
    },
    {
        id: "bhd-pham-ngoc-thach",
        name: "BHD Star Vincom Phạm Ngọc Thạch",
        address: "Tầng 8, Vincom Center, 2 Phạm Ngọc Thạch, Đống Đa, Hà Nội",
        city: "Hà Nội",
        brandId: "bhd",
        brand: {
            id: "bhd",
            name: "BHD Star",
            logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png",
        },
        formats: ["2D", "3D"],
        phone: "1900 2099",
    },
    // Đà Nẵng
    {
        id: "cgv-vinh-trung-plaza",
        name: "CGV Vĩnh Trung Plaza",
        address: "255-257 Hùng Vương, Thanh Khê, TP. Đà Nẵng",
        city: "Đà Nẵng",
        brandId: "cgv",
        brand: {
            id: "cgv",
            name: "CGV Cinema",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png",
        },
        formats: ["2D", "3D"],
        phone: "1900 6017",
    },
];

// Helper to generate dynamic mock showtimes for any given date
export const generateMockMoviesForDate = (dateStr) => {
    const d = dayjs(dateStr).format("YYYY-MM-DD");

    return [
        {
            id: "movie-1",
            title: "Bộ Tứ Siêu Đẳng: Bước Đi Đầu Tiên",
            posterPath: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg",
            genres: "Khoa học viễn tưởng, Hành động, Phiêu lưu",
            duration: "135 phút",
            rating: "T13",
            showtimes: [
                { id: `st-${d}-1-1`, startTime: `${d}T09:15:00`, endTime: `${d}T11:30:00`, roomName: "Rạp 1", roomType: "2D Phụ đề" },
                { id: `st-${d}-1-2`, startTime: `${d}T11:45:00`, endTime: `${d}T14:00:00`, roomName: "Rạp 2", roomType: "2D Phụ đề" },
                { id: `st-${d}-1-3`, startTime: `${d}T14:30:00`, endTime: `${d}T16:45:00`, roomName: "Rạp 1", roomType: "2D Phụ đề" },
                { id: `st-${d}-1-4`, startTime: `${d}T17:15:00`, endTime: `${d}T19:30:00`, roomName: "Rạp 3 (IMAX)", roomType: "IMAX 2D" },
                { id: `st-${d}-1-5`, startTime: `${d}T20:00:00`, endTime: `${d}T22:15:00`, roomName: "Rạp 3 (IMAX)", roomType: "IMAX 2D" },
                { id: `st-${d}-1-6`, startTime: `${d}T22:30:00`, endTime: `${d}T00:45:00`, roomName: "Rạp 2", roomType: "2D Phụ đề" },
            ]
        },
        {
            id: "movie-2",
            title: "Dune: Hành Tinh Cát - Phần Hai",
            posterPath: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
            genres: "Khoa học viễn tưởng, Phiêu lưu, Kịch tính",
            duration: "166 phút",
            rating: "T16",
            showtimes: [
                { id: `st-${d}-2-1`, startTime: `${d}T10:00:00`, endTime: `${d}T12:45:00`, roomName: "Rạp 4", roomType: "2D Phụ đề" },
                { id: `st-${d}-2-2`, startTime: `${d}T13:30:00`, endTime: `${d}T16:15:00`, roomName: "Rạp 3 (IMAX)", roomType: "IMAX 2D" },
                { id: `st-${d}-2-3`, startTime: `${d}T18:00:00`, endTime: `${d}T20:45:00`, roomName: "Rạp 4", roomType: "2D Phụ đề" },
                { id: `st-${d}-2-4`, startTime: `${d}T21:15:00`, endTime: `${d}T00:00:00`, roomName: "Rạp 1", roomType: "2D Phụ đề" },
            ]
        },
        {
            id: "movie-3",
            title: "Kẻ Trộm Mặt Trăng 4 (Despicable Me 4)",
            posterPath: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
            genres: "Hoạt hình, Hài hước, Gia đình",
            duration: "95 phút",
            rating: "P",
            showtimes: [
                { id: `st-${d}-3-1`, startTime: `${d}T09:00:00`, endTime: `${d}T10:35:00`, roomName: "Rạp 5", roomType: "2D Lồng tiếng" },
                { id: `st-${d}-3-2`, startTime: `${d}T11:00:00`, endTime: `${d}T12:35:00`, roomName: "Rạp 5", roomType: "2D Lồng tiếng" },
                { id: `st-${d}-3-3`, startTime: `${d}T14:00:00`, endTime: `${d}T15:35:00`, roomName: "Rạp 2", roomType: "2D Phụ đề" },
                { id: `st-${d}-3-4`, startTime: `${d}T16:00:00`, endTime: `${d}T17:35:00`, roomName: "Rạp 5", roomType: "2D Lồng tiếng" },
                { id: `st-${d}-3-5`, startTime: `${d}T19:00:00`, endTime: `${d}T20:35:00`, roomName: "Rạp 2", roomType: "2D Phụ đề" },
            ]
        },
        {
            id: "movie-4",
            title: "Deadpool & Wolverine",
            posterPath: "https://image.tmdb.org/t/p/w600_and_h900_bestv2/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
            genres: "Hành động, Hài, Viễn tưởng",
            duration: "128 phút",
            rating: "T18",
            showtimes: [
                { id: `st-${d}-4-1`, startTime: `${d}T13:00:00`, endTime: `${d}T15:10:00`, roomName: "Rạp 6", roomType: "2D Phụ đề" },
                { id: `st-${d}-4-2`, startTime: `${d}T16:30:00`, endTime: `${d}T18:40:00`, roomName: "Rạp 6", roomType: "2D Phụ đề" },
                { id: `st-${d}-4-3`, startTime: `${d}T19:30:00`, endTime: `${d}T21:40:00`, roomName: "Rạp 6", roomType: "2D Phụ đề" },
                { id: `st-${d}-4-4`, startTime: `${d}T22:00:00`, endTime: `${d}T00:10:00`, roomName: "Rạp 4", roomType: "2D Phụ đề" },
            ]
        },
    ];
};
