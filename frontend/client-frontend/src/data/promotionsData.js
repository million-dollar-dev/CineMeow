export const PROMOTION_CATEGORIES = [
    { id: "all", label: "Tất cả ưu đãi", icon: "🎟️" },
    { id: "tickets", label: "Vé xem phim", icon: "🎬" },
    { id: "fnb", label: "Bắp & Nước", icon: "🍿" },
    { id: "member", label: "Hội viên VIP", icon: "👑" },
    { id: "partner", label: "Thanh toán & Ví", icon: "💳" }
];

export const PROMOTIONS_DATA = [
    {
        id: "cine-wednesday-45k",
        title: "Thứ 4 Vui Vẻ - Đồng giá vé 2D chỉ 45.000đ cho mọi rạp",
        category: "tickets",
        description: "Thỏa sức thưởng thức các siêu phẩm điện ảnh đang chiếu rạp với mức giá ưu đãi cực sốc vào mỗi Thứ Tư hàng tuần tại toàn bộ cụm rạp CineMeow.",
        discount: "ĐỒNG GIÁ 45K",
        code: "CINEMED45",
        bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
        validDate: "Mỗi Thứ Tư hàng tuần",
        isHot: true,
        isFeatured: true,
        views: "842.5K",
        tag: "VÉ XEM PHIM",
        badgeColor: "rose",
        terms: [
            "Áp dụng cho mọi suất chiếu 2D tiêu chuẩn trong ngày Thứ Tư.",
            "Không phụ thu ghế VIP hoặc ghế đôi Sweetbox.",
            "Mỗi khách hàng được áp dụng tối đa 4 vé / giao dịch.",
            "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
        ]
    },
    {
        id: "combo-popcorn-couple",
        title: "Combo Sweet Cinema: 1 Bắp Phô Mai Jumbo + 2 Nước Giảm 40%",
        category: "fnb",
        description: "Nhân đôi ngọt ngào khi xem phim cùng bạn bè và người thương. Tặng thêm nâng cấp vị phô mai hoặc caramel thượng hạng hoàn toàn miễn phí.",
        discount: "-40%",
        code: "POPLOVE40",
        bannerUrl: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1000&q=80",
        validDate: "Áp dụng đến 31/12/2026",
        isHot: true,
        isFeatured: true,
        views: "619.1K",
        tag: "BẮP & NƯỚC",
        badgeColor: "amber",
        terms: [
            "Áp dụng khi mua kèm từ 2 vé xem phim trở lên.",
            "Có thể đổi sang vị bắp khác (Caramel/Chocolate) miễn phí.",
            "Có giá trị tại tất cả quầy Concession CineMeow toàn quốc."
        ]
    },
    {
        id: "student-u22-special",
        title: "Đặc quyền Học sinh - Sinh viên U22: Vé 50K suốt cả tuần",
        category: "tickets",
        description: "Xuất trình thẻ HSSV hoặc tài khoản định danh VNeID dưới 22 tuổi để nhận ngay vé xem phim đồng giá 50.000đ từ Thứ 2 đến Chủ Nhật.",
        discount: "VÉ 50K",
        code: "STUDENT22",
        bannerUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1000&q=80",
        validDate: "Áp dụng cả năm 2026",
        isHot: false,
        isFeatured: false,
        views: "450.2K",
        tag: "HSSV U22",
        badgeColor: "emerald",
        terms: [
            "Chỉ áp dụng cho thành viên từ 22 tuổi trở xuống.",
            "Vui lòng xuất trình thẻ HSSV/CCCD khi nhận vé tại quầy.",
            "Áp dụng cho mọi suất chiếu trước 17:00 hàng ngày."
        ]
    },
    {
        id: "momo-cashback-30k",
        title: "Thanh toán qua Ví MoMo: Giảm ngay 30.000đ cho đơn từ 120.000đ",
        category: "partner",
        description: "Nhập mã voucher độc quyền khi thanh toán bằng ví MoMo trên website hoặc ứng dụng CineMeow để được khấu trừ trực tiếp vào hóa đơn.",
        discount: "GIẢM 30K",
        code: "MOMOCINE30",
        bannerUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
        validDate: "Hạn đến 30/11/2026",
        isHot: true,
        isFeatured: false,
        views: "920.8K",
        tag: "VÍ MOMO",
        badgeColor: "rose",
        terms: [
            "Áp dụng cho đơn hàng mua vé hoặc combo bắp nước từ 120.000đ.",
            "Mỗi tài khoản MoMo nhận ưu đãi 01 lần / tuần.",
            "Số lượng mã giới hạn 500 lượt mỗi ngày."
        ]
    },
    {
        id: "night-owl-discount",
        title: "CineNight Cú Đêm: Giảm 35% tất cả suất chiếu sau 22h00",
        category: "tickets",
        description: "Trải nghiệm không gian rạp yên tĩnh, âm thanh vòm Dolby Atmos cực đỉnh cùng những thước phim bom tấn với giá ưu đãi đặc biệt cho cú đêm.",
        discount: "-35%",
        code: "NIGHTOWL35",
        bannerUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1000&q=80",
        validDate: "Suất chiếu sau 22:00",
        isHot: false,
        isFeatured: false,
        views: "310.4K",
        tag: "CÚ ĐÊM",
        badgeColor: "indigo",
        terms: [
            "Áp dụng cho các suất chiếu bắt đầu từ 22:00 đến 02:00 sáng hôm sau.",
            "Không áp dụng vào các ngày Lễ, Tết.",
            "Áp dụng cho cả định dạng 2D và IMAX."
        ]
    },
    {
        id: "vip-birthday-perk",
        title: "Sinh Nhật Hội Viên CineClub: Tặng 01 Vé 2D + Combo Bắp Lớn Miễn Phí",
        category: "member",
        description: "Món quà tri ân đặc biệt từ CineMeow gửi tới bạn. Tận hưởng ngày sinh nhật ngập tràn cảm xúc điện ảnh cùng người thân yêu.",
        discount: "MIỄN PHÍ 100%",
        code: "CINEBDAY",
        bannerUrl: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=1000&q=80",
        validDate: "Suốt tháng sinh nhật",
        isHot: true,
        isFeatured: false,
        views: "780.0K",
        tag: "VIP MEMBER",
        badgeColor: "amber",
        terms: [
            "Áp dụng cho thành viên đạt hạng Silver trở lên trên CineMeow.",
            "Voucher tự động kích hoạt vào ngày đầu tiên của tháng sinh nhật.",
            "Thời hạn sử dụng trong vòng 30 ngày kể từ ngày kích hoạt."
        ]
    },
    {
        id: "vnpay-qr-weekend",
        title: "Cuối Tuần Rực Rỡ cùng VNPAY-QR: Quét mã giảm ngay 15% tối đa 50K",
        category: "partner",
        description: "Thảnh thơi xem phim cuối tuần cùng gia đình, quét mã VNPAY-QR tại bước thanh toán để nhận ngay chiết khấu tức thì.",
        discount: "GIẢM 15%",
        code: "VNPAYCINE",
        bannerUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=80",
        validDate: "Thứ 6, Thứ 7, Chủ Nhật",
        isHot: false,
        isFeatured: false,
        views: "298.6K",
        tag: "VNPAY-QR",
        badgeColor: "indigo",
        terms: [
            "Áp dụng trên ứng dụng các ngân hàng (VCB, BIDV, VietinBank...) và ví VNPAY.",
            "Giảm tối đa 50.000đ cho đơn hàng từ 150.000đ.",
            "Mỗi khách hàng được áp dụng 1 lần / tuần."
        ]
    },
    {
        id: "family-weekend-combo",
        title: "Gói Gia Đình Sum Vầy: 4 Vé Phim + 2 Bắp Lớn + 4 Nước Tiết Kiệm 250K",
        category: "fnb",
        description: "Gắn kết yêu thương cuối tuần cho cả gia đình với gói combo trọn gói tiết kiệm chưa từng có tại CineMeow.",
        discount: "TIẾT KIỆM 250K",
        code: "FAMILY250",
        bannerUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
        validDate: "Áp dụng đến 31/12/2026",
        isHot: false,
        isFeatured: false,
        views: "184.2K",
        tag: "COMBO GIA ĐÌNH",
        badgeColor: "emerald",
        terms: [
            "Áp dụng khi mua combo 4 vé xem phim 2D cùng suất chiếu.",
            "Bao gồm 02 bắp Jumbo phô mai/ngọt và 04 ly nước có gas 32oz.",
            "Không áp dụng cho suất chiếu sớm (Sneak Show)."
        ]
    }
];
