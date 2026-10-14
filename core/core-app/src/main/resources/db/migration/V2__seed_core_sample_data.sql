-- =============================================================================
-- Flyway Migration: V2__seed_core_sample_data.sql
-- Description: Dữ liệu mẫu (Seed Data) chuẩn TMDB đã dịch tiếng Việt cho CineMeow
-- Lưu ý: Toàn bộ ID đều được AUTO-GENERATE (gen_random_uuid / SERIAL) bởi database
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Thể Loại Phim (Genres - ID tự tăng SERIAL)
-- -----------------------------------------------------------------------------
INSERT INTO genres (name) VALUES
    ('Hành Động'),
    ('Phiêu Lưu'),
    ('Hoạt Hình'),
    ('Hài Hước'),
    ('Tội Phạm'),
    ('Tài Liệu'),
    ('Tâm Lý'),
    ('Gia Đình'),
    ('Giả Tưởng'),
    ('Lịch Sử'),
    ('Kinh Dị'),
    ('Âm Nhạc'),
    ('Bí Ẩn'),
    ('Lãng Mạn'),
    ('Khoa Học Viễn Tưởng'),
    ('Giật Gân')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Dữ Liệu Phim Từ TMDB (Movies - ID tự sinh UUID gen_random_uuid)
-- -----------------------------------------------------------------------------
INSERT INTO movies (
    title, rating, backdrop_path, country, original_language,
    overview, poster_path, trailer_url, release_date, duration,
    status, tagline, subtitle, director
) VALUES
(
    'Dune: Hành Tinh Cát - Phần Hai',
    'T16',
    'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5207.jpg',
    'Mỹ',
    'en',
    'Paul Atreides hợp lực cùng Chani và tộc người Fremen trên hành trình báo thù những kẻ đã hủy hoại gia tộc mình. Đứng trước những điềm báo tương lai nghiệt ngã, Paul buộc phải lựa chọn giữa tình yêu của cuộc đời mình và số phận của toàn thể vũ trụ.',
    'https://image.tmdb.org/t/p/w780/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    'https://www.youtube.com/embed/Way9Dexny3w',
    '2024-03-01',
    166,
    'NOW_PLAYING',
    'Kẻ thống trị sa mạc sẽ thức tỉnh',
    'Phụ đề tiếng Việt',
    'Denis Villeneuve'
),
(
    'Deadpool & Wolverine',
    'T18',
    'https://image.tmdb.org/t/p/w1280/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    'Mỹ',
    'en',
    'Một Wade Wilson đang an phận bỗng bị Cơ quan Quản lý Phương sai Thời gian (TVA) triệu tập cho một nhiệm vụ cấp bách đe dọa vũ trụ thực tại. Để bảo vệ những người thân yêu, anh buộc phải tìm kiếm sự trợ giúp từ một Wolverine đang suy sụp và đầy ắp tổn thương.',
    'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    'https://www.youtube.com/embed/73_1biulkYk',
    '2024-07-26',
    128,
    'NOW_PLAYING',
    'Bộ đôi lầy lội giải cứu đa vũ trụ Marvel',
    'Phụ đề tiếng Việt',
    'Shawn Levy'
),
(
    'Bộ Tứ Siêu Đẳng: First Steps',
    'T13',
    'https://image.tmdb.org/t/p/w1280/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg',
    'Mỹ',
    'en',
    'Gia đình siêu anh hùng đầu tiên của Marvel ra mắt trong bối cảnh retro-futuristic thập niên 60 sống động. Họ phải vừa cân bằng cuộc sống gia đình vừa chiến đấu chống lại thực thể vũ trụ Galactus cùng sứ giả bạc Silver Surfer.',
    'https://image.tmdb.org/t/p/w780/2VUmvqsHb6cEtdfscEA6fqqVzLg.jpg',
    'https://www.youtube.com/embed/18QQWa3Wcx0',
    '2025-07-25',
    135,
    'COMING_SOON',
    'Sự khởi đầu của gia đình siêu anh hùng số một',
    'Phụ đề tiếng Việt',
    'Matt Shakman'
),
(
    'Inside Out 2: Cảm Xúc Mới',
    'P',
    'https://image.tmdb.org/t/p/w1280/xg27NrXi79HmChyz2Du5BM9FGHT.jpg',
    'Mỹ',
    'en',
    'Bộ não của cô bé tuổi teen Riley trải qua đợt đại tu bất ngờ để nhường chỗ cho những vị khách không mời: Lo Âu (Anxiety), Ghen Tị (Envy), Xấu Hổ (Embarrassment) và Chán Nản (Ennui). Nhóm cảm xúc cũ phải học cách hợp tác để giữ cân bằng cho tâm trí Riley.',
    'https://image.tmdb.org/t/p/w780/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    'https://www.youtube.com/embed/LEjhY15eCx0',
    '2024-06-14',
    96,
    'NOW_PLAYING',
    'Chào mừng đến với sự hỗn loạn của tuổi dậy thì',
    'Lồng tiếng & Phụ đề',
    'Kelsey Mann'
),
(
    'Kẻ Trộm Mặt Trăng 4',
    'P',
    'https://image.tmdb.org/t/p/w1280/lgkGysZZFD2C6beKGSh5O9Kyurw.jpg',
    'Mỹ',
    'en',
    'Gru và Lucy chào đón cậu quý tử Gru Jr., cậu nhóc luôn tìm mọi cách hành hạ người bố đáng thương. Khi kẻ thù truyền kiếp Maxime Le Mal vượt ngục nung nấu ý định trả thù, đại gia đình Gru buộc phải đi trốn với sự trợ giúp dở khóc dở cười của biệt đội Mega Minions.',
    'https://image.tmdb.org/t/p/w780/wWba3TaojhK7NdycRhoQpsG0FaH.jpg',
    'https://www.youtube.com/embed/qQlr9-gF32Q',
    '2024-07-03',
    95,
    'NOW_PLAYING',
    'Biệt đội nhí nhố đại náo màn ảnh rộng',
    'Lồng tiếng & Phụ đề',
    'Chris Renaud'
),
(
    'Người Nhện: Du Hành Vũ Trụ Nhện',
    'T13',
    'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    'Mỹ',
    'en',
    'Miles Morales tái xuất trong chương tiếp theo của siêu phẩm hoạt hình đoạt giải Oscar. Khi bị cuốn vào đa vũ trụ Nhện, Miles bất đồng quan điểm với thủ lĩnh Miguel O''Hara và phải tự định nghĩa lại ý nghĩa thực sự của việc trở thành người hùng.',
    'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    'https://www.youtube.com/embed/cqGjhVJWtEg',
    '2023-06-02',
    140,
    'RELEASED',
    'Số phận của bạn do chính bạn quyết định',
    'Phụ đề tiếng Việt',
    'Joaquim Dos Santos'
),
(
    'Kung Fu Panda 4',
    'P',
    'https://image.tmdb.org/t/p/w1280/kYgQXO99RozvvJ1792lp7zW69qV.jpg',
    'Mỹ',
    'en',
    'Sau nhiều trận chiến vang danh, Po được cất nhắc trở thành Thủ lĩnh Tinh thần của Thung lũng Hòa Bình. Để chuyển giao danh hiệu Thần Long Đại Hiệp, Po kết thân với cô cáo Zhen ranh mãnh và đối đầu với mụ phù thủy Tắc Kè Bông mưu mô.',
    'https://image.tmdb.org/t/p/w780/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    'https://www.youtube.com/embed/_inKs4eeHiI',
    '2024-03-08',
    94,
    'NOW_PLAYING',
    'Chiến binh rồng chuẩn bị thăng chức',
    'Lồng tiếng & Phụ đề',
    'Mike Mitchell'
),
(
    'Hành Tinh Khỉ: Vương Quốc Mới',
    'T13',
    'https://image.tmdb.org/t/p/w1280/fqv8v6A9Pnivsvbvg5VIfqqQJtg.jpg',
    'Mỹ',
    'en',
    'Nhiều thế hệ sau kỷ nguyên của Caesar vĩ đại, xã hội loài vượn đã phân chia thành nhiều thị tộc. Khi một thủ lĩnh tàn bạo Proximus Caesar tìm cách nô dịch đồng loại, chú vượn trẻ Noa bắt đầu cuộc hành trình cùng một cô gái loài người bí ẩn để tìm lại tự do.',
    'https://image.tmdb.org/t/p/w780/gKkl37BQuKTanygYQG1pyYgLVgf.jpg',
    'https://www.youtube.com/embed/Kdr5eedWD3w',
    '2024-05-10',
    145,
    'NOW_PLAYING',
    'Trật tự mới trên hành tinh thống trị bởi loài vượn',
    'Phụ đề tiếng Việt',
    'Wes Ball'
),
(
    'Avatar: Dòng Chảy Của Nước',
    'T13',
    'https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZIMQvRjrqqw.jpg',
    'Mỹ',
    'en',
    'Lấy bối cảnh hơn một thập kỷ sau phần đầu, Jake Sully và Neytiri nỗ lực gìn giữ tổ ấm trên hành tinh Pandora. Khi cuộc xâm lược của Người Trời quay trở lại, gia đình Sully phải tìm chốn nương thân tại rạn san hô kỳ vĩ của tộc người Metkayina.',
    'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    'https://www.youtube.com/embed/d9MyW72ELq0',
    '2022-12-16',
    192,
    'RELEASED',
    'Quay trở lại đại dương kỳ vĩ của Pandora',
    'Phụ đề tiếng Việt',
    'James Cameron'
),
(
    'Quật Mộ Trùng Ma',
    'T16',
    'https://image.tmdb.org/t/p/w1280/j3Z3XspTmsBi09v3nIYssQpAag9.jpg',
    'Hàn Quốc',
    'ko',
    'Một thầy phong thủy lão luyện, chuyên gia mai táng và hai pháp sư trừ tà trẻ tuổi được một gia đình hào môn thuê khai quật một ngôi mộ tổ tiên ám quẻ ở vùng ngoại ô hoang vắng, vô tình đánh thức một thực thể tà ác ma quỷ ngủ say hàng thế kỷ.',
    'https://image.tmdb.org/t/p/w780/kCGlIMHnOm8JPXq3rXM6c5w9m2a.jpg',
    'https://www.youtube.com/embed/q_2mXbJ2C7w',
    '2024-02-22',
    134,
    'NOW_PLAYING',
    'Khai quật bí mật kinh hoàng chôn sâu dưới lòng đất',
    'Phụ đề tiếng Việt',
    'Jang Jae-hyun'
),
(
    'Mai',
    'T18',
    'https://image.tmdb.org/t/p/w1280/rLb2cw69ti7AgAcwg0egIrAc52P.jpg',
    'Việt Nam',
    'vi',
    'Mai là một phụ nữ làm nghề massage trị liệu gần 40 tuổi với nhiều góc khuất tổn thương trong quá khứ. Cuộc sống cô xáo trộn khi Dương - chàng thiếu gia nhạc công đào hoa hàng xóm kiên trì theo đuổi cô, bất chấp định kiến gia đình khắt khe.',
    'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    'https://www.youtube.com/embed/n3u1mU0d2-4',
    '2024-02-10',
    131,
    'RELEASED',
    'Quá khứ chưa từng ngủ yên, tình yêu liệu có đủ lớn?',
    'Tiếng Việt',
    'Trấn Thành'
),
(
    'Oppenheimer',
    'T18',
    'https://image.tmdb.org/t/p/w1280/rLb2cw69ti7AgAcwg0egIrAc52P.jpg',
    'Mỹ',
    'en',
    'Kiệt tác tiểu sử thuật lại cuộc đời nhà vật lý lý thuyết J. Robert Oppenheimer, người lãnh đạo Dự án Manhattan chế tạo quả bom nguyên tử đầu tiên trong lịch sử nhân loại, và sự giằng xé lương tâm tột cùng sau khi chứng kiến sức tàn phá khủng khiếp.',
    'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    'https://www.youtube.com/embed/uYPbbksJxIg',
    '2023-07-21',
    180,
    'RELEASED',
    'Tôi đã trở thành Thần Chết, kẻ hủy diệt các thế giới',
    'Phụ đề tiếng Việt',
    'Christopher Nolan'
),
(
    'Godzilla x Kong: Đế Chế Mới',
    'T13',
    'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5207.jpg',
    'Mỹ',
    'en',
    'Kong và Godzilla phải tạm gác lại mối thù truyền kiếp để liên thủ chống lại một thế lực khổng lồ tàn bạo Skar King và quái thú băng giá Shimo ẩn sâu trong Trái Đất rỗng, đe dọa sự diệt vong của cả nhân loại.',
    'https://image.tmdb.org/t/p/w780/bQ2ywkch09pqSqG6kTXuTkB7q0G.jpg',
    'https://www.youtube.com/embed/lV1OOlGwExg',
    '2024-03-29',
    115,
    'NOW_PLAYING',
    'Cùng nhau thống trị hoặc cùng nhau diệt vong',
    'Phụ đề tiếng Việt',
    'Adam Wingard'
),
(
    'Moana 2: Hành Trình Mới',
    'P',
    'https://image.tmdb.org/t/p/w1280/tElnmtQ6yz1PjN1kePNl8yMSY59.jpg',
    'Mỹ',
    'en',
    'Ba năm sau chuyến hành trình đầu tiên, Moana nhận được lời hiệu triệu bất ngờ từ tổ tiên. Cô cùng Á thần Maui và thủy thủ đoàn mới dấn thân vào vùng biển xa xôi nguy hiểm của châu Đại Dương để tìm lại các dân tộc đã thất lạc.',
    'https://image.tmdb.org/t/p/w780/4YZpsylshsvQwIOYrY9IRwEXM30.jpg',
    'https://www.youtube.com/embed/hDZ7y8RP5HE',
    '2024-11-27',
    100,
    'COMING_SOON',
    'Đại dương xa xôi lại cất tiếng gọi',
    'Lồng tiếng & Phụ đề',
    'David G. Derrick Jr.'
),
(
    'Venom: Kèo Cuối',
    'T13',
    'https://image.tmdb.org/t/p/w1280/3V4kLQg0kSqPLctI5ziYWMEAZYF.jpg',
    'Mỹ',
    'en',
    'Eddie Brock và ký sinh trùng Venom phải đối mặt với cuộc truy quét nghẹt thở từ quân đội Trái Đất cùng cuộc xâm lăng của Thần Knull và bầy đàn quái vật Symbiote đến từ hành tinh quê hương.',
    'https://image.tmdb.org/t/p/w780/aos8Vh99loXrst6vlDlTwBtEMEB.jpg',
    'https://www.youtube.com/embed/__2bjWbetsA',
    '2024-10-25',
    110,
    'COMING_SOON',
    'Cho đến khi cái chết chia lìa chúng ta',
    'Phụ đề tiếng Việt',
    'Kelly Marcel'
),
(
    'Joker: Điên Có Đôi',
    'T18',
    'https://image.tmdb.org/t/p/w1280/hctfNoMpQGfn3rEG0RhOWEZRdrC.jpg',
    'Mỹ',
    'en',
    'Arthur Fleck bị giam giữ tại Viện tâm thần Arkham trong khi chờ xét xử các tội ác của Joker. Giữa cơn mê loạn, Arthur tìm thấy tình yêu đồng điệu của cuộc đời bên Harley Quinn và cùng hòa vào giai điệu điên loạn.',
    'https://image.tmdb.org/t/p/w780/aciP8Km0waTLXEYf5zyRnl2NjGV.jpg',
    'https://www.youtube.com/embed/_OKAwz2DlOE',
    '2024-10-04',
    138,
    'NOW_PLAYING',
    'Thế giới chỉ là một sân khấu điên cuồng',
    'Phụ đề tiếng Việt',
    'Todd Phillips'
),
(
    'Lật Mặt 7: Một Điều Ước',
    'K',
    'https://image.tmdb.org/t/p/w1280/9cqNFs9EsL4z2r2rC9sP2q0P0p9.jpg',
    'Việt Nam',
    'vi',
    'Xoay quanh người mẹ già 73 tuổi sống cô quạnh nơi vùng núi hoang sơ cùng 5 người con đã lập gia đình ở tứ xứ. Khi mẹ không may bị thương, cuộc đùn đẩy chăm sóc mẹ mở ra những nỗi niềm xót xa về tình mẫu tử.',
    'https://image.tmdb.org/t/p/w780/9cqNFs9EsL4z2r2rC9sP2q0P0p9.jpg',
    'https://www.youtube.com/embed/B9eN5E_p-3o',
    '2024-04-26',
    138,
    'RELEASED',
    'Mẹ nuôi được 5 người con, nhưng 5 người con liệu có nuôi nổi một người mẹ?',
    'Tiếng Việt',
    'Lý Hải'
),
(
    'Đào, Phở và Piano',
    'T13',
    'https://image.tmdb.org/t/p/w1280/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    'Việt Nam',
    'vi',
    'Bản tình ca bi tráng giữa khói lửa chiến tranh mùa đông 1946 tại Hà Nội. Khắc họa vẻ đẹp tâm hồn của người Tràng An hào hoa, kiên cường giữ từng tấc đất quê hương.',
    'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    'https://www.youtube.com/embed/5a2qH4q3s5o',
    '2024-02-10',
    100,
    'RELEASED',
    'Khúc tráng ca hào hùng của Hà Nội mùa đông 1946',
    'Tiếng Việt',
    'Phi Tiến Sơn'
),
(
    'Interstellar: Hố Đen Tử Thần',
    'T13',
    'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    'Mỹ',
    'en',
    'Khi sự sống trên Trái Đất bên bờ vực tuyệt chủng, cựu phi công NASA Cooper cùng các nhà khoa học dấn thân vào hành trình vượt qua lỗ sâu không gian tìm kiếm hành tinh có thể sinh sống cho loài người.',
    'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://www.youtube.com/embed/zSWdZVtXT7E',
    '2014-11-07',
    169,
    'RELEASED',
    'Hồi kết của Trái đất không phải là hồi kết của loài người',
    'Phụ đề tiếng Việt',
    'Christopher Nolan'
),
(
    'Alien: Romulus',
    'T18',
    'https://image.tmdb.org/t/p/w1280/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg',
    'Mỹ',
    'en',
    'Khám phá một trạm vũ trụ bị bỏ hoang, một nhóm nhà thám hiểm trẻ tuổi phải đối mặt với dạng sống ngoài hành tinh đáng sợ và hung tợn nhất trong vũ trụ: loài quái vật Xenomorph.',
    'https://image.tmdb.org/t/p/w780/b33nnKl1GSFbao8l3urDDujmmQh.jpg',
    'https://www.youtube.com/embed/x0XDEhP4MQs',
    '2024-08-16',
    119,
    'NOW_PLAYING',
    'Trong không gian sâu thẳm, không ai nghe thấy tiếng bạn gào thét',
    'Phụ đề tiếng Việt',
    'Fede Álvarez'
),
(
    'Transformers Một',
    'P',
    'https://image.tmdb.org/t/p/w1280/Asg2ZF1BinsyvaGEpv72W027jhQ.jpg',
    'Mỹ',
    'en',
    'Câu chuyện chưa kể về thuở hàn vi của Orion Pax và D-16. Trước khi trở thành Optimus Prime và Megatron - hai kẻ thù không đội trời chung, họ từng là anh em vào sinh ra tử trên hành tinh Cybertron.',
    'https://image.tmdb.org/t/p/w780/qbkPtZWehuqgW4vIcl2k33f443b.jpg',
    'https://www.youtube.com/embed/u2NuUWuwPCM',
    '2024-09-20',
    104,
    'NOW_PLAYING',
    'Chứng kiến sự trỗi dậy của hai huyền thoại Cybertron',
    'Lồng tiếng & Phụ đề',
    'Josh Cooley'
),
(
    'Chúa Tể Của Những Chiếc Nhẫn: Cuộc Chiến Của Rohirrim',
    'T13',
    'https://image.tmdb.org/t/p/w1280/5y8k10P991P07H4q93rE4s1t2U.jpg',
    'Mỹ',
    'en',
    'Lấy bối cảnh 183 năm trước bộ ba phim gốc, tác phẩm thuật lại cuộc chiến bi hùng của Vị vua Helm Hammerhand huyền thoại của xứ sở kỵ binh Rohan chống lại kẻ thù Dunlending.',
    'https://image.tmdb.org/t/p/w780/b6HkQh2P987pG1A4jU33j8t8c2E.jpg',
    'https://www.youtube.com/embed/yL8f8V7uP8w',
    '2024-12-13',
    130,
    'COMING_SOON',
    'Huyền thoại về pháo đài Helm''s Deep trỗi dậy',
    'Phụ đề tiếng Việt',
    'Kenji Kamiyama'
),
(
    'Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô',
    'P',
    'https://image.tmdb.org/t/p/w1280/k7g8A99H9yG78rA8k0P7r5e.jpg',
    'Nhật Bản',
    'ja',
    'Tại Hakodate, Siêu trộm Kid nhắm tới một thanh kiếm Nhật cổ thời Mạc Phủ. Conan và thám tử miền Tây Heiji cùng vào cuộc phá án, lần tìm bí mật kho báu ẩn chứa sức mạnh quân sự chấn động.',
    'https://image.tmdb.org/t/p/w780/eMmhE3YwG98f3F1K4yU4r8T7rA.jpg',
    'https://www.youtube.com/embed/g2qJ1i1k8y8',
    '2024-04-12',
    111,
    'RELEASED',
    'Cuộc chạm trán định mệnh giữa ba kỳ phùng địch thủ',
    'Lồng tiếng & Phụ đề',
    'Chika Nagaoka'
),
(
    'Võ Sĩ Giác Đấu II',
    'T18',
    'https://image.tmdb.org/t/p/w1280/unthV1mq9llhEinIMPcCUImFodt.jpg',
    'Mỹ',
    'en',
    'Nhiều năm sau cái chết của người hùng Maximus, Lucius bị các bạo chúa La Mã bắt làm nô lệ. Bước vào đấu trường đẫm máu Colosseum, Lucius phải khơi dậy tinh thần chiến binh để giành lại danh dự và tương lai cho La Mã.',
    'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    'https://www.youtube.com/embed/4rgYUipGJNo',
    '2024-11-15',
    148,
    'COMING_SOON',
    'Những gì ta làm trong cuộc đời sẽ vang vọng mãi ở cõi vĩnh hằng',
    'Phụ đề tiếng Việt',
    'Ridley Scott'
);

