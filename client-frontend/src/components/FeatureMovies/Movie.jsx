import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

const Movie = () => {
    return (
        <>
            <img
                className="aspect-video brightness-50"
                src="https://images.bauerhosting.com/legacy/empire-tmdb/films/157336/images/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg?ar=16:9&fit=crop&crop=top"/>
            <div className="absolute bottom-[10%] left-8 w-1/2 sm:w-1/3 text-white">
                <p className="font-bold sm:text-[3vw] mb-2">Interstellar</p>
                <div>
                    <p className="text-gray-400 border border-gray-400 inline-block p-1 mb-1">PG13</p>
                    <p className="text-[1.2vw]">2020-11-11</p>
                </div>
                <div>
                    <div className="hidden sm:block text-[1.2vw] mt-4">
                        <p className="font-bold mb-2">Overview</p>
                        <p>Interstellar là một bộ phim khoa học viễn tưởng do Christopher Nolan đạo diễn, phát hành
                            năm
                            2014. Lấy bối cảnh tương lai khi Trái Đất đang dần trở nên không thể sinh sống, phim
                            theo
                            chân một nhóm phi hành gia thực hiện nhiệm vụ vượt qua lỗ sâu (wormhole) để tìm kiếm một
                            hành tinh mới cho loài người.

                            Bộ phim kết hợp những khái niệm khoa học phức tạp như thuyết tương đối, giãn nở thời
                            gian,
                            và lỗ đen với yếu tố cảm xúc mạnh mẽ về tình cha con và lòng hy sinh. Không chỉ là một
                            chuyến phiêu lưu không gian, Interstellar đặt ra câu hỏi sâu sắc về nhân loại, sự sống
                            còn
                            và tình yêu vượt mọi giới hạn của thời gian và không gian.</p>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="bg-white text-black py-2 px-4 rounded text-10 lg:text-lg mr-2"><FontAwesomeIcon
                        icon={faPlay}/>Trailer
                    </button>
                    <button className="bg-slate-300/35 py-2 px-4 rounded text-10 lg:text-lg">Mua vé</button>
                </div>
            </div>
        </>
    );
};

export default Movie;