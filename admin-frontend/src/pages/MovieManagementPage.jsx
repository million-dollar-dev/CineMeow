import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    DataGrid,
    Toolbar,
    ToolbarButton,
    ColumnsPanelTrigger,
    FilterPanelTrigger,
    ExportCsv,
    ExportPrint,
    QuickFilter,
    QuickFilterControl,
    QuickFilterClear,
    QuickFilterTrigger,
} from "@mui/x-data-grid";
import {
    Box,
    Tooltip,
    Menu,
    Badge,
    MenuItem,
    Divider,
    TextField,
    InputAdornment,
    Button, Skeleton,
} from "@mui/material";
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useEffect, useState} from "react";
import MovieModal from "../components/moviesManagement/MovieModal.jsx";
import {useGetAllMoviesQuery} from "../services/movieService.js";

const StyledQuickFilter = styled(QuickFilter)({
    display: "grid",
    alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)(({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    width: "min-content",
    height: "min-content",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
}));

const StyledTextField = styled(TextField)(({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    overflowX: "clip",
    width: ownerState.expanded ? 260 : "var(--trigger-width)",
    opacity: ownerState.expanded ? 1 : 0,
    transition: theme.transitions.create(["width", "opacity"]),
}));

function CustomToolbar() {
    const [exportMenuOpen, setExportMenuOpen] = React.useState(false);
    const exportMenuTriggerRef = React.useRef(null);
    return (
        <Toolbar>
            <Tooltip title="Columns">
                <ColumnsPanelTrigger render={<ToolbarButton />}>
                    <ViewColumnOutlinedIcon fontSize="small" />
                </ColumnsPanelTrigger>
            </Tooltip>

            <Tooltip title="Filters">
                <FilterPanelTrigger
                    render={(props, state) => (
                        <ToolbarButton {...props} color="default">
                            <Badge
                                badgeContent={state.filterCount}
                                color="primary"
                                variant="dot"
                            >
                                <FilterListOutlinedIcon fontSize="small" />
                            </Badge>
                        </ToolbarButton>
                    )}
                />
            </Tooltip>

            <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title="Export">
                <ToolbarButton
                    ref={exportMenuTriggerRef}
                    id="export-menu-trigger"
                    aria-controls="export-menu"
                    aria-haspopup="true"
                    aria-expanded={exportMenuOpen ? "true" : undefined}
                    onClick={() => setExportMenuOpen(true)}
                >
                    <FileDownloadOutlinedIcon fontSize="small" />
                </ToolbarButton>
            </Tooltip>

            <Menu
                id="export-menu"
                anchorEl={exportMenuTriggerRef.current}
                open={exportMenuOpen}
                onClose={() => setExportMenuOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <ExportPrint render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                    Print
                </ExportPrint>
                <ExportCsv render={<MenuItem />} onClick={() => setExportMenuOpen(false)}>
                    Download as CSV
                </ExportCsv>
            </Menu>

            {/* Quick Search */}
            <StyledQuickFilter>
                <QuickFilterTrigger
                    render={(triggerProps, state) => (
                        <Tooltip title="Search" enterDelay={0}>
                            <StyledToolbarButton
                                {...triggerProps}
                                ownerState={{ expanded: state.expanded }}
                                color="default"
                                aria-disabled={state.expanded}
                            >
                                <SearchIcon fontSize="small" />
                            </StyledToolbarButton>
                        </Tooltip>
                    )}
                />
                <QuickFilterControl
                    render={({ ref, ...controlProps }, state) => (
                        <StyledTextField
                            {...controlProps}
                            ownerState={{ expanded: state.expanded }}
                            inputRef={ref}
                            aria-label="Search"
                            placeholder="Search..."
                            size="small"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: state.value ? (
                                        <InputAdornment position="end">
                                            <QuickFilterClear
                                                edge="end"
                                                size="small"
                                                aria-label="Clear search"
                                                material={{ sx: { marginRight: -0.75 } }}
                                            >
                                                <CancelIcon fontSize="small" />
                                            </QuickFilterClear>
                                        </InputAdornment>
                                    ) : null,
                                    ...controlProps.slotProps?.input,
                                },
                                ...controlProps.slotProps,
                            }}
                        />
                    )}
                />
            </StyledQuickFilter>
        </Toolbar>
    );
}