-- -----------------------------------------------------------------------------
-- 3. Liên Kết Thể Loại Phim (Movie Genres - Ghép theo tên phim & thể loại)
-- -----------------------------------------------------------------------------
INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Dune: Hành Tinh Cát - Phần Hai' AND g.name IN ('Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Deadpool & Wolverine' AND g.name IN ('Hành Động', 'Hài Hước', 'Khoa Học Viễn Tưởng')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Bộ Tứ Siêu Đẳng: First Steps' AND g.name IN ('Khoa Học Viễn Tưởng', 'Hành Động', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Inside Out 2: Cảm Xúc Mới' AND g.name IN ('Hoạt Hình', 'Gia Đình', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Kẻ Trộm Mặt Trăng 4' AND g.name IN ('Hoạt Hình', 'Gia Đình', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Người Nhện: Du Hành Vũ Trụ Nhện' AND g.name IN ('Hoạt Hình', 'Hành Động', 'Khoa Học Viễn Tưởng')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Kung Fu Panda 4' AND g.name IN ('Hoạt Hình', 'Phiêu Lưu', 'Hành Động')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Hành Tinh Khỉ: Vương Quốc Mới' AND g.name IN ('Khoa Học Viễn Tưởng', 'Hành Động', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Avatar: Dòng Chảy Của Nước' AND g.name IN ('Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Quật Mộ Trùng Ma' AND g.name IN ('Kinh Dị', 'Bí Ẩn', 'Giật Gân')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Mai' AND g.name IN ('Tâm Lý', 'Lãng Mạn', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Oppenheimer' AND g.name IN ('Lịch Sử', 'Tâm Lý')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Godzilla x Kong: Đế Chế Mới' AND g.name IN ('Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Moana 2: Hành Trình Mới' AND g.name IN ('Hoạt Hình', 'Phiêu Lưu', 'Gia Đình', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Venom: Kèo Cuối' AND g.name IN ('Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Joker: Điên Có Đôi' AND g.name IN ('Tâm Lý', 'Tội Phạm', 'Âm Nhạc')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Lật Mặt 7: Một Điều Ước' AND g.name IN ('Gia Đình', 'Tâm Lý', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Đào, Phở và Piano' AND g.name IN ('Chiến Tranh', 'Lịch Sử', 'Lãng Mạn', 'Tâm Lý')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Interstellar: Hố Đen Tử Thần' AND g.name IN ('Khoa Học Viễn Tưởng', 'Tâm Lý', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Alien: Romulus' AND g.name IN ('Kinh Dị', 'Khoa Học Viễn Tưởng', 'Giật Gân')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Transformers Một' AND g.name IN ('Hoạt Hình', 'Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Chúa Tể Của Những Chiếc Nhẫn: Cuộc Chiến Của Rohirrim' AND g.name IN ('Hoạt Hình', 'Giả Tưởng', 'Hành Động', 'Phiêu Lưu')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô' AND g.name IN ('Hoạt Hình', 'Bí Ẩn', 'Hành Động', 'Hài Hước')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

INSERT INTO movie_genres (movie_id, genre_id)
SELECT m.id, g.id FROM movies m, genres g
WHERE m.title = 'Võ Sĩ Giác Đấu II' AND g.name IN ('Hành Động', 'Phiêu Lưu', 'Lịch Sử', 'Tâm Lý')
ON CONFLICT (movie_id, genre_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. Diễn Viên Chính (Movie Casts - Ghép theo tên phim)
-- -----------------------------------------------------------------------------
INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Timothée Chalamet'),
    ('Zendaya'),
    ('Rebecca Ferguson'),
    ('Javier Bardem'),
    ('Austin Butler')
) AS c(actor)
WHERE m.title = 'Dune: Hành Tinh Cát - Phần Hai';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Ryan Reynolds'),
    ('Hugh Jackman'),
    ('Emma Corrin'),
    ('Matthew Macfadyen')
) AS c(actor)
WHERE m.title = 'Deadpool & Wolverine';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Pedro Pascal'),
    ('Vanessa Kirby'),
    ('Joseph Quinn'),
    ('Ebon Moss-Bachrach')
) AS c(actor)
WHERE m.title = 'Bộ Tứ Siêu Đẳng: First Steps';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Amy Poehler'),
    ('Maya Hawke'),
    ('Phyllis Smith'),
    ('Lewis Black')
) AS c(actor)
WHERE m.title = 'Inside Out 2: Cảm Xúc Mới';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Steve Carell'),
    ('Kristen Wiig'),
    ('Will Ferrell'),
    ('Joey King')
) AS c(actor)
WHERE m.title = 'Kẻ Trộm Mặt Trăng 4';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Shameik Moore'),
    ('Hailee Steinfeld'),
    ('Oscar Isaac')
) AS c(actor)
WHERE m.title = 'Người Nhện: Du Hành Vũ Trụ Nhện';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Jack Black'),
    ('Awkwafina'),
    ('Viola Davis')
) AS c(actor)
WHERE m.title = 'Kung Fu Panda 4';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Owen Teague'),
    ('Freya Allan'),
    ('Kevin Durand')
) AS c(actor)
WHERE m.title = 'Hành Tinh Khỉ: Vương Quốc Mới';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Sam Worthington'),
    ('Zoe Saldana'),
    ('Sigourney Weaver')
) AS c(actor)
WHERE m.title = 'Avatar: Dòng Chảy Của Nước';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Choi Min-sik'),
    ('Kim Go-eun'),
    ('Lee Do-hyun')
) AS c(actor)
WHERE m.title = 'Quật Mộ Trùng Ma';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Phương Anh Đào'),
    ('Tuấn Trần'),
    ('Trấn Thành')
) AS c(actor)
WHERE m.title = 'Mai';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Cillian Murphy'),
    ('Emily Blunt'),
    ('Robert Downey Jr.')
) AS c(actor)
WHERE m.title = 'Oppenheimer';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Rebecca Hall'),
    ('Brian Tyree Henry'),
    ('Dan Stevens'),
    ('Kaylee Hottle')
) AS c(actor)
WHERE m.title = 'Godzilla x Kong: Đế Chế Mới';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Auli''i Cravalho'),
    ('Dwayne Johnson'),
    ('Alan Tudyk'),
    ('Nicole Scherzinger')
) AS c(actor)
WHERE m.title = 'Moana 2: Hành Trình Mới';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Tom Hardy'),
    ('Chiwetel Ejiofor'),
    ('Juno Temple'),
    ('Rhys Ifans')
) AS c(actor)
WHERE m.title = 'Venom: Kèo Cuối';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Joaquin Phoenix'),
    ('Lady Gaga'),
    ('Brendan Gleeson'),
    ('Catherine Keener')
) AS c(actor)
WHERE m.title = 'Joker: Điên Có Đôi';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Thanh Hiền'),
    ('Trương Minh Cường'),
    ('Đinh Y Nhung'),
    ('Quách Ngọc Tuyên')
) AS c(actor)
WHERE m.title = 'Lật Mặt 7: Một Điều Ước';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Doãn Quốc Đam'),
    ('Cao Thị Thùy Linh'),
    ('NSND Trung Hiếu'),
    ('Tuấn Hưng')
) AS c(actor)
WHERE m.title = 'Đào, Phở và Piano';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Matthew McConaughey'),
    ('Anne Hathaway'),
    ('Jessica Chastain'),
    ('Michael Caine')
) AS c(actor)
WHERE m.title = 'Interstellar: Hố Đen Tử Thần';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Cailee Spaeny'),
    ('David Jonsson'),
    ('Archie Renaux'),
    ('Isabela Merced')
) AS c(actor)
WHERE m.title = 'Alien: Romulus';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Chris Hemsworth'),
    ('Brian Tyree Henry'),
    ('Scarlett Johansson'),
    ('Keegan-Michael Key')
) AS c(actor)
WHERE m.title = 'Transformers Một';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Brian Cox'),
    ('Gaia Wise'),
    ('Luke Pasqualino'),
    ('Miranda Otto')
) AS c(actor)
WHERE m.title = 'Chúa Tể Của Những Chiếc Nhẫn: Cuộc Chiến Của Rohirrim';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Minami Takayama'),
    ('Wakana Yamazaki'),
    ('Rikiya Koyama'),
    ('Kappei Yamaguchi')
) AS c(actor)
WHERE m.title = 'Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô';

