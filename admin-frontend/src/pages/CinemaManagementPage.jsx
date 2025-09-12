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
import CinemaModal from "../components/CinemaManagement/CinemaModal.jsx";
import RoomModal from "../components/CinemaManagement/RoomModal.jsx";
import {useGetAllBrandsQuery} from "../services/brandService.js";
import {useGetAllCinemasQuery} from "../services/cinemaService.js";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import {useDispatch} from "react-redux";

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
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button
                        startIcon={<EditOutlinedIcon />}
                        variant="text"
                        sx={{ color: "black" }}
                        onClick={() => handleEditClick(params.row)}
                    >
                        Chi tiết
                    </Button>
                    <span style={{ color: "black" }}>|</span>
                    <Button
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="text"
                        sx={{ color: "red" }}
                        onClick={() => handleDeleteClick()}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    const dispatch = useDispatch();
    const [openModal, setOpenModal] = React.useState(false);
    const [openRoomModal, setOpenRoomModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCinema, setSelectedCinema] = useState(null);

    const {data: cinemaResponse, isError, error, isLoading} = useGetAllCinemasQuery();
    const cinemas = cinemaResponse?.data ?? [];


    const handleAddClick = () => {
        setModalMode("add");
        setSelectedCinema(null);
        setOpenModal(true);
    };

    const handleEditClick = (cinema) => {
        setModalMode("edit");
        console.log(cinema);
        setSelectedCinema(cinema);
        setOpenModal(true);
    };

    const handleDeleteClick = () => {
        setOpenRoomModal(true);
    }

    useEffect(() => {
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, cinemaResponse]);

    return (
        <Box className="py-2 min-h-screen">
            <CinemaModal open={openModal}
                        onClose={() => setOpenModal(false)}
                        mode={modalMode}
                        cinemaData={selectedCinema}
                        rooms={rooms}
            />

            <RoomModal
                open={openRoomModal}
                onClose={() => setOpenRoomModal(false)}
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
