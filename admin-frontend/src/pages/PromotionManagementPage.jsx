import React, {useEffect, useState} from 'react';
import {Box, Button} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

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

const PromotionManagementPage = () => {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedItem, setSelectedItem] = useState(null);

    const {data: promotions, isLoading, isError, error} = useGetAllPromotionsQuery();

    const columns = [
        { field: "code", headerName: "Mã", flex: 1, minWidth: 70 },
        { field: "name", headerName: "Tên", flex: 1, minWidth: 180 },
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
                        <span style={{ fontWeight: 600 }}>{date.format("HH:mm")}</span>
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>{date.format("DD/MM/YY")}</span>
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
                        <span style={{ fontWeight: 600 }}>{date.format("HH:mm")}</span>
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>{date.format("DD/MM/YY")}</span>
                    </div>
                );
            },
        },
        { field: "status", headerName: "Trạng thái", width: 90 },
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
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
    }, [isError, error, isLoading, promotions]);

    return (
        <Box className="py-2 min-h-screen">
            <PromotionModal
                mode={modalMode}
                onClose={() => setOpenModal(false)}
                open={openModal}
            />
            <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Ưu đãi</h2>
            </div>

            <Box sx={{ height: 630, width: "100%" }}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={promotions}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={100}
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
};

export default PromotionManagementPage;