INSERT INTO movie_casts (movie_id, casts)
SELECT m.id, c.actor
FROM movies m
CROSS JOIN (VALUES
    ('Paul Mescal'),
    ('Pedro Pascal'),
    ('Denzel Washington'),
    ('Connie Nielsen')
) AS c(actor)
WHERE m.title = 'Võ Sĩ Giác Đấu II';

-- -----------------------------------------------------------------------------
-- 5. Thương Hiệu Rạp (Cinema Brands - ID tự sinh UUID gen_random_uuid)
-- -----------------------------------------------------------------------------
INSERT INTO cinema_brands (name, description, logo_url, employee_count, background_url) VALUES
(
    'CineMeow Cinemas',
    'Chuỗi rạp chiếu phim hiện đại số 1 với trải nghiệm đỉnh cao IMAX Laser và ghế bọc nhung cao cấp phong cách CineMeow.',
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    150,
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1280'
),
(
    'CGV Cinema',
    'Cụm rạp chiếu phim tiêu chuẩn quốc tế lớn nhất tại Việt Nam trực thuộc tập đoàn CJ Hàn Quốc.',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png',
    1200,
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1280'
),
(
    'BHD Star Cineplex',
    'Cụm rạp chiếu phim hiện đại mang đến không gian giải trí trẻ trung và dịch vụ thân thiện tại Việt Nam.',
    'https://homepage.momocdn.net/cinema/momo-upload-api-210813104618-637644579789390234.png',
    500,
    'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1280'
),
(
    'Lotte Cinema',
    'Hệ thống rạp chiếu phim chất lượng đến từ tập đoàn Lotte Hàn Quốc với phòng chiếu sang trọng.',
    'https://homepage.momocdn.net/cinema/momo-upload-api-210813104719-637644580392942838.png',
    600,
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1280'
)
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. Danh Sách Rạp Chiếu Phim (Cinemas - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO cinemas (name, address, city, brand_id, image_url) VALUES
(
    'CineMeow Flagship Landmark 81',
    'Tầng B1, Vincom Center Landmark 81, 772 Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP.HCM',
    'Hồ Chí Minh',
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800'
),
(
    'CineMeow Royal City Hà Nội',
    'Tầng B2, TTTM Vincom Mega Mall Royal City, 72A Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội',
    'Hà Nội',
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800'
),
(
    'CGV Vincom Landmark 81',
    'Tầng B1, TTTM Vincom Center Landmark 81, 772 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    'Hồ Chí Minh',
    (SELECT id FROM cinema_brands WHERE name = 'CGV Cinema' LIMIT 1),
    'https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=800'
),
(
    'CGV Hùng Vương Plaza',
    'Tầng 7, Hùng Vương Plaza, 126 Hùng Vương, Phường 12, Quận 5, TP.HCM',
    'Hồ Chí Minh',
    (SELECT id FROM cinema_brands WHERE name = 'CGV Cinema' LIMIT 1),
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800'
),
(
    'BHD Star Bitexco',
    'Tầng 3 & 4, TTTM Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM',
    'Hồ Chí Minh',
    (SELECT id FROM cinema_brands WHERE name = 'BHD Star Cineplex' LIMIT 1),
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800'
),
(
    'Lotte Cinema Landmark Hà Nội',
    'Tầng 5, Keangnam Landmark 72, Phạm Hùng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội',
    'Hà Nội',
    (SELECT id FROM cinema_brands WHERE name = 'Lotte Cinema' LIMIT 1),
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800'
);

-- -----------------------------------------------------------------------------
-- 7. Danh Sách Phòng Chiếu (Rooms - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO rooms (name, type, status, cinema_id) VALUES
(
    'Phòng 01 - IMAX Laser Landmark 81',
    '_IMAX',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'CineMeow Flagship Landmark 81' LIMIT 1)
),
(
    'Phòng 02 - Standard 2D Landmark 81',
    '_2D',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'CineMeow Flagship Landmark 81' LIMIT 1)
),
(
    'Phòng 03 - Real 3D Landmark 81',
    '_3D',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'CineMeow Flagship Landmark 81' LIMIT 1)
),
(
    'Phòng 01 - IMAX Laser CGV',
    '_IMAX',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'CGV Vincom Landmark 81' LIMIT 1)
),
(
    'Phòng 02 - Standard 2D CGV',
    '_2D',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'CGV Vincom Landmark 81' LIMIT 1)
),
(
    'Phòng 01 - 2D Digital BHD',
    '_2D',
    'ACTIVE',
    (SELECT id FROM cinemas WHERE name = 'BHD Star Bitexco' LIMIT 1)
);

