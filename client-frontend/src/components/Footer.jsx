import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebookF,
    faInstagram,
    faTwitter,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-10 px-6 lg:px-16">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Column 1: About */}
                <div>
                    <h2 className="text-xl font-bold mb-4">CineMeow</h2>
                    <p className="text-sm text-gray-400">
                        CineMeow là nền tảng đặt vé xem phim trực tuyến hiện đại, hỗ trợ bạn cập nhật lịch chiếu, ưu đãi, review phim và đặt vé nhanh chóng.
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition">
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Liên kết nhanh</h2>
                    <ul className="text-sm space-y-2 text-gray-400">
                        <li>
                            <a href="#" className="hover:text-white transition">Lịch chiếu</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Phim đang chiếu</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Khuyến mãi</a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white transition">Blog</a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Liên hệ</h2>
                    <ul className="text-sm text-gray-400 space-y-2">
                        <li>Email: support@cinemeow.vn</li>
                        <li>Hotline: 1900 123 456</li>
                        <li>Địa chỉ: 123 Đường Phim, TP. Điện Ảnh</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CineMeow. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
