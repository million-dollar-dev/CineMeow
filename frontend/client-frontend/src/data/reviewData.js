export const REVIEW_CATEGORIES = [
    { id: "all", label: "Tất cả review", icon: "🎬" },
    { id: "now-playing", label: "Phim đang chiếu", icon: "🎟️" },
    { id: "top-rated", label: "Điểm cao nhất (9.0+)", icon: "⭐" },
    { id: "most-discussed", label: "Sôi nổi nhất", icon: "🔥" }
];

export const REVIEW_STATS = {
    averageRating: "4.8 / 5.0",
    totalMovies: "520+",
    totalComments: "48.5K+",
    verifiedReviewers: "19.2K+"
};

export const MOVIE_REVIEWS_DATA = [
    {
        id: "dune-part-two",
        movieId: "693134",
        title: "Dune: Hành Tinh Cát - Phần Hai",
        originalTitle: "Dune: Part Two",
        poster: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg",
        rating: 9.6,
        ratingCount: "12.8K đánh giá",
        genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Hành động"],
        duration: "166 phút",
        releaseYear: "2024",
        consensus: "Tuyệt tác điện ảnh sci-fi đương đại, trải nghiệm đỉnh cao thị giác và âm thanh Hans Zimmer trên màn hình IMAX.",
        category: "top-rated",
        isHot: true,
        commentsCount: "8.4K",
        likesCount: 1420,
        featuredReview: {
            user: "Lê Minh Quân",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            role: "Khán giả VIP",
            score: 10,
            time: "1 giờ trước",
            content: "Một kiệt tác không lời nào diễn tả hết! Âm thanh Dolby Atmos rung chuyển từng thớ ghế, góc quay của Greig Fraser đẹp như tranh vẽ. Cảnh cưỡi sâu cát xứng đáng đi vào lịch sử điện ảnh."
        },
        recentComments: [
            {
                user: "Trần Bảo Ngọc",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
                score: 9.5,
                time: "3 giờ trước",
                content: "Diễn xuất của Timothée Chalamet trong nửa cuối phim thực sự bùng nổ, sự chuyển biến tâm lý từ cậu thiếu niên thành đấng cứu thế quá thuyết phục."
            },
            {
                user: "Đỗ Hoàng Long",
                avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
                score: 9.0,
                time: "5 giờ trước",
                content: "Phim dài gần 3 tiếng mà xem không thấy mệt phút nào. Khuyên thật lòng các bạn phải đi xem IMAX để cảm nhận hết độ hoành tráng."
            }
        ]
    },
    {
        id: "conan-million-dollar-star",
        movieId: "1214484",
        title: "Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô",
        originalTitle: "Detective Conan: The Million-dollar Pentagram",
        poster: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8f9sUXp0E7bW87gN2KkG59pD9uC.jpg",
        rating: 9.4,
        ratingCount: "10.2K đánh giá",
        genres: ["Hoạt hình", "Trinh thám", "Hành động"],
        duration: "110 phút",
        releaseYear: "2024",
        consensus: "Màn so tài mãn nhãn giữa Kaito Kid, Heiji Hattori và Conan với cú twist chấn động về thân thế gia tộc.",
        category: "now-playing",
        isHot: true,
        commentsCount: "6.9K",
        likesCount: 980,
        featuredReview: {
            user: "Huỳnh Ngọc Hùng",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            role: "Fan cứng Conan 15 năm",
            score: 9.8,
            time: "2 giờ trước",
            content: "Cảnh rượt đuổi bằng kiếm đạo ở Hakodate đỉnh chóp! Plot twist cuối phim về quan hệ giữa Conan và Kid khiến cả rạp vỗ tay rần rần. Rất đáng tiền vé!"
        },
        recentComments: [
            {
                user: "Mai Phương Thảo",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                score: 9.2,
                time: "4 giờ trước",
                content: "Nhạc phim của Aiko hay xúc động, Heiji tỏ tình với Kazuha hài hước mà ngọt ngào dã man."
            },
            {
                user: "Phạm Quốc Tuấn",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
                score: 9.0,
                time: "6 giờ trước",
                content: "Hình ảnh vẽ cực kỳ trau chuốt, chi tiết cảnh đêm Hakodate lung linh huyền ảo."
            }
        ]
    },
    {
        id: "deadpool-and-wolverine",
        movieId: "533535",
        title: "Deadpool & Wolverine: Song Đấu Tối Thượng",
        originalTitle: "Deadpool & Wolverine",
        poster: "https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        rating: 9.2,
        ratingCount: "15.4K đánh giá",
        genres: ["Hành động", "Hài hước", "Siêu anh hùng"],
        duration: "128 phút",
        releaseYear: "2024",
        consensus: "Bữa tiệc hành động bùng nổ, hài bựa đỉnh cao và ngập tràn cameo hoài niệm tri ân kỷ nguyên 20th Century Fox.",
        category: "most-discussed",
        isHot: true,
        commentsCount: "11.2K",
        likesCount: 2310,
        featuredReview: {
            user: "Vũ Tuấn Kiệt",
            avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
            role: "Marvel Fanatic",
            score: 9.5,
            time: "1 ngày trước",
            content: "Sự kết hợp giữa Ryan Reynolds và Hugh Jackman vượt ngoài kỳ vọng. Cảnh mở đầu với điệu nhảy 'Bye Bye Bye' xứng đáng 10 điểm không có nhưng!"
        },
        recentComments: [
            {
                user: "Nguyễn Thu Hà",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
                score: 9.0,
                time: "1 ngày trước",
                content: "Cười từ đầu phim đến cuối phim, các easter egg xuất hiện liên tục không kịp chớp mắt."
            }
        ]
    },
    {
        id: "oppenheimer",
        movieId: "872585",
        title: "Oppenheimer: Cha Đẻ Bom Nguyên Tử",
        originalTitle: "Oppenheimer",
        poster: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
        rating: 9.5,
        ratingCount: "18.1K đánh giá",
        genres: ["Lịch sử", "Chính kịch", "Tiểu sử"],
        duration: "180 phút",
        releaseYear: "2023",
        consensus: "Tuyệt tác để đời của Christopher Nolan, đào sâu vào nỗi ám ảnh đạo đức và sức tàn phá của vũ khí hạt nhân.",
        category: "top-rated",
        isHot: false,
        commentsCount: "9.5K",
        likesCount: 1890,
        featuredReview: {
            user: "Hoàng Anh Đức",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
            role: "Nhà phê bình phim",
            score: 10,
            time: "3 ngày trước",
            content: "Cảnh thử nghiệm Trinity: sự im lặng nghẹt thở trước khi sóng xung kích ập tới là một trong những khoảnh khắc điện ảnh đáng sợ và vĩ đại nhất từng được quay dựng."
        },
        recentComments: [
            {
                user: "Đinh Trọng Phát",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
                score: 9.4,
                time: "4 ngày trước",
                content: "Cillian Murphy xứng đáng với tượng vàng Oscar! Diễn xuất bằng ánh mắt quá ám ảnh."
            }
        ]
    },
    {
        id: "how-to-train-your-dragon-live-action",
        movieId: "1084199",
        title: "Bí Kíp Luyện Rồng (Live-Action)",
        originalTitle: "How to Train Your Dragon",
        poster: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8f9sUXp0E7bW87gN2KkG59pD9uC.jpg",
        rating: 9.0,
        ratingCount: "5.7K đánh giá",
        genres: ["Gia đình", "Phiêu lưu", "Kỳ ảo"],
        duration: "115 phút",
        releaseYear: "2025",
        consensus: "Tái hiện trung thành cảm xúc của bản hoạt hình huyền thoại với kỹ xảo rồng Toothless sống động và giàu tình cảm.",
        category: "now-playing",
        isHot: true,
        commentsCount: "3.8K",
        likesCount: 820,
        featuredReview: {
            user: "Phạm Lê Hoài Thanh",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
            role: "Thành viên CineClub",
            score: 9.0,
            time: "2 ngày trước",
            content: "Toothless lên bản live-action vẫn cực kỳ đáng yêu! Đoạn bay lượn trên biển nhạc cất lên làm nổi cả da gà. Rất thích hợp cho cả gia đình đi xem cuối tuần."
        },
        recentComments: [
            {
                user: "Lê Kim Thiện An",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                score: 8.8,
                time: "3 ngày trước",
                content: "Bối cảnh hòn đảo Berk dựng thật hùng vĩ, diễn viên đóng Hiccup rất hợp vai."
            }
        ]
    },
    {
        id: "lat-mat-7-mot-dieu-uoc",
        movieId: "1248039",
        title: "Lật Mặt 7: Một Điều Ước",
        originalTitle: "Face Off 7: One Wish",
        poster: "https://image.tmdb.org/t/p/w780/unthV1mq9llhEinIMPcCUImFodt.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/8f9sUXp0E7bW87gN2KkG59pD9uC.jpg",
        rating: 8.9,
        ratingCount: "14.2K đánh giá",
        genres: ["Gia đình", "Tâm lý", "Tình cảm"],
        duration: "138 phút",
        releaseYear: "2024",
        consensus: "Câu chuyện xúc động về tình mẫu tử của đạo diễn Lý Hải lấy đi nước mắt của hàng triệu khán giả mọi thế hệ.",
        category: "most-discussed",
        isHot: false,
        commentsCount: "8.1K",
        likesCount: 1650,
        featuredReview: {
            user: "Trịnh Tuấn Anh",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            role: "Khán giả thân thiết",
            score: 9.0,
            time: "5 ngày trước",
            content: "Phim chân thật, mộc mạc và chạm đến trái tim. Diễn xuất của bà Hai (nghệ sĩ Thanh Hiền) làm cả rạp khóc nức nở. Đưa bố mẹ đi xem là lựa chọn tuyệt vời nhất."
        },
        recentComments: [
            {
                user: "Vũ Thị Lan",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
                score: 9.2,
                time: "6 ngày trước",
                content: "Bối cảnh làng K'Long K'Lanh ở Lạc Dương quá đẹp, nhạc phim ca khúc 'Vẽ Lại Bức Tranh' của Bùi Anh Tuấn xúc động vô cùng."
            }
        ]
    }
];