-- -----------------------------------------------------------------------------
-- 8. Sơ Đồ Ghế Mẫu Cho Phòng Chiếu (Seats - ID tự tăng BIGSERIAL)
-- 8 Hàng x 12 Cột = 96 Ghế cho Phòng 01 - IMAX Laser Landmark 81
-- -----------------------------------------------------------------------------
INSERT INTO seats (row_index, column_index, label, status, type, room_id)
SELECT
    r.row_num,
    c.col_num,
    chr(64 + r.row_num) || c.col_num AS label,
    'ACTIVE' AS status,
    CASE
        WHEN r.row_num = 8 THEN 'COUPLE'
        ELSE 'NORMAL'
    END AS type,
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1) AS room_id
FROM generate_series(1, 8) AS r(row_num)
CROSS JOIN generate_series(1, 12) AS c(col_num);

-- -----------------------------------------------------------------------------
-- 9. Đồ Ăn & Nước Uống (F&B Items - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO fnb_items (cinema_brand_id, name, description, image_url, available, price, category) VALUES
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Bắp Rang Bơ Truyền Thống (Lớn)',
    'Hạt bắp nổ thơm lừng hương bơ giòn rụm, kích cỡ lớn phù hợp cho suốt buổi chiếu phim.',
    'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400',
    TRUE,
    65000.00,
    'POPCORN'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Bắp Rang Vị Caramel Thượng Hạng',
    'Lớp caramel ngọt ngào phủ đều hạt bắp vàng ươm, đem đến vị ngọt bùi khó cưỡng.',
    'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400',
    TRUE,
    75000.00,
    'POPCORN'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Bắp Rang Vị Phô Mai Lắc Cay Nhẹ',
    'Bắp rang áo đều lớp bột phô Mai béo ngậy cùng hương vị cay kích thích vị giác.',
    'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=400',
    TRUE,
    75000.00,
    'POPCORN'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Coca-Cola Tươi Mát Lạnh (32oz)',
    'Ly nước giải khát có ga Coca-Cola sảng khoái với đá tinh khiết.',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400',
    TRUE,
    39000.00,
    'DRINK'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Trà Đào Cam Sả Tươi Mát',
    'Hương trà thanh mát hòa quyện vị chua ngọt của cam tươi và miếng đào giòn thơm.',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400',
    TRUE,
    49000.00,
    'DRINK'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Combo Solo CineMeow',
    'Tiết kiệm hơn với 1 Bắp ngọt lớn + 1 Nước ngọt có ga 32oz tự chọn.',
    'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400',
    TRUE,
    89000.00,
    'COMBO'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Combo Couple Rực Rỡ',
    'Bộ đôi hoàn hảo cho buổi hẹn hò: 1 Bắp Caramel lớn + 2 Nước ngọt 32oz + 1 Snack giòn.',
    'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400',
    TRUE,
    119000.00,
    'COMBO'
),
(
    (SELECT id FROM cinema_brands WHERE name = 'CineMeow Cinemas' LIMIT 1),
    'Combo Party Nhóm Bạn (4 Người)',
    'Tiệc điện ảnh bùng nổ: 2 Bắp rang lớn tự chọn vị + 4 Ly nước giải khát lớn.',
    'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=400',
    TRUE,
    199000.00,
    'COMBO'
);

