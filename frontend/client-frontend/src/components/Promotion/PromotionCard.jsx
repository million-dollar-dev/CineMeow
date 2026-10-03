import React from 'react';

const PromotionCard = () => {
    return (
        <div className="">
            <img
                src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250425134116-638811852763586572.jpg"
                className="rounded-lg hover:opacity-85"
            />
            <div className="py-[1vw]">
                <p className="text-sm text-gray-light mb-[0.5vw]">01/04/2025 <span>639.4K lượt xem</span></p>
                <p className="font-bold text-[1.2vw] hover:underline">Nhập mã MOMOBANK - Nhận siêu quà 1.500.000Đ thả ga thanh toán mua sắm, trả hoá đơn!</p>
            </div>
        </div>
    );
};

export default PromotionCard;