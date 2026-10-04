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
        backdrop: "https://image.tmdb.org/t/p/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
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
        backdrop: "https://image.tmdb.org/t/p/w1280/unthV1mq9llhEinIMPcCUImFodt.jpg",
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
        poster: "https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
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
        poster: "https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        backdrop: "https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
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

export const DEFAULT_COMMUNITY_REVIEWS = [
    {
        id: "cr-1",
        user: "Trần Minh Hoàng",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        role: "Cinephile Bạch Kim",
        score: 9.8,
        date: "2 giờ trước",
        content: "Trải nghiệm rạp chiếu không thể chê vào đâu được! Âm thanh vòm rung chuyển sống động, từng khung hình đẹp như một bức tranh nghệ thuật. Cảm xúc trọn vẹn từ phút đầu đến tận credit cuối cùng.",
        tags: ["Đáng tiền vé", "Kỹ xảo mãn nhãn", "Nhạc phim xuất sắc"],
        verifiedTicket: true,
        likes: 38
    },
    {
        id: "cr-2",
        user: "Nguyễn Thảo Ly",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        role: "Khán giả rạp",
        score: 9.5,
        date: "5 giờ trước",
        content: "Kịch bản xây dựng rất lớp lang, cao trào hồi ba giải quyết vấn đề cực kỳ thông minh. Dàn diễn viên nhập vai quá đạt, ánh mắt và cử chỉ đều chạm đến cảm xúc người xem.",
        tags: ["Kịch tính gay cấn", "Diễn xuất đỉnh cao"],
        verifiedTicket: true,
        likes: 24
    },
    {
        id: "cr-3",
        user: "Đặng Tuấn Kiệt",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
        role: "Thành viên VIP CineMeow",
        score: 9.0,
        date: "Hôm qua",
        content: "Phim xem rất cuốn, không khí trong rạp hồi hộp từng giây. Ai thích thể loại này thì nhất định phải ra rạp xem màn hình lớn mới cảm nhận hết được sự đầu tư công phu.",
        tags: ["Đáng tiền vé", "Plot twist bất ngờ"],
        verifiedTicket: true,
        likes: 19
    },
    {
        id: "cr-4",
        user: "Lê Quỳnh Chi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        role: "Khán giả rạp",
        score: 8.8,
        date: "2 ngày trước",
        content: "Hình ảnh và bối cảnh được đầu tư khủng, xem rất mãn nhãn. Đoạn giữa nhịp hơi chùng một xíu nhưng đoạn kết cứu vãn mọi thứ, rất đáng khen cho ê-kíp sản xuất.",
        tags: ["Kỹ xảo mãn nhãn", "Cảm động rơi nước mắt"],
        verifiedTicket: false,
        likes: 12
    }
];

