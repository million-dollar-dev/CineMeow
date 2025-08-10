import React from 'react';
import {Link} from "react-router-dom";
import PromotionCard from "../components/Promotion/PromotionCard.jsx";
import ButtonMore from "../components/utils/ButtonMore.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faFire, faShare} from "@fortawesome/free-solid-svg-icons";
import TopPromotionCard from "../components/Promotion/TopPromotionCard.jsx";
import RecomendedPromotion from "../components/Promotion/RecomendedPromotion.jsx";

const PromotionDetailPage = () => {
    const content = "1/ Chương trình Trạm Kết Nối là gì?\n" +
        "Chương trình khách hàng thân thiết Trạm Kết Nối là một chương trình tri ân khách hàng khi sử dụng các dịch vụ Viễn thông (Nạp tiền điện thoại, Nạp Data 4G/5G), mang đến nhiều Quyền lợi & Ưu đãi hấp dẫn đến khách hàng dựa trên mức chi tiêu và số giao dịch tích lũy khi sử dụng các dịch vụ Viễn thông trên MoMo.\n" +
        "Với chương trình chương trình khách hàng thân thiết Trạm Kết Nối, thứ hạng được tính dựa trên mức tiêu dùng Viễn thông tích lũy hàng tháng. Khách hàng có thể sử dụng Xu đã tích lũy từ các giao dịch Viễn thông để đổi được nhiều ưu đãi hấp dẫn từ MoMo, ví dụ như Thẻ quà giảm giá/Quà tặng đặc biệt từ MoMo,...\n" +
        "Thứ hạng càng lên cao thì bạn sẽ nhận được về cho mình những ưu đãi độc quyền dành riêng cho cấp bậc thành viên đó.\n" +
        "Lưu ý: Khách hàng thân thiết của Trạm Kết Nối là một chương trình ưu đãi độc lập với các chương trình ưu Khách hàng Thân thiết khác từ MoMo. \n" +
        "\n" +
        "2/ Vì sao bạn nên tham gia Chương trình Khách Hàng Thân Thiết Trạm Kết Nối?\n" +
        "Chương trình khách hàng thân thiết Trạm Kết Nối ra mắt với mục tiêu mang đến nhiều trải nghiệm quyền lợi - ưu đãi nhiều hơn đến cho Khách hàng với 3 ưu điểm nổi trội:\n" +
        "\n" +
        "Tích xu dễ dàng hơn trên mọi giao dịch chỉ từ 10.000\n" +
        "Đổi được nhiều đặc quyền ưu đãi hơn từ xu tích lũy: các ưu đãi từ các thương hiệu nổi tiếng.\n" +
        "Đặc biệt, hưởng đặc quyền từ TÚI+ dễ dàng hơn bao giờ hết \n" +
        "Nhiều phần thưởng giá trị bất ngờ mỗi quý chia cho từng cấp bậc, nhiều hoạt động - thử thách giúp trải nghiệm giao dịch Viễn thông trở nên thú vị hơn, vui vẻ hơn, quà tặng hấp dẫn hơn.\n" +
        "3/ Vậy làm sao để thăng hạng cấp bậc trong Trạm Kết Nối?\n" +
        "Từ tháng 07/2025, tất cả người dùng sẽ tự động được phân hạng dựa vào lịch sử tiêu dùng cho dịch vụ Nạp tiền điện thoại - Data 4G/5G của MoMo trước đó."
    return (
        <div className="bg-black text-white pt-[6vw]">
            <div  className="max-w-screen-lg mx-auto ">
                <div className="flex gap-8">
                    <div className="flex-6">
                        <div className="flex-6">
                            <div className="rounded-md overflow-hidden">
                                <img
                                    src="https://homepage.momocdn.net/blogscontents/momo-amazone-s3-api-250808133514-638902569147169575.jpg"/>
                            </div>
                            <p className="font-bold text-[2vw] my-[2vw]">Mới! Ra mắt MoMo Telco Loyalty Club - Chương trình Trạm Kết Nối với nhiều đặc quyền dành riêng khách hàng thân thiết</p>
                            <div className="flex items-center justify-between">
                                <div className="flex-col items-center mb-[2vw]">
                                    <div className="flex gap-4 text-gray-light">
                                        <p className="uppercase text-violet">Khuyến mãi</p>
                                        <span>09/09/2025</span>
                                    </div>
                                </div>
                                <div>
                                    <button className="border-2 py-1 px-3 rounded-full bg-white text-black hover:bg-transparent hover:text-white shadow-md">
                                        Chia sẻ <FontAwesomeIcon icon={faShare} className="font-bold"/>
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-light italic text-[1.2vw]">Bạn đang tò mò về Trạm Kết Nối đúng không? MoMo đã sẵn sàng hé lộ loạt quyền lợi siêu xịn của Telco Loyalty Club. Cùng khám phá ngay để không bỏ lỡ đặc quyền nào nhé!</p>
                            <div className="my-[2vw]">
                                <p>
                                    {content}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/*    LIên quân*/}
                    <div className="flex-3">
                        <div className="sticky top-[6vw]">
                            <div className=" border-l pl-[2vw]">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-[1.4vw]">Ưu mãi liên quan</p>
                                    <p>Xem thêm <FontAwesomeIcon icon={faChevronRight}/></p>
                                </div>
                                <div>
                                    <RecomendedPromotion />
                                    <RecomendedPromotion />
                                    <RecomendedPromotion />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mt-[2vw]">
                        <p className="font-bold text-[1.4vw]"><FontAwesomeIcon icon={faFire} /> Ưu đãi nổi bật</p>
                        <div className="grid grid-cols-3 gap-4">
                            <TopPromotionCard />
                            <TopPromotionCard />
                            <TopPromotionCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromotionDetailPage;