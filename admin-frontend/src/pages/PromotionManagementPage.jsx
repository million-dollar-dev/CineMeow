import React, {useState} from 'react';
import {Box, Button} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import TableSkeleton from "../components/moviesManagement/TableSkeleton.jsx";
import {DataGrid} from "@mui/x-data-grid";
import CustomToolbar from "../components/CustomToolbar.jsx";

import dayjs from "dayjs";
import "dayjs/locale/vi";
import BooleanChip from "../components/BooleanChip.jsx";

const promotions = [
    {
        "id": 1,
        "code": "PROMO2025_MEM",
        "name": "Giảm giá Tết 2025 cho thành viên",
        "description": "Khuyến mãi 20% cho tất cả thành viên dịp Tết 2025.",
        "type": "PERCENTAGE",
        "value": 20,
        "minOrderValue": 100000,
        "usageLimit": 100,
        "status": "INACTIVE",
        "startDate": "2025-01-01T00:00:00",
        "endDate": "2025-02-01T23:59:59",
        "forGuest": false,
        "applyFnb": true,
        "applyTicket": true,
        "conditions": [
            {
                "type": "USER_TYPE",
                "value": "MEMBER"
            }
        ]
    },
    {
        "id": 12,
        "code": "PROMO2025_NEW",
        "name": "Ưu đãi cho khách hàng mới 2025",
        "description": "Giảm 50.000đ cho đơn hàng đầu tiên của khách mới.",
        "type": "FIXED_AMOUNT",
        "value": 50000,
        "minOrderValue": 200000,
        "usageLimit": 500,
        "status": "ACTIVE",
        "startDate": "2025-01-05T00:00:00",
        "endDate": "2025-06-30T23:59:59",
        "forGuest": true,
        "applyFnb": false,
        "applyTicket": true,
        "conditions": [
            {
                "type": "USER_TYPE",
                "value": "NEW_USER"
            }
        ]
    },
    {
        "id": 13,
        "code": "PROMO2025_FNB",
        "name": "Giảm 10% cho dịch vụ ẩm thực",
        "description": "Khuyến mãi 10% cho các đơn hàng F&B tại rạp.",
        "type": "PERCENTAGE",
        "value": 10,
        "minOrderValue": 50000,
        "usageLimit": 300,
        "status": "ACTIVE",
        "startDate": "2025-02-01T00:00:00",
        "endDate": "2025-04-30T23:59:59",
        "forGuest": true,
        "applyFnb": true,
        "applyTicket": false,
        "conditions": [
            {
                "type": "CATEGORY",
                "value": "FOOD_BEVERAGE"
            }
        ]
    },
    {
        "id": 11,
        "code": "PROMO2025_TICKET",
        "name": "Giảm giá vé xem phim buổi sáng",
        "description": "Giảm 25% cho các suất chiếu trước 12h trưa.",
        "type": "PERCENTAGE",
        "value": 25,
        "minOrderValue": 0,
        "usageLimit": 200,
        "status": "ACTIVE",
        "startDate": "2025-03-01T00:00:00",
        "endDate": "2025-12-31T23:59:59",
        "forGuest": true,
        "applyFnb": false,
        "applyTicket": true,
        "conditions": [
            {
                "type": "SHOWTIME",
                "value": "BEFORE_NOON"
            }
        ]
    },
    {
        "id": 10,
        "code": "PROMO2025_VIP",
        "name": "Ưu đãi đặc biệt cho thành viên VIP",
        "description": "Giảm 30% cho thành viên VIP, áp dụng cả vé và combo.",
        "type": "PERCENTAGE",
        "value": 30,
        "minOrderValue": 150000,
        "usageLimit": 50,
        "status": "INACTIVE",
        "startDate": "2025-05-01T00:00:00",
        "endDate": "2025-06-01T23:59:59",
        "forGuest": false,
        "applyFnb": true,
        "applyTicket": true,
        "conditions": [
            {
                "type": "USER_TIER",
                "value": "VIP"
            }
        ]
    }
]


const PromotionManagementPage = () => {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

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
                            alignItems: "center", // căn giữa ngang
                            justifyContent: "center", // căn giữa dọc
                            height: "100%", // chiếm toàn bộ chiều cao ô
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

    const isLoading = false;
    return (
        <Box className="py-2 min-h-screen">

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
                        slots={{ toolbar: () => <CustomToolbar  /> }}
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