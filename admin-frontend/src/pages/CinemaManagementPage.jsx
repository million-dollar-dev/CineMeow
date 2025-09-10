import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CustomToolbar from "../components/CustomToolbar.jsx";
import TableSkeleton from "../components/moviesManagement/TableSkeleton.jsx";
import {useState} from "react";
import CinemaModal from "../components/CinemaManagement/CinemaModal.jsx";

export default function CinemaManagementPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const rooms = [
        {
            id: "room-1",
            name: "Phòng chiếu 1",
            seatCount: 120,
            type: "Standard",
            status: "Active",
        },
        {
            id: "room-2",
            name: "Phòng chiếu 2",
            seatCount: 80,
            type: "VIP",
            status: "Active",
        },
        {
            id: "room-3",
            name: "Phòng chiếu 3",
            seatCount: 200,
            type: "IMAX",
            status: "Active",
        },
        {
            id: "room-4",
            name: "Phòng chiếu 4",
            seatCount: 100,
            type: "Standard",
            status: "Maintenance",
        },
        {
            id: "room-4",
            name: "Phòng chiếu 4",
            seatCount: 100,
            type: "Standard",
            status: "Maintenance",
        },
        {
            id: "room-4",
            name: "Phòng chiếu 4",
            seatCount: 100,
            type: "Standard",
            status: "Maintenance",
        },
        {
            id: "room-4",
            name: "Phòng chiếu 4",
            seatCount: 100,
            type: "Standard",
            status: "Maintenance",
        },
        {
            id: "room-4",
            name: "Phòng chiếu 4",
            seatCount: 100,
            type: "Standard",
            status: "Maintenance",
        },

    ];


    const columns = [
        {
            field: "brand",
            headerName: "Brand",
            headerClassName: "custom-header",
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <img
                        src={params.value?.logoUrl}   // 👈 lấy logoUrl từ object brand
                        alt={params.value?.name || "logo"}
                        style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid black",
                        }}
                    />
                </Box>
            ),
        },
        { field: "name", headerName: "Name", flex: 1, minWidth: 50 },
        { field: "address", headerName: "Address", width: 300 },
        { field: "city", headerName: "City", width: 100 },
        { field: "totalRoom", headerName: "Room", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: () => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
                        onClick={() => handleEditClick()}
                    >
                        Chi tiết
                    </Button>
                    <span style={{ color: "black" }}>|</span>
                    <Button
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="text"
                        sx={{ color: "red" }}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const cinemas = [
        {
            "id": "cinema-1",
            "name": "CGV Aeon Mall Tân Phú",
            "address": "30 Bờ Bao Tân Thắng, Tân Phú",
            "city": "Hồ Chí Minh",
            "brand": {
                "id": "brand-1",
                "name": "CGV",
                "logoUrl": "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
            },
            "imageUrl": "https://www.cgv.vn/media/wysiwyg/Aeon_TanPhu.jpg",
            totalRoom: 1,
        },
        {
            "id": "cinema-2",
            "name": "CGV Vincom Đồng Khởi",
            "address": "72 Lê Thánh Tôn, Quận 1",
            "city": "Hồ Chí Minh",
            "brand": {
                "id": "brand-1",
                "name": "CGV",
                "logoUrl": "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
            },
            "imageUrl": "https://www.cgv.vn/media/wysiwyg/Vincom_DongKhoi.jpg",
            totalRoom: 1,
        },
        {
            "id": "cinema-3",
            "name": "Galaxy Nguyễn Du",
            "address": "116 Nguyễn Du, Quận 1",
            "city": "Hồ Chí Minh",
            "brand": {
                "id": "brand-2",
                "name": "Galaxy Cinema",
                "logoUrl": "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
            },
            "imageUrl": "https://galaxycine.vn/media/2022/7/12/nguyen-du-1_1657604007340.jpg",
            totalRoom: 1,
        },
        {
            "id": "cinema-4",
            "name": "Lotte Cinema Gò Vấp",
            "address": "242 Nguyễn Văn Lượng, Gò Vấp",
            "city": "Hồ Chí Minh",
            "brand": {
                "id": "brand-3",
                "name": "Lotte Cinema",
                "logoUrl": "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
            },
            "imageUrl": "https://lottecinemavn.com/media/2023/3/12/lotte-govap_1678603920530.jpg",
            totalRoom: 1,
        },
        {
            "id": "cinema-5",
            "name": "Beta Cinemas Thanh Xuân",
            "address": "Tầng 3, TTTM Mỹ Đình Plaza 2, Hà Nội",
            "city": "Hà Nội",
            "brand": {
                "id": "brand-4",
                "name": "Beta Cinemas",
                "logoUrl": "https://homepage.momocdn.net/cinema/momo-amazone-s3-api-240829164527-638605467276820522.png"
            },
            "imageUrl": "https://betacinemas.vn/media/2022/11/24/thanh-xuan_1669260178246.jpg",
            totalRoom: 1,
        }
    ]

    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCinema, setSelectedCinema] = useState(null);
    const isLoading = false;

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedCinema(null);
        setOpenModal(true);
    };

    const handleEditClick = () => {
        setModalMode("edit");
        setSelectedCinema(cinemas[0]);
        setOpenModal(true);
    };

    return (
        <Box className="py-2 min-h-screen">
            <CinemaModal open={openModal}
                        onClose={() => setOpenModal(false)}
                        mode={modalMode}
                        brandData={selectedCinema}
                        rooms={rooms}
            />
            <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Rạp Phim</h2>
            </div>

            <Box sx={{ height: 630, width: "100%" }}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={cinemas}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={160}
                        slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick}/> }}
                        showToolbar
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        pagination
                    />
                )}
            </Box>
        </Box>
    );
}