const movies = [
    {
        id: 1,
        title: "Spider-Man: Across the Spider-Verse",
        genre: "Animation",
        releaseDate: "2023-06-02",
        duration: 140,
        status: "Ended",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 2,
        title: "Oppenheimer",
        genre: "Drama",
        releaseDate: "2023-07-21",
        duration: 180,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 3,
        title: "Barbie",
        genre: "Comedy",
        releaseDate: "2023-07-21",
        duration: 120,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 4,
        title: "Oppenheimer",
        genre: "Drama",
        releaseDate: "2023-07-21",
        duration: 180,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 5,
        title: "Barbie",
        genre: "Comedy",
        releaseDate: "2023-07-21",
        duration: 120,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 6,
        title: "Oppenheimer",
        genre: "Drama",
        releaseDate: "2023-07-21",
        duration: 180,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
    {
        id: 7,
        title: "Barbie",
        genre: "Comedy",
        releaseDate: "2023-07-21",
        duration: 120,
        status: "Now Showing",
        poster: "https://upload.wikimedia.org/wikipedia/vi/4/46/Interstellar_poster.jpg",
    },
];

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
    { field: "title", headerName: "Title", flex: 1 },
    { field: "genre", headerName: "Genre", width: 150 },
    { field: "releaseDate", headerName: "Release Date", width: 150 },
    { field: "duration", headerName: "Duration (min)", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
    {
        field: "actions",
        headerName: "Actions",
        width: 200,
        renderCell: () => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button startIcon={<EditOutlinedIcon />} variant="text" sx={{ color: "black" }}>
                    Edit
                </Button>
                <span style={{ color: "black" }}>|</span>
                <Button startIcon={<DeleteOutlineOutlinedIcon />} variant="text" sx={{ color: "red" }}>
                    Delete
                </Button>
            </Box>
        ),
    },
];

export default function MovieManagementPage() {
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 5,
    });
    const [openAddModal, setOpenAddModal] = React.useState(false);

    // Query
    const { data, isError, error, isLoading } = useGetAllMoviesQuery();

    // Map dữ liệu từ API thành rows cho DataGrid
    const movies = data?.data?.content?.map((movie) => ({
        id: movie.id,
        poster: movie.posterPath,
        title: movie.title,
        genre: movie.genres?.map(g => g.name).join(", ") || "",
        releaseDate: movie.releaseDate,
        duration: movie.duration,
        status: movie.status,
    })) ?? [];

    useEffect(() => {
        console.log(data)
        if (isError) {
            console.error("API Error:", error);
        }
    }, [isError, error, isLoading, data]);

    return (
        <Box className="py-2 bg-transparent min-h-screen">
            <MovieModal open={openAddModal} onClose={() => setOpenAddModal(false)} />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-black">Quản Lý Phim</h2>
                <div className="flex gap-4 items-center">
                    <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
                        + Thêm mới
                    </Button>
                </div>
            </div>

            <Box sx={{ height: 620, width: "100%" }}>
                {isLoading ? (
                    // Skeleton khi loading
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {Array.from({ length: paginationModel.pageSize }).map((_, i) => (
                            <Box
                                key={i}
                                sx={{ display: "flex", alignItems: "center", gap: 2 }}
                            >
                                <Skeleton variant="rectangular" width={100} height={140} />
                                <Skeleton variant="text" width="40%" />
                                <Skeleton variant="text" width="20%" />
                                <Skeleton variant="text" width="20%" />
                                <Skeleton variant="text" width="10%" />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <DataGrid
                        rows={movies}
                        columns={columns}
                        disableRowSelectionOnClick
                        rowHeight={160}
                        slots={{ toolbar: CustomToolbar }}
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
