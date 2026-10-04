export const BLOG_CATEGORIES = [
    { id: "cinema", label: "Blog Điện Ảnh", icon: "🎬", desc: "Phân tích, hậu trường và kiến thức chuyên sâu về điện ảnh thế giới" },
    { id: "movie", label: "Phim Chiếu Rạp", icon: "🎟️", desc: "Cập nhật các tựa phim hot đang và sắp công chiếu tại các cụm rạp" },
    { id: "synthetic", label: "Tổng Hợp Phim", icon: "🍿", desc: "Top phim hay theo chủ đề, thể loại và bảng xếp hạng phòng vé" },
    { id: "netflix", label: "Phim Netflix & OTT", icon: "📺", desc: "Tuyển tập series ăn khách và phim bộ chất lượng trên các nền tảng trực tuyến" },
];

export const BLOG_ARTICLES = [
    {
        id: "top-10-bom-tan-chieu-rap-2026",
        category: "cinema",
        title: "Top 10 Bom Tấn Chiếu Rạp 2026 Đáng Kỳ Vọng Nhất Không Thể Bỏ Lỡ",
        excerpt: "Điểm danh những tác phẩm điện ảnh bom tấn đỉnh cao sẽ khuynh đảo phòng vé toàn cầu trong năm 2026 từ Marvel, DC đến những đạo diễn huyền thoại như Christopher Nolan, Denis Villeneuve.",
        content: `Năm 2026 đánh dấu sự bùng nổ mạnh mẽ của thị trường điện ảnh toàn cầu với hàng loạt dự án được đầu tư kinh phí khủng. Không chỉ mang đến kỹ xảo choáng ngợp, các nhà làm phim còn tập trung khai thác chiều sâu tâm lý nhân vật và những kịch bản nguyên bản đầy táo bạo.\n\nTừ những màn tái xuất của các siêu anh hùng được yêu mến đến những thiên sử thi khoa học viễn tưởng hoành tráng, khán giả sẽ được chiêu đãi những bữa tiệc thị giác đỉnh cao trên màn hình lớn IMAX. Dưới đây là 10 tựa phim bạn nhất định phải đưa vào danh sách xem phim trong năm nay!`,
        coverUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Hoàng Cine",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            role: "Chuyên viên phân tích phim"
        },
        date: "04/10/2026",
        readTime: "6 phút đọc",
        views: "145.8K",
        tag: "TIÊU ĐIỂM",
        badgeColor: "rose",
        isFeatured: true,
        isTrending: true,
        tableOfContents: [
            "1. Cơn bão phòng vé trở lại với các dự án tỉ đô",
            "2. Điểm danh những bom tấn không thể bỏ lỡ",
            "3. Công nghệ quay phim định hình trải nghiệm rạp 2026",
            "4. Lời kết và kỳ vọng từ khán giả"
        ]
    },
    {
        id: "giai-ma-cong-nghe-imax-dolby-cinema",
        category: "cinema",
        title: "Giải Mã IMAX vs Dolby Cinema: Trải Nghiệm Âm Thanh Và Hình Ảnh Nào Đỉnh Hơn?",
        excerpt: "So sánh chi tiết sự khác biệt giữa công nghệ máy chiếu IMAX Laser, màn hình cong khổng lồ và hệ thống âm thanh Dolby Atmos 360 độ giúp bạn chọn rạp xem phim chuẩn nhất.",
        content: `Khi đến rạp chiếu phim hiện đại, khán giả thường đứng trước lựa chọn: Nên xem IMAX hay Dolby Cinema? Cả hai định dạng cao cấp này đều hứa hẹn mang lại trải nghiệm vượt trội hơn rạp 2D thông thường, nhưng triết lý thiết kế của chúng lại có những nét độc đáo riêng biệt.\n\nTrong khi IMAX chinh phục người xem bằng kích thước màn hình choáng ngợp và tỉ lệ khung hình mở rộng 1.43:1 / 1.90:1, thì Dolby Cinema lại là đỉnh cao của độ tương phản Dolby Vision cùng âm thanh đa chiều Dolby Atmos cực kỳ chính xác.`,
        coverUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Minh Tech",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
            role: "Biên tập viên công nghệ rạp"
        },
        date: "02/10/2026",
        readTime: "5 phút đọc",
        views: "98.2K",
        tag: "CÔNG NGHỆ RẠP",
        badgeColor: "indigo",
        isFeatured: true,
        isTrending: true,
        tableOfContents: [
            "1. IMAX: Sự áp đảo của tỉ lệ khung hình và độ phân giải",
            "2. Dolby Cinema: Đỉnh cao màu sắc và âm thanh vòm Atmos",
            "3. Bảng so sánh trực quan từng tiêu chí",
            "4. Thể loại phim nào nên chọn định dạng nào?"
        ]
    },
    {
        id: "avatar-3-lua-va-tro-tat-ca-nhung-dieu-can-biet",
        category: "movie",
        title: "Avatar 3: Lửa Và Tro - Tất Tần Tật Những Điều Cần Biết Trước Giờ G",
        excerpt: "Hành trình trở lại hành tinh Pandora của đạo diễn James Cameron với tộc người Tro Tàn (Ash People) đầy hung bạo, hứa hẹn mở rộng vũ trụ Avatar lên một tầm cao mới.",
        content: `Sau thành công vang dội của 'Avatar: Dòng Chảy Của Nước', huyền thoại James Cameron tiếp tục đưa khán giả thâm nhập sâu hơn vào những vùng đất khắc nghiệt chưa từng được khám phá của hành tinh Pandora. Phần phim thứ 3 mang tên 'Lửa và Tro' sẽ giới thiệu bộ tộc Na'vi gắn liền với núi lửa và dung nham - những người không còn mang hình tượng hiền hòa và hòa hợp với thiên nhiên như các tộc người trước.`,
        coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Thảo Vy",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            role: "Film Reviewer"
        },
        date: "28/09/2026",
        readTime: "7 phút đọc",
        views: "210.5K",
        tag: "PHIM BOM TẤN",
        badgeColor: "amber",
        isFeatured: true,
        isTrending: true,
        tableOfContents: [
            "1. Bối cảnh tộc Người Tro Tàn - Mặt tối của Pandora",
            "2. Dàn diễn viên quen thuộc và các nhân vật mới xuất hiện",
            "3. Những bước đột phá về công nghệ kỹ xảo CGI",
            "4. Ngày khởi chiếu dự kiến tại rạp Việt Nam"
        ]
    },
    {
        id: "nghe-thuat-quay-phim-one-shot-trong-dien-anh",
        category: "cinema",
        title: "Nghệ Thuật Quay One-Shot: Khi Ống Kính Điện Ảnh Không Cần Cắt Cảnh",
        excerpt: "Từ 1917, Birdman cho đến những trường đoạn hành động đỉnh cao trong John Wick, kỹ thuật cú máy liền mạch đã định nghĩa lại sự chân thực và trải nghiệm điện ảnh nghẹt thở.",
        content: `Một cú quay kéo dài hàng phút mà không hề có bất kỳ vết cắt dựng nào (hoặc được ẩn giấu tinh tế) luôn là một trong những thách thức kỹ thuật lớn nhất đối với bất kỳ đạo diễn và nhà quay phim (DOP) nào. Nó đòi hỏi sự ăn khớp tuyệt đối giữa diễn viên, ánh sáng, chuyển động máy quay và đội ngũ hậu cần.`,
        coverUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Hoàng Cine",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            role: "Chuyên viên phân tích phim"
        },
        date: "25/09/2026",
        readTime: "8 phút đọc",
        views: "74.3K",
        tag: "NGHỆ THUẬT PHIM",
        badgeColor: "emerald",
        isFeatured: false,
        isTrending: false,
        tableOfContents: [
            "1. One-shot là gì và tại sao nó lại có sức hút mãnh liệt?",
            "2. Phân biệt Real One-shot và Invisible Stitching",
            "3. Những phân cảnh one-shot đi vào lịch sử điện ảnh",
            "4. Tương lai của kỹ thuật quay dài hơi trong thời đại kỹ thuật số"
        ]
    },
    {
        id: "top-11-phim-doanh-thu-cao-nhat-moi-thoi-dai",
        category: "synthetic",
        title: "Top 11 Bộ Phim Có Doanh Thu Phòng Vé Cao Nhất Lịch Sử Điện Ảnh",
        excerpt: "Khám phá danh sách các tượng đài phòng vé vượt mốc 2 tỷ USD toàn cầu, những kỳ tích làm thay đổi hoàn toàn nền công nghiệp điện ảnh hiện đại.",
        content: `Doanh thu phòng vé luôn là thước đo rõ nét nhất cho sức lan tỏa toàn cầu của một bộ phim. Từ Titanic của thập niên 90 cho đến kỷ nguyên thống trị của Avatar và Vũ trụ Điện ảnh Marvel, con số hàng tỷ USD không chỉ thể hiện sức hút nội dung mà còn là minh chứng cho sự phát triển của hệ thống rạp chiếu quốc tế.`,
        coverUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Đức Tuấn",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
            role: "Data Analyst"
        },
        date: "20/09/2026",
        readTime: "5 phút đọc",
        views: "320.1K",
        tag: "KỶ LỤC DOANH THU",
        badgeColor: "amber",
        isFeatured: false,
        isTrending: true,
        tableOfContents: [
            "1. Câu lạc bộ 2 tỷ USD: Những cái tên độc tôn",
            "2. Bảng xếp hạng từ vị trí 11 đến vị trí số 1",
            "3. Những bài học thành công từ chiến dịch quảng bá phim"
        ]
    },
    {
        id: "phim-gangster-the-gioi-ngam-giong-peaky-blinders",
        category: "netflix",
        title: "Tuyển Tập Những Series Phim Thế Giới Ngầm Hay Nhất Dành Cho Fan Peaky Blinders",
        excerpt: "Những bộ phim tội phạm xã hội đen đỉnh cao với kịch bản đấu trí cân não, bối cảnh cổ điển lịch lãm và diễn xuất đẳng cấp làm say lòng người hâm mộ.",
        content: `Nếu bạn đã trót say đắm phong thái lạnh lùng, lịch thiệp nhưng tàn nhẫn của Thomas Shelby cùng gia tộc Shelby trong Peaky Blinders, danh sách những bộ phim đề tài thế giới ngầm dưới đây chắc chắn sẽ làm thỏa mãn cơn khát điện ảnh của bạn.`,
        coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Thảo Vy",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            role: "Film Reviewer"
        },
        date: "15/09/2026",
        readTime: "6 phút đọc",
        views: "180.4K",
        tag: "SERIES OTT",
        badgeColor: "indigo",
        isFeatured: false,
        isTrending: true,
        tableOfContents: [
            "1. Sức hút khó cưỡng từ thể loại Gangster cổ điển",
            "2. Top 5 series xứng tầm đối trọng Peaky Blinders",
            "3. Nơi thưởng thức trọn bộ với chất lượng cao nhất"
        ]
    },
    {
        id: "nhac-phim-soundtrack-tao-nen-linh-hon-tac-pham",
        category: "cinema",
        title: "Khi Nhạc Phim Trở Thành Linh Hồn: Dấu Ấn Của Hans Zimmer Và Ennio Morricone",
        excerpt: "Những giai điệu vượt thời gian trong Interstellar, Inception, Gladiator không chỉ bổ trợ cho hình ảnh mà còn dẫn dắt cảm xúc người xem đến tận cùng sự thăng hoa.",
        content: `Âm nhạc trong điện ảnh không đơn thuần là thứ âm thanh nền lấp đầy khoảng trống, nó là nhịp tim của nhân vật, là tiếng vọng của nội tâm và là công cụ truyền tải cảm xúc mạnh mẽ nhất mà ngôn từ đôi khi bất lực.`,
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Hoàng Cine",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
            role: "Chuyên viên phân tích phim"
        },
        date: "10/09/2026",
        readTime: "5 phút đọc",
        views: "62.9K",
        tag: "SOUNDTRACK",
        badgeColor: "rose",
        isFeatured: false,
        isTrending: false,
        tableOfContents: [
            "1. Nhạc phim (OST) - Yếu tố vô hình nhưng quyết định",
            "2. Di sản của 'Phù thủy âm thanh' Hans Zimmer",
            "3. Cung bậc cảm xúc thính giác trong rạp chiếu chuẩn mực"
        ]
    },
    {
        id: "review-squid-game-season-3-hoi-ket",
        category: "netflix",
        title: "Review Squid Game Mùa Cuối: Hồi Kết Dữ Dội Và Đẫm Máu Cho Trò Chơi Sinh Tồn",
        excerpt: "Phân tích cái kết đầy trăn trở, thông điệp về bản chất con người và những cuộc đấu trí nghẹt thở trong phần cuối của hiện tượng toàn cầu Squid Game.",
        content: `Phần kết của Squid Game không chỉ giải đáp các bí ẩn xung quanh tổ chức áo hồng và Front Man mà còn đặt ra những câu hỏi gai góc về sự ích kỷ và lòng trắc ẩn trong xã hội hiện đại. Một cái kết nặng nề nhưng vô cùng xứng đáng.`,
        coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Thảo Vy",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
            role: "Film Reviewer"
        },
        date: "05/09/2026",
        readTime: "6 phút đọc",
        views: "245.0K",
        tag: "REVIEW PHIM",
        badgeColor: "rose",
        isFeatured: false,
        isTrending: true,
        tableOfContents: [
            "1. Cuộc nổi dậy và cái giá của sự tự do",
            "2. Diễn xuất đỉnh cao của dàn sao kỳ cựu",
            "3. Thông điệp ẩn giấu sau chiếc quan tài mở màn",
            "4. Đánh giá tổng kết: 8.5/10 điểm"
        ]
    }
];
