// CineMeow Admin App Settings Constants & Default Configuration

export const SETTINGS_STORAGE_KEY = "cinemeow_admin_app_settings";

export const DEFAULT_APP_SETTINGS = {
    // 1. Quy tắc đặt vé & Giữ ghế (Booking & Seat Allocation Rules)
    booking: {
        seatHoldTimeoutMinutes: 10, // 5 - 15 phút
        maxTicketsPerOrder: 8, // 1 - 20 vé
        stopBookingBeforeShowtimeMinutes: 15, // Ngừng bán online trước giờ chiếu
        cleaningBufferMinutes: 20, // Thời gian dọn dẹp và giãn cách giữa 2 suất chiếu
        preventSingleOrphanSeat: true, // Tự động ngăn chặn việc để lại ghế đơn lẻ
        enableComboUpsell: true, // Gợi ý bán kèm bắp nước & combo F&B
        allowTicketTransfer: false, // Cho phép chuyển nhượng vé cho tài khoản khác
    },

    // 2. Thanh toán & Tài chính (Payment Gateways & Invoicing)
    payment: {
        gateways: [
            {
                id: "vnpay",
                name: "VNPay-QR / Thẻ ATM",
                code: "VNPAY",
                enabled: true,
                badge: "Phổ biến nhất",
                feePercent: 0,
                isSandbox: false,
                color: "#0066B3",
                description: "Cổng quét mã QR qua hơn 30 ứng dụng ngân hàng và VNPAY",
            },
            {
                id: "momo",
                name: "Ví điện tử MoMo",
                code: "MOMO",
                enabled: true,
                badge: "Ưu đãi số 1",
                feePercent: 0,
                isSandbox: false,
                color: "#A50064",
                description: "Thanh toán siêu tốc 1 chạm qua ứng dụng Ví MoMo",
            },
            {
                id: "zalopay",
                name: "Ví điện tử ZaloPay",
                code: "ZALOPAY",
                enabled: true,
                badge: "Khuyên dùng",
                feePercent: 0,
                isSandbox: false,
                color: "#0088FF",
                description: "Thanh toán trực tiếp trong Zalo hoặc ứng dụng ZaloPay",
            },
            {
                id: "credit_card",
                name: "Thẻ Quốc tế (Visa / Master / JCB)",
                code: "VISA_MC",
                enabled: true,
                badge: "Quốc tế",
                feePercent: 1.5,
                isSandbox: false,
                color: "#0F172A",
                description: "Cổng thanh toán thẻ tín dụng quốc tế bảo mật 3D-Secure 2.0",
            },
            {
                id: "cinepoint",
                name: "Ví điểm thưởng CinePoint",
                code: "CINEPOINT",
                enabled: true,
                badge: "Thành viên",
                feePercent: 0,
                isSandbox: false,
                color: "#7C3AED",
                description: "Sử dụng trực tiếp điểm thưởng CineMeow Club để trừ tiền vé",
            },
        ],
        autoRefundOnFailure: true,
        vatRatePercent: 8, // 8% thuế GTGT ưu đãi
        enableEInvoice: true, // Tự động xuất hóa đơn điện tử gửi về email
        paymentTimeoutSeconds: 300, // 5 phút chờ thanh toán
    },

    // 3. Khách hàng thân thiết & Tích điểm (CineMeow Rewards)
    loyalty: {
        enableLoyaltyProgram: true,
        earnPointRate: 5.0, // Tỷ lệ tích điểm % trên tổng hóa đơn
        pointRedeemValue: 1000, // 1 điểm = 1.000 VNĐ
        maxPointRedeemPercent: 50, // Tối đa 50% giá trị hóa đơn được thanh toán bằng điểm
        welcomePoints: 20, // Tặng 20 điểm (~20.000 ₫) cho thành viên mới
        pointExpiryDays: 365, // Hạn sử dụng điểm (365 ngày)
        autoTierUpgrade: true, // Tự động lên hạng Bạc -> Vàng -> Kim Cương theo chi tiêu
    },

    // 4. Vé điện tử & Thông báo (E-Ticket & Notifications)
    notifications: {
        enableQrTicket: true,
        dynamicQrIntervalSeconds: 30, // Đổi mã QR động mỗi 30 giây chống gian lận
        sendEmailTicket: true, // Gửi vé điện tử qua Email
        sendSmsZnsNotification: true, // Gửi thông báo xác nhận Zalo ZNS / SMS
        reminderBeforeMinutes: 60, // Nhắc lịch chiếu trước 60 phút
        allowTicketCancellation: true, // Cho phép khách hàng tự hủy vé trên App
        cancellationCutoffMinutes: 120, // Hạn hủy vé tối thiểu trước giờ chiếu
        cancellationFeePercent: 20, // Phí hủy vé (% trên giá vé gốc)
    },

    // 5. Nhận diện & Trạng thái Vận hành (Brand & Operations)
    general: {
        appName: "CineMeow Cinema Platform",
        hotline: "1900 6868",
        supportEmail: "support@cinemeow.vn",
        termsUrl: "https://cinemeow.vn/dieu-khoan-su-dung",
        maintenanceMode: false,
        maintenanceMessage: "Hệ thống CineMeow đang được bảo trì nâng cấp định kỳ để nâng cao trải nghiệm. Vui lòng quay lại sau ít phút!",
        broadcastAlertEnabled: false,
        broadcastAlertMessage: "Ưu đãi bom tấn tháng này: Giảm 20% toàn bộ combo bắp nước khi đặt vé online qua ứng dụng CineMeow!",
    },
};

export const SETTINGS_TABS = [
    {
        id: "booking",
        label: "Đặt vé & Giữ ghế",
        badge: "Quy tắc cốt lõi",
        description: "Thiết lập thời gian giữ chỗ, tối đa số vé và quy tắc thuật toán xếp ghế",
    },
    {
        id: "payment",
        label: "Cổng thanh toán & Tài chính",
        badge: "5 Cổng",
        description: "Quản lý cổng thanh toán trực tuyến, hoàn tiền và xuất hóa đơn điện tử",
    },
    {
        id: "loyalty",
        label: "Thành viên & Tích điểm",
        badge: "CinePoint",
        description: "Chương trình tích điểm CineMeow Club, tỷ lệ quy đổi và phần thưởng chào mừng",
    },
    {
        id: "notifications",
        label: "Vé điện tử & Thông báo",
        badge: "QR Động",
        description: "Cấu hình mã QR vé xem phim, thông báo ZNS/Email và chính sách hoàn hủy vé",
    },
    {
        id: "general",
        label: "Thương hiệu & Vận hành",
        badge: "Hệ thống",
        description: "Thông tin CSKH, hotline, chế độ bảo trì và thông báo khẩn cấp toàn hệ thống",
    },
];
