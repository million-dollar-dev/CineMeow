import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TableSkeleton from "../components/MovieManagement/TableSkeleton.jsx";
import {useEffect, useState} from "react";
import BrandModal from "../components/CinemaManagement/BrandModal.jsx";
import {useGetAllBrandsQuery} from "../services/brandService.js";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import {useDispatch} from "react-redux";
import TicketPriceModal from "../components/CinemaManagement/TicketPriceModal.jsx";

export default function PricingManagementPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });

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
                            width: 80,
                            height: 80,
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
        { field: "employeeCount", headerName: "Employees", width: 100 },
        {
            field: "backgroundUrl",
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
                <Box sx={{ alignItems: "center"}}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
                        onClick={() => handleOpenModalClick(params.row)}
                    >
                        Tùy chỉnh giá vé
                    </Button>
                </Box>
            ),
        },
    ];

    const {data: brandResponse, isError, error, isLoading} = useGetAllBrandsQuery();
    const brands = brandResponse?.data ?? [];

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedBrand, setSelectedBrand] = useState(brands[0]);



    const handleOpenModalClick = (brand) => {
        setSelectedBrand(brand);
        setOpenModal(true);
    };

    useEffect(() => {
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, brandResponse]);

    return (
        <Box className="py-2 min-h-screen">
            <TicketPriceModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                brand={selectedBrand}
            />

            <div className="flex justify-between items-center my-4">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Giá Vé</h2>
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
