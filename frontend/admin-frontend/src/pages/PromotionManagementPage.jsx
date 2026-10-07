import React, {useEffect, useState} from 'react';
import {Box, Button} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import TableSkeleton from "../components/MovieManagement/TableSkeleton.jsx";
import {DataGrid} from "@mui/x-data-grid";
import CustomToolbar from "../components/CustomToolbar.jsx";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import BooleanChip from "../components/BooleanChip.jsx";
import PromotionModal from "../components/PromotionManagement/PromotionModal.jsx";
import {useGetAllPromotionsQuery} from "../services/promotionService.js";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import {useDispatch} from "react-redux";
import StatusChip from "../components/StatusChip.jsx";
import {PROMOTION_STATUS_CONFIG} from "../constants/promotionConstants.js";

const PromotionManagementPage = () => {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    const {data: promotions, isLoading, isError, error, refetch} = useGetAllPromotionsQuery();

    const columns = [
        {field: "code", headerName: "Mã", flex: 1, minWidth: 70},
        {field: "name", headerName: "Tên", flex: 1, minWidth: 180},
        {
            field: "startDate",
            headerName: "Ngày áp dụng",
            width: 140,
            renderCell: (params) => {
                const date = dayjs(params.value);
                if (!date.isValid()) return "-";
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            textAlign: "center",
                            lineHeight: "1.2",
                        }}
                    >
                        <span style={{fontWeight: 600}}>{date.format("HH:mm")}</span>
                        <span style={{fontSize: "0.8rem", color: "#666"}}>{date.format("DD/MM/YY")}</span>
                    </div>
                );
            },
        },
        {
            field: "endDate",
            headerName: "Ngày kết thúc",
            width: 140,
            renderCell: (params) => {
                const date = dayjs(params.value);
                if (!date.isValid()) return "-";
                return (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            textAlign: "center",
                            lineHeight: "1.2",
                        }}
                    >
                        <span style={{fontWeight: 600}}>{date.format("HH:mm")}</span>
                        <span style={{fontSize: "0.8rem", color: "#666"}}>{date.format("DD/MM/YY")}</span>
                    </div>
                );
            },
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 120,
            renderCell: (params) => <StatusChip status={params.value} configs={PROMOTION_STATUS_CONFIG}/>,
        },
        {
            field: "forGuest",
            headerName: "Cho khách",
            width: 100,
            headerAlign: "center",
            align: "center",
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
                    {BooleanChip(params.value)}
                </Box>
            ),
        },
        {
            field: "applyFnb",
            headerName: "Cho FnB",
            width: 90,
            headerAlign: "center",
            align: "center",
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
                    {BooleanChip(params.value)}
                </Box>
            ),
        },
        {
            field: "applyTicket",
            headerName: "Cho Vé",
            width: 90,
            headerAlign: "center",
            align: "center",
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
                    {BooleanChip(params.value)}
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
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    <Button
                        startIcon={<EditOutlinedIcon/>}
                        variant="text"
                        sx={{color: "black"}}
                        onClick={() => handleEditClick(params.row)}
                    >
                        Tùy chỉnh
                    </Button>
                    <span style={{color: "black"}}>|</span>
                    <Button
                        startIcon={<DeleteOutlineOutlinedIcon/>}
                        variant="text"
                        sx={{color: "red"}}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedItem(null);
        setOpenModal(true);
    };

    const handleEditClick = (item) => {
        setModalMode("edit");
        setSelectedItem(item);
        setOpenModal(true);
        console.log(selectedItem)
    };

    useEffect(() => {
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, promotions]);

    return (
        <Box className="py-2 min-h-screen">
            <PromotionModal
                mode={modalMode}
                onClose={() => setOpenModal(false)}
                open={openModal}
                itemData={selectedItem}
            />
            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ConfirmationNumberOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Ưu Đãi</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Thiết lập mã giảm giá, chương trình ưu đãi vé xem phim và combo bắp nước trên toàn hệ thống
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={() => {
                            refetch();
                            dispatch(openSnackbar({ message: "Đang đồng bộ dữ liệu ưu đãi...", type: "info" }));
                        }}
                        startIcon={<RefreshOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            color: "#475569",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Làm mới
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAddClick}
                        startIcon={<AddOutlinedIcon />}
                        sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "12px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                            },
                        }}
                    >
                        Thêm ưu đãi mới
                    </Button>
                </div>
            </div>

            <Box sx={{height: 630, width: "100%"}}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel}/>
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={promotions}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={100}
                        slots={{toolbar: () => <CustomToolbar handleAddClick={handleAddClick}/>}}
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
};

export default PromotionManagementPage;