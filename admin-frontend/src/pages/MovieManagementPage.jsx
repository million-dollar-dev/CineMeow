import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
    Box,
    Button,
    Grid
} from "@mui/material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useEffect, useState} from "react";
import MovieModal from "../components/moviesManagement/MovieModal.jsx";
import {useGetAllMoviesQuery} from "../services/movieService.js";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import StatCard from "../components/OverviewStats/StatCard.jsx";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CustomToolbar from "../components/CustomToolbar.jsx";
import TableSkeleton from "../components/moviesManagement/TableSkeleton.jsx";
import MovieStatusChip from "../components/moviesManagement/MovieStatusChip.jsx";

export default function MovieManagementPage() {
    const dispatch = useDispatch();
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [openModal, setOpenModal] = React.useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Query
    const { data, isError, error, isLoading } = useGetAllMoviesQuery();

    const columns = [
        {
            field: "poster",
            headerName: "Poster",
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
                        alt="poster"
                        style={{
                            width: 100,
                            height: 140,
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                </Box>
            ),
        },
        { field: "title", headerName: "Title", flex: 1, minWidth: 200 },
        { field: "genre", headerName: "Genre", width: 200 },
        { field: "releaseDate", headerName: "Release Date", width: 100 },
        { field: "duration", headerName: "Duration (min)", width: 120 },
        {
            field: "status",
            headerName: "Status",
            width: 160,
            renderCell: (params) => <MovieStatusChip status={params.value} />,
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
                        onClick={() => handleEditClick(params.row.fullData)} // truyền nguyên row đầy đủ
                    >
                        Tùy chỉnh
                    </Button>
                    <span style={{ color: "black" }}>|</span>
                    <Button
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        variant="text"
                        sx={{ color: "red" }}
                        // onClick={() => handleDeleteClick(params.row)}
                    >
                        Xóa
                    </Button>
                </Box>
            ),
        },
    ];

    // Map data
    const movies = data?.data?.content?.map((movie) => ({
        id: movie.id,
        poster: movie.posterPath,
        title: movie.title,
        genre: movie.genres?.map((g) => g.name).join(", ") || "",
        releaseDate: movie.releaseDate,
        duration: movie.duration,
        status: movie.status,
        fullData: movie,
    })) ?? [];

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedMovie(null);
        setOpenModal(true);
    };

    const handleEditClick = (movie) => {
        setModalMode("edit");
        setSelectedMovie(movie);
        setOpenModal(true);
    };

    useEffect(() => {
        console.log(data)
        if (isError) {
            dispatch(openSnackbar({message: error?.error, type: "error"}));
        }
    }, [isError, error, isLoading, data]);

    return (
        <Box className="py-2 min-h-screen">
            <MovieModal open={openModal}
                        onClose={() => setOpenModal(false)}
                        mode={modalMode}
                        movieData={selectedMovie}
            />

            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Phim</h2>
            </div>

            <Box sx={{ py: 3 }}>
                <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Movies"
                            value="120"
                            icon={<PeopleAltOutlinedIcon fontSize="medium"/>}
                            bigIcon={<PeopleAltOutlinedIcon fontSize="inherit"/>}
                            color="#1976d2"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Movies"
                            value="120"
                            icon={<PeopleAltOutlinedIcon fontSize="medium"/>}
                            bigIcon={<PeopleAltOutlinedIcon fontSize="inherit"/>}
                            color="#1976d2"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Movies"
                            value="120"
                            icon={<PeopleAltOutlinedIcon fontSize="medium"/>}
                            bigIcon={<PeopleAltOutlinedIcon fontSize="inherit"/>}
                            color="#1976d2"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            title="Movies"
                            value="120"
                            icon={<PeopleAltOutlinedIcon fontSize="medium"/>}
                            bigIcon={<PeopleAltOutlinedIcon fontSize="inherit"/>}
                            color="#1976d2"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ height: 630, width: "100%" }}>
                {isLoading ? (
                    <TableSkeleton paginationModel={paginationModel} />
                ) : (
                    <DataGrid
                        sx={{borderRadius: 4}}
                        rows={movies}
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