-- -----------------------------------------------------------------------------
-- 10. Hồ Sơ Người Dùng Mẫu (User Profiles - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO user_profiles (user_id, phone_number, email) VALUES
(
    'usr-cinemeow-master-001',
    '0901234567',
    'hoang.nguyen@cinemeow.vn'
),
(
    'usr-cinemeow-tester-002',
    '0987654321',
    'tester@cinemeow.vn'
)
ON CONFLICT (user_id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 11. Lịch Chiếu Mẫu (Showtimes - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO show_times (movie_id, room_id, start_time, end_time, status) VALUES
-- Suất chiếu Dune 2 hôm nay
(
    (SELECT id FROM movies WHERE title = 'Dune: Hành Tinh Cát - Phần Hai' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '12 hours 46 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Dune: Hành Tinh Cát - Phần Hai' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '14 hours 30 minutes',
    CURRENT_DATE + INTERVAL '17 hours 16 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Dune: Hành Tinh Cát - Phần Hai' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '19 hours 00 minutes',
    CURRENT_DATE + INTERVAL '21 hours 46 minutes',
    'AVAILABLE'
),

-- Suất chiếu Deadpool & Wolverine hôm nay
(
    (SELECT id FROM movies WHERE title = 'Deadpool & Wolverine' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 02 - Standard 2D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '11 hours 00 minutes',
    CURRENT_DATE + INTERVAL '13 hours 08 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Deadpool & Wolverine' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 02 - Standard 2D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '16 hours 15 minutes',
    CURRENT_DATE + INTERVAL '18 hours 23 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Deadpool & Wolverine' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 02 - Standard 2D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '20 hours 30 minutes',
    CURRENT_DATE + INTERVAL '22 hours 38 minutes',
    'AVAILABLE'
),

-- Suất chiếu Inside Out 2 ngày mai
(
    (SELECT id FROM movies WHERE title = 'Inside Out 2: Cảm Xúc Mới' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 03 - Real 3D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '09 hours 30 minutes',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours 06 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Inside Out 2: Cảm Xúc Mới' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 03 - Real 3D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '14 hours 00 minutes',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours 36 minutes',
    'AVAILABLE'
),

-- Suất chiếu Quật Mộ Trùng Ma ngày kia
(
    (SELECT id FROM movies WHERE title = 'Quật Mộ Trùng Ma' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '18 hours 00 minutes',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '20 hours 14 minutes',
    'AVAILABLE'
),

-- Suất chiếu Godzilla x Kong: Đế Chế Mới hôm nay & ngày mai
(
    (SELECT id FROM movies WHERE title = 'Godzilla x Kong: Đế Chế Mới' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser CGV' LIMIT 1),
    CURRENT_DATE + INTERVAL '13 hours 00 minutes',
    CURRENT_DATE + INTERVAL '14 hours 55 minutes',
    'AVAILABLE'
),
(
    (SELECT id FROM movies WHERE title = 'Godzilla x Kong: Đế Chế Mới' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser CGV' LIMIT 1),
    CURRENT_DATE + INTERVAL '18 hours 30 minutes',
    CURRENT_DATE + INTERVAL '20 hours 25 minutes',
    'AVAILABLE'
),

-- Suất chiếu Transformers Một hôm nay
(
    (SELECT id FROM movies WHERE title = 'Transformers Một' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 02 - Standard 2D CGV' LIMIT 1),
    CURRENT_DATE + INTERVAL '15 hours 00 minutes',
    CURRENT_DATE + INTERVAL '16 hours 44 minutes',
    'AVAILABLE'
),

-- Suất chiếu Alien: Romulus tối nay
(
    (SELECT id FROM movies WHERE title = 'Alien: Romulus' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 01 - 2D Digital BHD' LIMIT 1),
    CURRENT_DATE + INTERVAL '21 hours 15 minutes',
    CURRENT_DATE + INTERVAL '23 hours 14 minutes',
    'AVAILABLE'
),

-- Suất chiếu Joker: Điên Có Đôi ngày mai
(
    (SELECT id FROM movies WHERE title = 'Joker: Điên Có Đôi' LIMIT 1),
    (SELECT id FROM rooms WHERE name = 'Phòng 02 - Standard 2D Landmark 81' LIMIT 1),
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '19 hours 30 minutes',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '21 hours 48 minutes',
    'AVAILABLE'
);

-- -----------------------------------------------------------------------------
-- 12. Ghế Suất Chiếu Mẫu (Showtime Seat - ID tự tăng BIGSERIAL)
-- Áp dụng cho suất chiếu đầu tiên của Dune 2 tại Phòng 01 Landmark 81
-- -----------------------------------------------------------------------------
INSERT INTO showtime_seat (showtime_id, seat_id, label, type, status, booking_id)
SELECT
    st.id AS showtime_id,
    s.id AS seat_id,
    s.label,
    s.type,
    -- Giả lập một vài ghế đã được đặt để kiểm thử giao diện
    CASE
        WHEN s.label IN ('E5', 'E6', 'E7', 'F5', 'F6', 'F7') THEN 'BOOKED'
        WHEN s.label IN ('G5', 'G6') THEN 'LOCKED'
        ELSE 'AVAILABLE'
    END AS status,
    CASE
        WHEN s.label IN ('E5', 'E6', 'E7', 'F5', 'F6', 'F7') THEN 'bk-demo-sample-001'
        ELSE NULL
    END AS booking_id
FROM seats s
CROSS JOIN LATERAL (
    SELECT id FROM show_times
    WHERE movie_id = (SELECT id FROM movies WHERE title = 'Dune: Hành Tinh Cát - Phần Hai' LIMIT 1)
    ORDER BY start_time ASC
    LIMIT 1
) st
WHERE s.room_id = (SELECT id FROM rooms WHERE name = 'Phòng 01 - IMAX Laser Landmark 81' LIMIT 1);

-- -----------------------------------------------------------------------------
-- 13. Khuyến Mãi & Giảm Giá (Promotions - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO promotions (
    code, name, description, type, value, min_order_value,
    usage_limit, used_count, start_date, end_date, status,
    for_guest, apply_fnb, apply_ticket
) VALUES
(
    'CINEMEOW20',
    'Giảm 20% Cho Đơn Hàng Đầu Tiên',
    'Ưu đãi đặc biệt giảm ngay 20% tổng giá trị đơn hàng cho khách hàng trải nghiệm CineMeow lần đầu.',
    'PERCENTAGE',
    20.00,
    100000.00,
    5000,
    124,
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    'ACTIVE',
    TRUE,
    TRUE,
    TRUE
),
(
    'MEOW50K',
    'Giảm 50.000đ Vé Xem Phim Cuối Tuần',
    'Tặng 50.000đ khi đặt từ 2 vé xem phim trở lên vào các ngày cuối tuần (Thứ 7 & Chủ Nhật).',
    'FIXED_AMOUNT',
    50000.00,
    150000.00,
    2000,
    312,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP + INTERVAL '45 days',
    'ACTIVE',
    FALSE,
    FALSE,
    TRUE
),
(
    'POPCORNFREE',
    'Ưu Đãi Giảm 35.000đ Cho Combo Bắp Nước',
    'Giảm ngay 35.000đ khi mua kèm combo bắp nước bất kỳ tại quầy hoặc đặt trực tuyến.',
    'FNB_DISCOUNT',
    35000.00,
    80000.00,
    3000,
    88,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    'ACTIVE',
    TRUE,
    TRUE,
    FALSE
),
(
    'VIPMEMBER15',
    'Tri Ân Hội Viên Thân Thiết CineMeow 15%',
    'Đặc quyền giảm 15% cho toàn bộ vé và bắp nước áp dụng không giới hạn đơn hàng tối thiểu.',
    'PERCENTAGE',
    15.00,
    0.00,
    10000,
    456,
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP + INTERVAL '180 days',
    'ACTIVE',
    FALSE,
    TRUE,
    TRUE
)
ON CONFLICT (code) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 14. Điều Kiện Áp Dụng Khuyến Mãi (Promotion Conditions - ID tự sinh UUID)
-- -----------------------------------------------------------------------------
INSERT INTO promotion_conditions (promotion_id, type, value) VALUES
(
    (SELECT id FROM promotions WHERE code = 'MEOW50K' LIMIT 1),
    'DAY_OF_WEEK',
    'WEEKEND'
),
(
    (SELECT id FROM promotions WHERE code = 'POPCORNFREE' LIMIT 1),
    'BRAND',
    'CineMeow'
),
(
    (SELECT id FROM promotions WHERE code = 'VIPMEMBER15' LIMIT 1),
    'USER_TYPE',
    'VIP'
);
 