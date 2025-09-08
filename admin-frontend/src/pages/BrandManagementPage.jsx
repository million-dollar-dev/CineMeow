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
import BrandModal from "../components/CinemaManagement/BrandModal.jsx";

export default function BrandManagementPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const brands = [
        {
            "id": 1,
            "name": "CGV Cinemas",
            "logoUrl": "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
            "description": "CGV là chuỗi rạp chiếu phim lớn nhất Việt Nam, mang đến trải nghiệm điện ảnh hiện đại với nhiều phòng chiếu đặc biệt như IMAX, 4DX.",
            "employees": 2000,
            bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
        },
        {
            "id": 2,
            "name": "Galaxy Cinema",
            "logoUrl": "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
            "description": "Galaxy Cinema nổi bật với giá vé phải chăng và chất lượng dịch vụ tốt, là lựa chọn yêu thích của giới trẻ tại các thành phố lớn.",
            "employees": 800,
            bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
        },
        {
            "id": 3,
            "name": "Lotte Cinema",
            "logoUrl": "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
            "description": "Lotte Cinema là thương hiệu rạp chiếu phim đến từ Hàn Quốc, chú trọng sự thoải mái và không gian thân thiện cho khán giả.",
            "employees": 1200,
            bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
        },
        {
            "id": 4,
            "name": "BHD Star Cineplex",
            "logoUrl": "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
            "description": "BHD Star là chuỗi rạp phát triển nhanh chóng tại Việt Nam, với hệ thống rạp chiếu hiện đại và dịch vụ đa dạng.",
            "employees": 600,
            bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
        },
        {
            "id": 5,
            "name": "Cinestar",
            "logoUrl": "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
            "description": "Cinestar tập trung vào phân khúc giá vé bình dân, đem lại trải nghiệm điện ảnh chất lượng cho sinh viên và giới trẻ.",
            "employees": 350,
            bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
        }
    ];


    const columns = [
        {
            field: "logoUrl",
            headerName: "Logo",
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
                        src={params.value}
                        alt="logo"
                        style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: "8px",
                            borderWidth: "2px",
                            borderColor: "black",
                        }}
                    />
                </Box>
            ),
        },
        { field: "name", headerName: "Name", flex: 1, minWidth: 50 },
        { field: "description", headerName: "Description", width: 350 },
        { field: "employees", headerName: "Employees", width: 100 },
        {
            field: "bgUrl",
            headerName: "Background",
            headerClassName: "custom-header",
            width: 200,
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
                        src={params.value}
                        alt="background"
                        style={{
                            width: 160,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: "8px",
                            borderColor: "black",
                        }}
                    />
                </Box>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
                        onClick={() => handleEditClick(params.row)}
                    >
                        Tùy chỉnh
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

    const isLoading = false;
    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedBrand, setSelectedBrand] = useState(null);

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedBrand(null);
        setOpenModal(true);
    };

    const handleEditClick = (brand) => {
        setModalMode("edit");
        console.log(brand);
        setSelectedBrand(brand);
        setOpenModal(true);
    };
    return (
        <Box className="py-2 min-h-screen">
            <BrandModal open={openModal}
                        onClose={() => setOpenModal(false)}
                        mode={modalMode}
                        brandData={selectedBrand}
            />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Thương Hiệu</h2>
            </div>

            <Box sx={{ height: 630, width: "100%" }}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={brands}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={160}
                        slots={{ toolbar: () => <CustomToolbar handleAddClick={handleAddClick} /> }}
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
