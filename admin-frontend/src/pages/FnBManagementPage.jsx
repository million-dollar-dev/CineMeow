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
import {useEffect, useState} from "react";
import BrandModal from "../components/CinemaManagement/BrandModal.jsx";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import {useDispatch} from "react-redux";
import {useGetAllFnBsQuery} from "../services/cinemaService.js";
import FnBModal from "../components/CinemaManagement/FnBModal.jsx";
import {FNB_AVAILABLE, FNB_CATEGORY} from "../constants/fnbContants.js";

export default function FnBManagementPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

    const columns = [
        {
            field: "cinemaBrand",
            headerName: "Thương hiệu",
            headerClassName: "custom-header",
            width: 120,
            sortable: false,
            renderCell: (params) => {
                const logoUrl = params.row.cinemaBrand?.logoUrl;
                return (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="logo"
                                style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "2px solid black",
                                }}
                            />
                        ) : (
                            <span>Không có logo</span>
                        )}
                    </Box>
                );
            },
        },
        { field: "name", headerName: "Tên", flex: 1, minWidth: 50 },
        {
            field: "imageUrl",
            headerName: "Hình ảnh",
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
                        alt="background"
                        style={{
                            width: 140,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "8px",
                            borderColor: "black",
                        }}
                    />
                </Box>
            ),
        },
        {
            field: "price",
            headerName: "Giá",
            width: 90,
            align: "right",
            headerAlign: "right",
            renderCell: (params) => {
                if (params.value == null) return "";
                return new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                }).format(params.value);
            },
        },

        {
            field: "category",
            headerName: "Phân loại",
            width: 100,
            renderCell: (params) => {
                const category = FNB_CATEGORY.find((c) => c.value === params.value);
                return category ? category.label : "Không rõ";
            },
        },
        {
            field: "available",
            headerName: "Phục vụ",
            width: 90,
            renderCell: (params) => {
                const available = FNB_AVAILABLE.find((a) => a.value === params.value);
                return (
                    <span
                        style={{
                            color: available?.value ? "#4caf50" : "#f44336", // xanh/đỏ
                            fontWeight: 600,
                        }}
                    >
                    {available ? available.label : "Không rõ"}
                </span>
                );
            },
        },
        { field: "description", headerName: "Mô tả", width: 250 },
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

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    const {data: itemResponse, isError, error, isLoading} = useGetAllFnBsQuery();
    const items = itemResponse?.data ?? [];

    console.log(items);

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedItem(null);
        setOpenModal(true);
    };

    const handleEditClick = (item) => {
        setModalMode("edit");
        setSelectedItem(item);
        setOpenModal(true);
    };

    useEffect(() => {
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, itemResponse]);

    return (
        <Box className="py-2 min-h-screen">
            <FnBModal open={openModal}
                        onClose={() => setOpenModal(false)}
                        mode={modalMode}
                        itemData={selectedItem}
            />

            <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Sản Phẩm</h2>
            </div>

            <Box sx={{ height: 630, width: "100%" }}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={items}
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
