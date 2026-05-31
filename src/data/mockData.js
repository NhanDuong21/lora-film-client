export const MOVIES = [
  {
    id: 1,
    title: 'Dinh Thinh La Yeu',
    rating: 4.5,
    genres: ['Lang Man', 'Hai Huoc'],
    genre: 'Lang Man, Hai Huoc',
    duration: '112 phut',
    ageRating: 'T13',
    synopsis: 'Cau chuyen tinh yeu cuc ky ngot ngao va hai huoc giua hai nguoi tre tuong chung nhu khong co diem chung. Nhung tinh huong do khoc do cuoi dien ra lien tiep khien ho nhan ra doi phuong la manh ghep hoan hao cua cuoc doi minh.',
    posterUrl: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7124c5?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7124c5?w=600&auto=format&fit=crop&q=80',
    trailerId: 'eHp3MbsQgzk',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Kaity Nguyễn", role: "Nhà Phương", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
      { name: "Trấn Thành", role: "Ông Sơn", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Trấn Thành",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn kiêm nhà sản xuất phim xuất sắc của điện ảnh Việt Nam với doanh thu nghìn tỷ.",
      metrics: { birth: "05/02/1987", height: "1m70", nationality: "Việt Nam", tags: ["Đa Tài", "Kỷ Lục", "Truyền Cảm Hứng"] }
    }
  },
  {
    id: 2,
    title: 'Tu Vu Tru John Wick: Ballerina',
    rating: 4.8,
    genres: ['Hanh Dong', 'Kich Tinh'],
    genre: 'Hanh Dong, Kich Tinh',
    duration: '125 phut',
    ageRating: 'T18',
    synopsis: 'Bo phim thuong mai spin-off tu vu tru sat thu John Wick, xoay quanh nu sat thu Eve Macarro tren con duong tra thu cho gia dinh bi sat hai. Co phai doi mat voi ca the gioi ngam va ren luyen cac ky nang chien dau sinh tu de sinh ton.',
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    trailerId: 'yJ9w2zD244U',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Ana de Armas", role: "Eve Macarro", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" },
      { name: "Keanu Reeves", role: "John Wick", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Chad Stahelski",
      avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn hành động Hollywood nổi tiếng đứng sau loạt bom tấn John Wick hoành tráng.",
      metrics: { birth: "20/09/1968", height: "1m85", nationality: "Mỹ", tags: ["John Wick", "Hành Động", "Võ Thuật"] }
    }
  },
  {
    id: 3,
    title: 'Biet Doi Sam Set',
    rating: 4.2,
    genres: ['Hanh Dong', 'Vien Tuong'],
    genre: 'Hanh Dong, Vien Tuong',
    duration: '130 phut',
    ageRating: 'T16',
    synopsis: 'Biet doi anti-hero moi cua Marvel gom nhung ke bat hao hop luc lam nhiem vu toi mat cho chinh phu. Tap hop nhung tinh cach lap di nhung co ky nang dac biet hua hen mang den nhung tran chien man nhan va day bat ngo.',
    posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    trailerId: 'vB8VvA88d6I',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Florence Pugh", role: "Yelena Belova", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
      { name: "Sebastian Stan", role: "Bucky Barnes", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Jake Schreier",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Nhà làm phim trẻ tài năng nổi tiếng với lối kể chuyện hiện đại và các tác phẩm Marvel.",
      metrics: { birth: "29/09/1981", height: "1m80", nationality: "Mỹ", tags: ["Marvel", "Hiện Đại", "Cảm Xúc"] }
    }
  },
  {
    id: 4,
    title: 'De Men Cuoc Phieu Luu Toi Xu',
    rating: 4.0,
    genres: ['Hoat Hinh', 'Phieu Luu'],
    genre: 'Hoat Hinh, Phieu Luu',
    duration: '95 phut',
    ageRating: 'P',
    synopsis: 'Cuoc hanh trinh phieu luu ky thu cua chu De Men tre tuoi, hoc hoi nhung bai hoc quy gia ve tinh ban, long dung cam va hoai bao tuong lai. Di qua nhung vung dat xa la va vuot qua nhung hiem nguy day ray trong thien nhien.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    trailerId: 'fS_f0n-dF3Y',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Kiều Minh Tuấn", role: "Dế Mèn (Lồng tiếng)", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" },
      { name: "Kaity Nguyễn", role: "Nhà Béo (Lồng tiếng)", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Phùng Đình Dũng",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn phim hoạt hình hàng đầu Việt Nam mang nét vẽ dân gian hội nhập thế giới.",
      metrics: { birth: "12/03/1980", height: "1m72", nationality: "Việt Nam", tags: ["Hoạt Hình", "Dân Gian", "Tỉ Mỉ"] }
    }
  },
  {
    id: 5,
    title: 'Buon Than Ban Thanh',
    rating: 4.9,
    genres: ['Kinh Di', 'Tam Linh', 'Hai'],
    genre: 'Kinh Di, Tam Linh, Hai',
    duration: '108 phut',
    ageRating: 'T18',
    synopsis: 'Cau chuyen kinh di tam linh giua gia dinh va am linh doi co. Su xen kieu giua nhung yeu to hai huoc va rung ron kien tao cam xuc thu vi. Lieu su giau co co den tu nhung thoa thuan xau xa voi the luc o am ti?',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    trailerId: 'R-v3W0Yp3dE',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Kiều Minh Tuấn", role: "Pháp Sư Pháp", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" },
      { name: "Trấn Thành", role: "Thầy Cúng Cường", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Charlie Nguyễn",
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn kỳ cựu đi đầu trong thể loại hài hành động và tâm lý sâu sắc của Việt Nam.",
      metrics: { birth: "25/09/1968", height: "1m73", nationality: "Mỹ / Việt Nam", tags: ["Hài Hước", "Hành Động", "Kinh Nghiệm"] }
    }
  },
  {
    id: 6,
    title: 'Nam Muoi',
    rating: 4.1,
    genres: ['Tam Ly', 'Hoc Duong'],
    genre: 'Tam Ly, Hoc Duong',
    duration: '100 phut',
    ageRating: 'T16',
    synopsis: 'Nam Muoi la mot bo phim kinh di hoc duong tam ly, xoay quanh truyen thuyet do thi ma mi va nhung goc khuat hoc duong dang so khong the ngo toi. Tro choi tam linh vo tinh goi len oan hon doi khat su tra thu.',
    posterUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80',
    trailerId: '3Z8vX90i-bU',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Kaity Nguyễn", role: "Linh", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
      { name: "Kiều Minh Tuấn", role: "Thầy giáo Bình", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Nguyễn Hữu Hoàng",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn tài năng trẻ tiên phong trong dòng phim trinh thám học đường ly kỳ bí ẩn.",
      metrics: { birth: "08/11/1991", height: "1m76", nationality: "Việt Nam", tags: ["Trinh Thám", "Học Đường", "Góc Quay Đẹp"] }
    }
  },
  {
    id: 7,
    title: 'Tham Tu Kien: Ky An Buong Bau',
    rating: 4.6,
    genres: ['Trinh Tham', 'Hinh Su'],
    genre: 'Trinh Tham, Hinh Su',
    duration: '118 phut',
    ageRating: 'T16',
    synopsis: 'Tham tu Kien vao cuoc dieu tra ky an an giau noi buong bau ton nghiem cua dong ho quy toc. Su that phuc tap dan duoc bo mat qua moi manh khoe suy luan thong thai nhung day hiem nguy.',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80',
    trailerId: '1Z_v7Gq7948',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Trấn Thành", role: "Thám tử Kiên", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
      { name: "Kiều Minh Tuấn", role: "Trưởng giả Thuận", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Victor Vũ",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Ông hoàng phim giật gân, tâm linh và chuyển thể văn học của Việt Nam với các góc quay đỉnh cao.",
      metrics: { birth: "25/11/1975", height: "1m75", nationality: "Việt Nam / Mỹ", tags: ["Kinh Dị", "Giật Gân", "Chuyển Thể"] }
    }
  },
  {
    id: 8,
    title: 'Lat Mat 7: Mot Dieu Uoc',
    rating: 4.7,
    genres: ['Gia Dinh', 'Tam Ly'],
    genre: 'Gia Dinh, Tam Ly',
    duration: '112 phut',
    ageRating: 'P',
    synopsis: 'Cau chuyen cam dong ve tinh mau tu thieng lieng cua me gia va cac con. Bo phim la hanh trinh lay di nuoc mat nguoi xem va thuc tinh moi nguoi ve y nghia gia dinh.',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    trailerId: '2b4S_iVsp1E',
    status: 'NOW_SHOWING',
    cast: [
      { name: "Kiều Minh Tuấn", role: "Hai (Con cả)", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Lý Hải",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn chuỗi phim ăn khách Lật Mặt, bậc thầy phim gia đình hài hước tràn đầy cảm xúc.",
      metrics: { birth: "28/09/1968", height: "1m69", nationality: "Việt Nam", tags: ["Lật Mặt", "Gia Đình", "Mộc Mạc"] }
    }
  },
  {
    id: 9,
    title: 'Captain America: The Gioi Moi',
    rating: 4.3,
    genres: ['Hanh Dong', 'Sci-Fi'],
    genre: 'Hanh Dong, Sci-Fi',
    duration: '122 phut',
    ageRating: 'T13',
    synopsis: 'Sam Wilson chinh thuc khoac len minh chiec khien Captain America de doi mat voi mot am muu chinh tri nguy hiem toan cau. Nhung cuoc xung dot khong khoan nhuong.',
    posterUrl: 'https://images.unsplash.com/photo-1478720143022-9057235c7443?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1478720143022-9057235c7443?w=600&auto=format&fit=crop&q=80',
    trailerId: 'lh8Lal1N14A',
    status: 'COMING_SOON',
    cast: [
      { name: "Anthony Mackie", role: "Sam Wilson / Captain America", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" },
      { name: "Sebastian Stan", role: "Bucky Barnes / Winter Soldier", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Julius Onah",
      avatarUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn và nhà biên kịch người Mỹ gốc Nigeria chịu trách nhiệm về tương lai MCU.",
      metrics: { birth: "10/02/1983", height: "1m78", nationality: "Mỹ / Nigeria", tags: ["Sci-Fi", "Marvel", "Chính Trị"] }
    }
  },
  {
    id: 10,
    title: 'Minecraft: Phim Dien Anh',
    rating: 4.4,
    genres: ['Hoat Hinh', 'Hai Huoc'],
    genre: 'Hoat Hinh, Hai Huoc',
    duration: '105 phut',
    ageRating: 'P',
    synopsis: 'Buoc vao the gioi khoi vuong ky dieu cung nhung nhan vat quen thuoc trong cuoc hanh trinh chong lai the luc bong toi bao ve vung dat than yeu.',
    posterUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    trailerId: 'w543_lR5_00',
    status: 'COMING_SOON',
    cast: [
      { name: "Jack Black", role: "Steve", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
      { name: "Jason Momoa", role: "Garrett Garrison", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Jared Hess",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn phim hài độc lập nổi tiếng với những nhân vật kỳ quặc đáng yêu và thế giới game.",
      metrics: { birth: "20/06/1979", height: "1m82", nationality: "Mỹ", tags: ["Minecraft", "Hài Hước", "Độc Đáo"] }
    }
  },
  {
    id: 11,
    title: 'Superman: Kien Thiet',
    rating: 4.9,
    genres: ['Hanh Dong', 'Sieu Anh Hung'],
    genre: 'Hanh Dong, Sieu Anh Hung',
    duration: '135 phut',
    ageRating: 'T13',
    synopsis: 'Hanh trinh khoi dau day thu thach cua Clark Kent phai can bang giua di san Krypton va cuoc song lam con nguoi tai Trai Dat truoc hiem hoa kiet diet.',
    posterUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=600&auto=format&fit=crop&q=80',
    trailerId: 'V9D-fS4WvP4',
    status: 'COMING_SOON',
    cast: [
      { name: "David Corenswet", role: "Clark Kent / Superman", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80" },
      { name: "Rachel Brosnahan", role: "Lois Lane", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "James Gunn",
      avatarUrl: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Tổng công trình sư mới của vũ trụ siêu anh hùng, nổi tiếng với sự sáng tạo vô biên.",
      metrics: { birth: "05/08/1966", height: "1m83", nationality: "Mỹ", tags: ["Superman", "Sáng Tạo", "Vũ Trụ"] }
    }
  },
  {
    id: 12,
    title: 'Conan: Ky An Tram Tau',
    rating: 4.6,
    genres: ['Trinh Tham', 'Hoat Hinh'],
    genre: 'Trinh Tham, Hoat Hinh',
    duration: '110 phut',
    ageRating: 'T13',
    synopsis: 'Tham tu lung danh Conan va toan doi tham tu nhi vao cuoc truy tim hung thu dung sau vu no kinh hoang tai ga tau dien ngam hien dai nhat Tokyo.',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    trailerId: 'wO2F1H-zC1M',
    status: 'COMING_SOON',
    cast: [
      { name: "Minami Takayama", role: "Edogawa Conan (Lồng tiếng)", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Yuzuru Tachikawa",
      avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn Anime kỳ cựu Nhật Bản chịu trách nhiệm chuyển thể các đại án Conan.",
      metrics: { birth: "02/12/1981", height: "1m70", nationality: "Nhật Bản", tags: ["Anime", "Conan", "Kịch Tính"] }
    }
  },
  {
    id: 13,
    title: 'Biet Doi Bat Hao',
    rating: 4.1,
    genres: ['Hanh Dong', 'Hai Huoc'],
    genre: 'Hanh Dong, Hai Huoc',
    duration: '115 phut',
    ageRating: 'T16',
    synopsis: 'Nhung ke tu toi khet tieng dung chung mot chien tuyen de doi lay tu do cua minh bang cach ngan chan thien tai dien ro muon chiem linh the gioi.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
    trailerId: 'lq5y2hZq-hM',
    status: 'COMING_SOON',
    cast: [
      { name: "Florence Pugh", role: "Yelena", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Jake Schreier",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Nhà làm phim trẻ tài năng nổi tiếng với lối kể chuyện hiện đại và các tác phẩm Marvel.",
      metrics: { birth: "29/09/1981", height: "1m80", nationality: "Mỹ", tags: ["Marvel", "Hiện Đại", "Cảm Xúc"] }
    }
  },
  {
    id: 14,
    title: 'Chien Binh Bao Tap',
    rating: 4.3,
    genres: ['Hanh Dong', 'Co Trang'],
    genre: 'Hanh Dong, Co Trang',
    duration: '120 phut',
    ageRating: 'T16',
    synopsis: 'Cuoc khoi nghia cuu quoc chong quan xam luoc cua nhung chien binh dung cam noi nui rung trung diep. Nhung tran giao kien kịch tinh man nhan.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&auto=format&fit=crop&q=80',
    trailerId: 'pP_o66qZt8g',
    status: 'COMING_SOON',
    cast: [
      { name: "Kiều Minh Tuấn", role: "Tướng quân Phong", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80" }
    ],
    director: {
      name: "Lý Hải",
      avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80",
      bioSummary: "Đạo diễn chuỗi phim ăn khách Lật Mặt, bậc thầy phim gia đình hài hước tràn đầy cảm xúc.",
      metrics: { birth: "28/09/1968", height: "1m69", nationality: "Việt Nam", tags: ["Lật Mặt", "Gia Đình", "Mộc Mạc"] }
    }
  }
];

export const movies = MOVIES;

export const CINEMA_CLUSTERS = [
  "Lora Nguyen Du",
  "Lora Thao Dien",
  "Lora Royal City"
];

export const SHOWTIMES = [
  "09:30",
  "13:15",
  "16:45",
  "19:30",
  "22:15"
];