export const getMovieEditorialData = (movie) => {
    if (movie?.editorialReview) return movie.editorialReview;
    const title = (movie?.title || "").toLowerCase();
    const movieId = String(movie?.movieId || movie?.id || "");

    if (title.includes("dune") || movieId === "693134") {
        return {
            director: "Denis Villeneuve",
            cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler", "Florence Pugh"],
            duration: "166 phút",
            ageRating: "T16 - Phim dành cho khán giả từ 16 tuổi trở lên",
            aspectRatio: "IMAX 1.43:1 / 1.90:1",
            soundFormat: "Dolby Atmos 7.1",
            verdict: "Dune: Phần Hai là tuyệt tác sci-fi đương đại hiếm hoi tiệm cận chuẩn mực của The Empire Strikes Back hay The Lord of the Rings. Denis Villeneuve đã kiến tạo nên một sử thi cát vàng tráng lệ, vừa choáng ngợp về mặt thị giác vừa đầy sức nặng tâm lý về sự biến chất của quyền lực và đức tin mù quáng.",
            pros: [
                "Hình ảnh tráng lệ của Greig Fraser kết hợp âm thanh gầm vang từ Hans Zimmer",
                "Diễn xuất bùng nổ của Timothée Chalamet và ác nhân Austin Butler (Feyd-Rautha)",
                "Trường đoạn cưỡi sâu cát và đại chiến Arrakeen xứng đáng đi vào lịch sử",
                "Chuyển thể sắc sảo, hiện đại và sâu sắc hơn nguyên tác của Frank Herbert"
            ],
            cons: [
                "Thời lượng dài 166 phút đòi hỏi sự tập trung cao từ người xem",
                "Tuyến tình cảm giữa Paul và Chani có một số biến tấu có thể gây tranh luận với fan truyện cũ"
            ],
            criteria: {
                script: 9.3,
                acting: 9.7,
                visuals: 9.9,
                sound: 9.8
            }
        };
    }

    if (title.includes("conan") || movieId === "1214484") {
        return {
            director: "Chika Nagaoka",
            cast: ["Minami Takayama", "Kappei Yamaguchi", "Ryo Horikawa", "Wakana Yamazaki"],
            duration: "110 phút",
            ageRating: "P - Phim được phép phổ biến đến mọi khán giả",
            aspectRatio: "Widescreen 16:9",
            soundFormat: "Dolby 5.1 / 7.1",
            verdict: "Movie 27 của Thám Tử Conan là bữa tiệc giải trí trọn vẹn dành cho người hâm mộ với những màn đấu kiếm mãn nhãn, sự phối hợp ăn ý giữa Heiji và Conan, cùng cú twist ngoạn mục về dòng máu gia tộc Kuroba - Kudo.",
            pros: [
                "Những màn so kiếm sắc bén trên nóc xe điện Hakodate được dựng công phu",
                "Tương tác duyên dáng, hài hước và ngọt ngào giữa Heiji và Kazuha",
                "Plot twist đắt giá làm bùng nổ cộng đồng người hâm mộ sau gần 30 năm",
                "Nhạc phim 'Soshite, Kimi wa' của Aiko vô cùng bắt tai và xúc động"
            ],
            cons: [
                "Yếu tố suy luận phá án bị giảm nhẹ để nhường đất cho hành động hoành tráng",
                "Số lượng nhân vật xuất hiện đông đúc có thể khiến khán giả mới hơi bối rối"
            ],
            criteria: {
                script: 8.8,
                acting: 9.2,
                visuals: 9.5,
                sound: 9.4
            }
        };
    }

    if (title.includes("deadpool") || movieId === "533535") {
        return {
            director: "Shawn Levy",
            cast: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin", "Matthew Macfadyen"],
            duration: "128 phút",
            ageRating: "T18 - Phim dành cho khán giả từ 18 tuổi trở lên",
            aspectRatio: "Cinemascope 2.39:1",
            soundFormat: "Dolby Atmos",
            verdict: "Deadpool & Wolverine mang lại đúng những gì người hâm mộ mong chờ: bạo lực đã mắt, những câu thoại châm biếm sắc sảo phá vỡ bức tường thứ 4, và màn tái xuất huyền thoại của Hugh Jackman trong bộ giáp vàng xanh kinh điển.",
            pros: [
                "Phản ứng hóa học đỉnh cao giữa Ryan Reynolds và Hugh Jackman",
                "Hàng loạt vai khách mời (cameo) hoài niệm gây sốc và đầy phấn khích",
                "Những màn đấm đá R-rated đẫm máu được biên đạo cực kỳ sáng tạo",
                "Nhạc phim retro từ thập niên 90 và 2000 đỉnh cao và bùng nổ"
            ],
            cons: [
                "Cốt truyện TVA và dòng thời gian khá đơn giản, chủ yếu làm nền cho fan-service",
                "Nhân vật phản diện Cassandra Nova chưa được khai thác hết tiềm năng"
            ],
            criteria: {
                script: 8.6,
                acting: 9.5,
                visuals: 9.4,
                sound: 9.6
            }
        };
    }

    if (title.includes("oppenheimer") || movieId === "872585") {
        return {
            director: "Christopher Nolan",
            cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
            duration: "180 phút",
            ageRating: "T18 - Phim dành cho khán giả từ 18 tuổi trở lên",
            aspectRatio: "IMAX 1.43:1 / 2.20:1 70mm",
            soundFormat: "Dolby Atmos / IMAX 6-Track",
            verdict: "Kiệt tác tiểu sử kinh điển của Christopher Nolan đào sâu vào lương tri của kẻ nắm giữ sức mạnh hủy diệt thế giới. Sự kết hợp giữa dựng phim phi tuyến tính và âm nhạc thót tim của Ludwig Göransson tạo nên trải nghiệm rạp chiếu nghẹt thở.",
            pros: [
                "Màn hóa thân để đời của Cillian Murphy và Robert Downey Jr. xứng đáng Oscar",
                "Trường đoạn thử nghiệm bom Trinity là chuẩn mực của nghệ thuật âm thanh và im lặng",
                "Dựng phim dồn dập, biến một phiên điều trần chính trị thành phim giật gân kịch tính",
                "Âm nhạc của Ludwig Göransson liên tục đẩy cao nhịp đập con tim"
            ],
            cons: [
                "Khối lượng nhân vật lịch sử và thuật ngữ vật lý đòi hỏi người xem có chuẩn bị trước",
                "Nửa đầu phim chuyển đổi dòng thời gian liên tục có thể gây khó theo dõi"
            ],
            criteria: {
                script: 9.6,
                acting: 9.9,
                visuals: 9.7,
                sound: 9.8
            }
        };
    }

    if (title.includes("lật mặt") || title.includes("lat mat") || movieId === "1248039") {
        return {
            director: "Lý Hải",
            cast: ["Thanh Hiền", "Trương Minh Cường", "Đinh Y Nhung", "Quách Ngọc Tuyên", "Trâm Anh"],
            duration: "138 phút",
            ageRating: "K - Khán giả dưới 13 tuổi có người giám hộ",
            aspectRatio: "Widescreen 2.39:1",
            soundFormat: "Dolby Atmos",
            verdict: "Lật Mặt 7 là bước chuyển mình xuất sắc của Lý Hải sang dòng phim gia đình tâm lý. Không cần kỹ xảo đao to búa lớn, phim chạm đến trái tim khán giả bằng câu chuyện chân thật về sự hy sinh vô điều kiện của người mẹ.",
            pros: [
                "Diễn xuất thăng hoa, mộc mạc và đẫm nước mắt của nghệ sĩ Thanh Hiền",
                "Bối cảnh làng K'Long K'Lanh và làng chài Mỹ Tân hiện lên tuyệt đẹp",
                "Thông điệp gia đình sâu sắc, chạm tới sợi dây đồng cảm của nhiều thế hệ",
                "Nhạc phim 'Vẽ Lại Bức Tranh' cất lên đúng thời điểm lấy nước mắt khán giả"
            ],
            cons: [
                "Một số mâu thuẫn giữa các người con được giải quyết hơi nhanh ở đoạn kết",
                "Lời thoại ở một vài phân cảnh còn mang tính kịch nghệ"
            ],
            criteria: {
                script: 8.8,
                acting: 9.3,
                visuals: 9.1,
                sound: 9.0
            }
        };
    }

    // Default smart editorial generator for other movies
    return {
        director: movie?.director || "Đạo diễn danh tiếng",
        cast: movie?.cast || ["Dàn diễn viên thực lực", "Ngôi sao hàng đầu"],
        duration: movie?.duration || "120 phút",
        ageRating: "T16 - Phim dành cho khán giả từ 16 tuổi trở lên",
        aspectRatio: "2.39:1 Cinemascope",
        soundFormat: "Dolby Atmos",
        verdict: movie?.consensus || "Tác phẩm điện ảnh ghi điểm với kịch bản chặt chẽ, hình ảnh trau chuốt và những thông điệp nhân văn lắng đọng. Đây là trải nghiệm rạp chiếu đáng giá mà khán giả yêu mến bộ môn nghệ thuật thứ 7 không nên bỏ lỡ.",
        pros: [
            "Hiệu ứng hình ảnh và kỹ xảo được trau chuốt tỉ mỉ từng chi tiết",
            "Diễn xuất giàu cảm xúc của dàn diễn viên tạo được sự đồng cảm sâu sắc",
            "Âm thanh sống động, nhạc nền đẩy cao trào cảm xúc rất tốt",
            "Nhịp phim cuốn hút, nhiều bất ngờ ở hồi ba"
        ],
        cons: [
            "Đoạn mở đầu có đôi chỗ hơi chậm để giới thiệu bối cảnh nhân vật",
            "Một số tuyến nhân vật phụ có thể phát triển sâu hơn"
        ],
        criteria: {
            script: 9.0,
            acting: 9.4,
            visuals: 9.6,
            sound: 9.3
        }
    };
};
