import React, { useState, useMemo, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

// Redux
import { openSnackbar } from "../redux/slices/snackbarSlice.js";

// Constants & Mock
import {
    ACCOUNT_STORAGE_KEY,
    CUSTOMER_STORAGE_KEY,
    ADMIN_ROLES,
    ACCOUNT_STATUS_CONFIG,
    CINEMA_BRANCH_OPTIONS,
    MEMBERSHIP_TIERS,
} from "../constants/accountConstants.js";
import { MOCK_ADMIN_ACCOUNTS, MOCK_CUSTOMER_ACCOUNTS } from "../mock/mockAccounts.js";

// Components
import StatCard from "../components/OverviewStats/StatCard.jsx";
import StatusChip from "../components/StatusChip.jsx";
import AdminAccountModal from "../components/AccountManagement/AdminAccountModal.jsx";
import ResetPasswordModal from "../components/AccountManagement/ResetPasswordModal.jsx";
import AccountDetailModal from "../components/AccountManagement/AccountDetailModal.jsx";
import CustomerDetailModal from "../components/AccountManagement/CustomerDetailModal.jsx";

// Icons
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

export default function AccountManagementPage() {
    const dispatch = useDispatch();

    // 0. Primary Account Type Switcher ("ADMIN" vs "CUSTOMER")
    const [accountTypeTab, setAccountTypeTab] = useState("ADMIN");

    // 1. Admin Accounts State with LocalStorage Persistence
    const [accounts, setAccounts] = useState(() => {
        try {
            const saved = localStorage.getItem(ACCOUNT_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("Failed to load accounts from storage:", e);
        }
        return MOCK_ADMIN_ACCOUNTS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
        } catch (e) {
            console.error("Failed to persist accounts:", e);
        }
    }, [accounts]);

    // 2. Customer Accounts State with LocalStorage Persistence
    const [customers, setCustomers] = useState(() => {
        try {
            const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("Failed to load customers from storage:", e);
        }
        return MOCK_CUSTOMER_ACCOUNTS;
    });

    useEffect(() => {
        try {
            localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
        } catch (e) {
            console.error("Failed to persist customers:", e);
        }
    }, [customers]);

    // 3. Admin Modals state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [resetPwModalOpen, setResetPwModalOpen] = useState(false);

    // Admin Delete Confirmation Dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    // 4. Customer Modals state
    const [customerDetailOpen, setCustomerDetailOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDeleteDialogOpen, setCustomerDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    // 5. Admin Search & Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusTab, setStatusTab] = useState("ALL"); // "ALL" | "ACTIVE" | "INACTIVE" | "SUPER_ADMIN" | "CINEMA_MANAGER"
    const [sortBy, setSortBy] = useState("DEFAULT");

    // 6. Customer Search & Filter states
    const [custSearchQuery, setCustSearchQuery] = useState("");
    const [custTierFilter, setCustTierFilter] = useState("ALL");
    const [custStatusTab, setCustStatusTab] = useState("ALL"); // "ALL" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
    const [custSortBy, setCustSortBy] = useState("DEFAULT");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Pagination states
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [custPaginationModel, setCustPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    // 7. Admin Statistics Calculation
    const totalAccounts = accounts.length;
    const activeCount = useMemo(() => accounts.filter((a) => a.status === "ACTIVE").length, [accounts]);
    const branchManagerCount = useMemo(() => accounts.filter((a) => a.role === "CINEMA_MANAGER").length, [accounts]);

    const adminStats = useMemo(
        () => [
            {
                title: "Tổng quản trị viên",
                value: `${totalAccounts} Tài khoản`,
                subtitle: "Nhân sự vận hành hệ thống",
                icon: <SupervisorAccountOutlinedIcon fontSize="medium" />,
                bigIcon: <SupervisorAccountOutlinedIcon fontSize="inherit" />,
                bgColor: "#7C3AED", // Violet
            },
            {
                title: "Đang hoạt động",
                value: `${activeCount} Đang mở`,
                subtitle: "Sẵn sàng truy cập ca trực",
                icon: <CheckCircleOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#10B981", // Emerald
            },
            {
                title: "Quản lý cụm rạp",
                value: `${branchManagerCount} Chi nhánh`,
                subtitle: "Giám đốc điều phối cụm rạp",
                icon: <StorefrontOutlinedIcon fontSize="medium" />,
                bigIcon: <StorefrontOutlinedIcon fontSize="inherit" />,
                bgColor: "#0284C7", // Sky
            },
            {
                title: "Phân quyền vai trò",
                value: "5 Nhóm quyền",
                subtitle: "Super Admin, Manager, Staff...",
                icon: <AdminPanelSettingsOutlinedIcon fontSize="medium" />,
                bigIcon: <AdminPanelSettingsOutlinedIcon fontSize="inherit" />,
                bgColor: "#F59E0B", // Amber
            },
        ],
        [totalAccounts, activeCount, branchManagerCount]
    );

    // 8. Customer Statistics Calculation
    const totalCustomers = customers.length;
    const activeCustomersCount = useMemo(() => customers.filter((c) => c.status === "ACTIVE").length, [customers]);
    const vipCustomersCount = useMemo(
        () => customers.filter((c) => c.membershipTier === "GOLD" || c.membershipTier === "PLATINUM").length,
        [customers]
    );
    const totalCinePoints = useMemo(
        () => customers.reduce((acc, c) => acc + (Number(c.points) || 0), 0),
        [customers]
    );

    const customerStats = useMemo(
        () => [
            {
                title: "Tổng khách hàng",
                value: `${totalCustomers} Thành viên`,
                subtitle: "Người dùng đăng ký xem phim",
                icon: <PeopleAltOutlinedIcon fontSize="medium" />,
                bigIcon: <PeopleAltOutlinedIcon fontSize="inherit" />,
                bgColor: "#7C3AED", // Violet
            },
            {
                title: "Đang hoạt động",
                value: `${activeCustomersCount} Tài khoản`,
                subtitle: "Tài khoản mở đặt vé",
                icon: <CheckCircleOutlineOutlinedIcon fontSize="medium" />,
                bigIcon: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
                bgColor: "#10B981", // Emerald
            },
            {
                title: "Hội viên Gold & VIP",
                value: `${vipCustomersCount} Hội viên`,
                subtitle: "Khách hàng hạng cao cấp",
                icon: <WorkspacePremiumOutlinedIcon fontSize="medium" />,
                bigIcon: <WorkspacePremiumOutlinedIcon fontSize="inherit" />,
                bgColor: "#F59E0B", // Amber
            },
            {
                title: "Tổng điểm CinePoints",
                value: `${totalCinePoints.toLocaleString("vi-VN")} pts`,
                subtitle: "Điểm thưởng tích lũy toàn hệ thống",
                icon: <StarsOutlinedIcon fontSize="medium" />,
                bigIcon: <StarsOutlinedIcon fontSize="inherit" />,
                bgColor: "#0284C7", // Sky
            },
        ],
        [totalCustomers, activeCustomersCount, vipCustomersCount, totalCinePoints]
    );

    // 9. Admin Filter & Sort Logic
    const filteredAccounts = useMemo(() => {
        let list = accounts.filter((item) => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchName = item.fullName?.toLowerCase().includes(q);
                const matchUsername = item.username?.toLowerCase().includes(q);
                const matchEmail = item.email?.toLowerCase().includes(q);
                const matchPhone = item.phoneNumber?.toLowerCase().includes(q);
                if (!matchName && !matchUsername && !matchEmail && !matchPhone) return false;
            }

            if (statusTab === "ACTIVE" && item.status !== "ACTIVE") return false;
            if (statusTab === "INACTIVE" && item.status !== "INACTIVE") return false;
            if (statusTab === "SUPER_ADMIN" && item.role !== "SUPER_ADMIN") return false;
            if (statusTab === "CINEMA_MANAGER" && item.role !== "CINEMA_MANAGER") return false;

            if (roleFilter !== "ALL" && item.role !== roleFilter) return false;

            return true;
        });

        if (sortBy === "NAME_ASC") {
            list = [...list].sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
        } else if (sortBy === "NAME_DESC") {
            list = [...list].sort((a, b) => (b.fullName || "").localeCompare(a.fullName || ""));
        } else if (sortBy === "LOGIN_RECENT") {
            list = [...list].sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
        } else if (sortBy === "CREATED_NEWEST") {
            list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return list;
    }, [accounts, searchQuery, statusTab, roleFilter, sortBy]);

    // 10. Customer Filter & Sort Logic
    const filteredCustomers = useMemo(() => {
        let list = customers.filter((item) => {
            if (custSearchQuery.trim()) {
                const q = custSearchQuery.toLowerCase().trim();
                const matchName = item.fullName?.toLowerCase().includes(q);
                const matchUsername = item.username?.toLowerCase().includes(q);
                const matchEmail = item.email?.toLowerCase().includes(q);
                const matchPhone = item.phoneNumber?.toLowerCase().includes(q);
                if (!matchName && !matchUsername && !matchEmail && !matchPhone) return false;
            }

            if (custStatusTab === "ACTIVE" && item.status !== "ACTIVE") return false;
            if (custStatusTab === "INACTIVE" && item.status !== "INACTIVE") return false;
            if (custStatusTab === "SUSPENDED" && item.status !== "SUSPENDED") return false;

            if (custTierFilter !== "ALL" && item.membershipTier !== custTierFilter) return false;

            return true;
        });

        if (custSortBy === "NAME_ASC") {
            list = [...list].sort((a, b) => (a.fullName || "").localeCompare(b.fullName || ""));
        } else if (custSortBy === "NAME_DESC") {
            list = [...list].sort((a, b) => (b.fullName || "").localeCompare(a.fullName || ""));
        } else if (custSortBy === "POINTS_DESC") {
            list = [...list].sort((a, b) => (Number(b.points) || 0) - (Number(a.points) || 0));
        } else if (custSortBy === "SPENT_DESC") {
            list = [...list].sort((a, b) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0));
        } else if (custSortBy === "LOGIN_RECENT") {
            list = [...list].sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
        }

        return list;
    }, [customers, custSearchQuery, custStatusTab, custTierFilter, custSortBy]);

    const isAdminFiltered = searchQuery.trim() !== "" || statusTab !== "ALL" || roleFilter !== "ALL" || sortBy !== "DEFAULT";
    const isCustFiltered = custSearchQuery.trim() !== "" || custStatusTab !== "ALL" || custTierFilter !== "ALL" || custSortBy !== "DEFAULT";

    const handleResetAdminFilters = () => {
        setSearchQuery("");
        setStatusTab("ALL");
        setRoleFilter("ALL");
        setSortBy("DEFAULT");
    };

    const handleResetCustFilters = () => {
        setCustSearchQuery("");
        setCustStatusTab("ALL");
        setCustTierFilter("ALL");
        setCustSortBy("DEFAULT");
    };

    // 11. Admin CRUD Handlers
    const handleRefresh = () => {
        setIsRefreshing(true);
        setAccounts(MOCK_ADMIN_ACCOUNTS);
        setCustomers(MOCK_CUSTOMER_ACCOUNTS);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(MOCK_ADMIN_ACCOUNTS));
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(MOCK_CUSTOMER_ACCOUNTS));
        dispatch(
            openSnackbar({
                message: "Đã làm mới và đồng bộ danh sách tài khoản thành công!",
                type: "success",
            })
        );
        setTimeout(() => setIsRefreshing(false), 600);
    };

    const handleAddAccount = () => {
        setModalMode("add");
        setSelectedAccount(null);
        setModalOpen(true);
    };

    const handleEditAccount = (acc) => {
        setModalMode("edit");
        setSelectedAccount(acc);
        setModalOpen(true);
    };

    const handleViewDetail = (acc) => {
        setSelectedAccount(acc);
        setDetailModalOpen(true);
    };

    const handleOpenResetPassword = (acc) => {
        setSelectedAccount(acc);
        setResetPwModalOpen(true);
    };

    const handleToggleStatus = (acc) => {
        const nextStatus = acc.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setAccounts((prev) =>
            prev.map((item) => (item.id === acc.id ? { ...item, status: nextStatus } : item))
        );
        dispatch(
            openSnackbar({
                message: `Đã ${nextStatus === "ACTIVE" ? "kích hoạt" : "tạm khóa"} tài khoản quản trị @${acc.username}`,
                type: nextStatus === "ACTIVE" ? "success" : "warning",
            })
        );
    };

    const handleSaveAccount = (savedData) => {
        if (modalMode === "add") {
            setAccounts((prev) => [savedData, ...prev]);
            dispatch(
                openSnackbar({
                    message: `Tạo tài khoản quản trị @${savedData.username} thành công!`,
                    type: "success",
                })
            );
        } else {
            setAccounts((prev) =>
                prev.map((item) => (item.id === savedData.id ? savedData : item))
            );
            dispatch(
                openSnackbar({
                    message: `Cập nhật thông tin quản trị viên @${savedData.username} thành công!`,
                    type: "success",
                })
            );
        }
    };

    const handleConfirmResetPassword = (acc, newPassword) => {
        dispatch(
            openSnackbar({
                message: `Đã cấp lại mật khẩu cho @${acc.username}! Mật khẩu mới: ${newPassword}`,
                type: "success",
            })
        );
    };

    const handleDeleteAccount = (acc) => {
        setAccountToDelete(acc);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!accountToDelete) return;
        setAccounts((prev) => prev.filter((a) => a.id !== accountToDelete.id));
        dispatch(
            openSnackbar({
                message: `Đã xóa tài khoản @${accountToDelete.username} khỏi hệ thống!`,
                type: "success",
            })
        );
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
    };

    // 12. Customer Action Handlers
    const handleViewCustomerDetail = (cust) => {
        setSelectedCustomer(cust);
        setCustomerDetailOpen(true);
    };

    const handleToggleCustomerStatus = (cust) => {
        const nextStatus = cust.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        setCustomers((prev) =>
            prev.map((item) => (item.id === cust.id ? { ...item, status: nextStatus } : item))
        );
        dispatch(
            openSnackbar({
                message: `Đã ${nextStatus === "ACTIVE" ? "mở khóa" : "đình chỉ/khóa"} tài khoản khách hàng @${cust.username}`,
                type: nextStatus === "ACTIVE" ? "success" : "warning",
            })
        );
    };

    const handleDeleteCustomer = (cust) => {
        setCustomerToDelete(cust);
        setCustomerDeleteDialogOpen(true);
    };

    const handleConfirmDeleteCustomer = () => {
        if (!customerToDelete) return;
        setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
        dispatch(
            openSnackbar({
                message: `Đã xóa tài khoản khách hàng @${customerToDelete.username}!`,
                type: "success",
            })
        );
        setCustomerDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    // 13. DataGrid Columns Definition: ADMIN ACCOUNTS
    const adminColumns = useMemo(
        () => [
            // User Avatar & Name (Fixed vertical overflow & clean line heights)
            {
                field: "fullName",
                headerName: "Quản Trị Viên",
                minWidth: 260,
                flex: 1.4,
                renderCell: (params) => {
                    const acc = params.row;
                    const statusConfig = ACCOUNT_STATUS_CONFIG[acc.status] || ACCOUNT_STATUS_CONFIG.ACTIVE;
                    const initials = acc.fullName
                        ? acc.fullName
                              .split(" ")
                              .filter(Boolean)
                              .slice(-2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                        : "AD";

                    return (
                        <div className="flex items-center gap-3 w-full h-full min-w-0">
                            {/* Avatar with Status Dot */}
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 self-center">
                                {initials}
                                <span
                                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                                    style={{ backgroundColor: statusConfig.dotColor }}
                                />
                            </div>

                            {/* Name & Username - No Vertical Overflow */}
                            <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                        {acc.fullName}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded shrink-0">
                                        {acc.id}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium truncate mt-1 leading-tight">
                                    @{acc.username} • {acc.email}
                                </div>
                            </div>
                        </div>
                    );
                },
            },

            // Role Badge (Fixed stretching bug - fits height properly)
            {
                field: "role",
                headerName: "Vai Trò Quản Trị",
                minWidth: 200,
                flex: 1.1,
                renderCell: (params) => {
                    const roleInfo = ADMIN_ROLES[params.value] || ADMIN_ROLES.CINEMA_MANAGER;
                    return (
                        <div className="flex items-center justify-start w-full h-full">
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border shadow-2xs self-center shrink-0"
                                style={{
                                    backgroundColor: roleInfo.bgColor,
                                    color: roleInfo.color,
                                    borderColor: roleInfo.borderColor,
                                    height: "fit-content",
                                    maxHeight: "28px",
                                    lineHeight: "1.2",
                                    boxSizing: "border-box",
                                }}
                            >
                                <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>{roleInfo.shortLabel}</span>
                            </span>
                        </div>
                    );
                },
            },

            // Assigned Cinema
            {
                field: "assignedCinema",
                headerName: "Cụm Rạp Phụ Trách",
                minWidth: 220,
                flex: 1.2,
                renderCell: (params) => (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 h-full">
                        <StorefrontOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400 shrink-0" />
                        <span className="truncate">{params.value || "Toàn quốc"}</span>
                    </div>
                ),
            },

            // Status Chip
            {
                field: "status",
                headerName: "Trạng Thái",
                minWidth: 150,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <div className="flex items-center justify-center h-full">
                        <StatusChip status={params.value} configs={ACCOUNT_STATUS_CONFIG} />
                    </div>
                ),
            },

            // Last Login
            {
                field: "lastLogin",
                headerName: "Lần Đăng Nhập Cuối",
                minWidth: 170,
                renderCell: (params) => (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium h-full">
                        <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400 shrink-0" />
                        <span>{dayjs(params.value).format("HH:mm - DD/MM/YYYY")}</span>
                    </div>
                ),
            },

            // Actions Column
            {
                field: "actions",
                headerName: "Thao Tác",
                minWidth: 180,
                sortable: false,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => {
                    const acc = params.row;
                    const isActive = acc.status === "ACTIVE";

                    return (
                        <div className="flex items-center justify-end gap-1 h-full">
                            {/* View Detail */}
                            <Tooltip title="Xem hồ sơ chi tiết" arrow>
                                <button
                                    onClick={() => handleViewDetail(acc)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                    <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                                </button>
                            </Tooltip>

                            {/* Edit Account */}
                            <Tooltip title="Chỉnh sửa thông tin" arrow>
                                <button
                                    onClick={() => handleEditAccount(acc)}
                                    className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition cursor-pointer"
                                >
                                    <EditOutlinedIcon sx={{ fontSize: 17 }} />
                                </button>
                            </Tooltip>

                            {/* Reset Password */}
                            <Tooltip title="Cấp lại mật khẩu an toàn" arrow>
                                <button
                                    onClick={() => handleOpenResetPassword(acc)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                >
                                    <LockResetOutlinedIcon sx={{ fontSize: 17 }} />
                                </button>
                            </Tooltip>

                            {/* Toggle Status (Active / Inactive) */}
                            <Tooltip title={isActive ? "Tạm ngưng tài khoản" : "Kích hoạt tài khoản"} arrow>
                                <button
                                    onClick={() => handleToggleStatus(acc)}
                                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                                        isActive
                                            ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                >
                                    {isActive ? (
                                        <BlockOutlinedIcon sx={{ fontSize: 17 }} />
                                    ) : (
                                        <CheckOutlinedIcon sx={{ fontSize: 17 }} />
                                    )}
                                </button>
                            </Tooltip>

                            {/* Delete (Disabled for Super Admin) */}
                            <Tooltip
                                title={
                                    acc.role === "SUPER_ADMIN"
                                        ? "Không thể xóa Super Admin"
                                        : "Xóa tài khoản"
                                }
                                arrow
                            >
                                <span>
                                    <button
                                        disabled={acc.role === "SUPER_ADMIN"}
                                        onClick={() => handleDeleteAccount(acc)}
                                        className={`p-1.5 rounded-lg transition ${
                                            acc.role === "SUPER_ADMIN"
                                                ? "text-slate-200 cursor-not-allowed"
                                                : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                        }`}
                                    >
                                        <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                                    </button>
                                </span>
                            </Tooltip>
                        </div>
                    );
                },
            },
        ],
        []
    );

    // 14. DataGrid Columns Definition: CUSTOMER ACCOUNTS
    const customerColumns = useMemo(
        () => [
            // Customer Avatar & Name
            {
                field: "fullName",
                headerName: "Khách Hàng Thành Viên",
                minWidth: 250,
                flex: 1.4,
                renderCell: (params) => {
                    const cust = params.row;
                    const statusConfig = ACCOUNT_STATUS_CONFIG[cust.status] || ACCOUNT_STATUS_CONFIG.ACTIVE;
                    const initials = cust.fullName
                        ? cust.fullName
                              .split(" ")
                              .filter(Boolean)
                              .slice(-2)
                              .map((w) => w[0])
                              .join("")
                              .toUpperCase()
                        : "KH";

                    return (
                        <div className="flex items-center gap-3 w-full h-full min-w-0">
                            {/* Avatar with Status Dot */}
                            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 self-center">
                                {initials}
                                <span
                                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                                    style={{ backgroundColor: statusConfig.dotColor }}
                                />
                            </div>

                            {/* Name & Contact */}
                            <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className="text-xs font-bold text-slate-900 truncate">
                                        {cust.fullName}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                        {cust.id}
                                    </span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium truncate mt-1 leading-tight">
                                    {cust.phoneNumber} • {cust.email}
                                </div>
                            </div>
                        </div>
                    );
                },
            },

            // Membership Tier Badge
            {
                field: "membershipTier",
                headerName: "Hạng Thành Viên",
                minWidth: 150,
                flex: 0.9,
                renderCell: (params) => {
                    const tier = MEMBERSHIP_TIERS[params.value] || MEMBERSHIP_TIERS.STANDARD;
                    return (
                        <div className="flex items-center justify-start w-full h-full">
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-extrabold border shadow-2xs self-center shrink-0"
                                style={{
                                    backgroundColor: tier.bgColor,
                                    color: tier.color,
                                    borderColor: tier.borderColor,
                                    height: "fit-content",
                                    maxHeight: "28px",
                                    lineHeight: "1.2",
                                    boxSizing: "border-box",
                                }}
                            >
                                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>{tier.label}</span>
                            </span>
                        </div>
                    );
                },
            },

            // CinePoints
            {
                field: "points",
                headerName: "Điểm CinePoints",
                minWidth: 130,
                renderCell: (params) => (
                    <div className="flex items-center gap-1.5 text-xs font-black text-violet-700 h-full">
                        <StarsOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-500 shrink-0" />
                        <span>{Number(params.value || 0).toLocaleString("vi-VN")} pts</span>
                    </div>
                ),
            },

            // Total Spent
            {
                field: "totalSpent",
                headerName: "Tổng Chi Tiêu",
                minWidth: 140,
                renderCell: (params) => (
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 h-full">
                        <PaymentsOutlinedIcon sx={{ fontSize: 16 }} className="text-emerald-500 shrink-0" />
                        <span>{Number(params.value || 0).toLocaleString("vi-VN")} ₫</span>
                    </div>
                ),
            },

            // Total Bookings
            {
                field: "totalBookings",
                headerName: "Vé Đã Mua",
                minWidth: 110,
                renderCell: (params) => (
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-700 h-full">
                        <ConfirmationNumberOutlinedIcon sx={{ fontSize: 15 }} className="text-slate-400 shrink-0" />
                        <span>{params.value || 0} vé</span>
                    </div>
                ),
            },

            // Status Chip
            {
                field: "status",
                headerName: "Trạng Thái",
                minWidth: 130,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <div className="flex items-center justify-center h-full">
                        <StatusChip status={params.value} configs={ACCOUNT_STATUS_CONFIG} />
                    </div>
                ),
            },

            // Actions Column
            {
                field: "actions",
                headerName: "Thao Tác",
                minWidth: 130,
                sortable: false,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => {
                    const cust = params.row;
                    const isActive = cust.status === "ACTIVE";

                    return (
                        <div className="flex items-center justify-end gap-1 h-full">
                            {/* View Customer Detail */}
                            <Tooltip title="Xem chi tiết khách hàng" arrow>
                                <button
                                    onClick={() => handleViewCustomerDetail(cust)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                                >
                                    <VisibilityOutlinedIcon sx={{ fontSize: 17 }} />
                                </button>
                            </Tooltip>

                            {/* Toggle Customer Status (Active / Suspended) */}
                            <Tooltip title={isActive ? "Đình chỉ / Khóa tài khoản" : "Mở khóa tài khoản"} arrow>
                                <button
                                    onClick={() => handleToggleCustomerStatus(cust)}
                                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                                        isActive
                                            ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                    }`}
                                >
                                    {isActive ? (
                                        <BlockOutlinedIcon sx={{ fontSize: 17 }} />
                                    ) : (
                                        <CheckOutlinedIcon sx={{ fontSize: 17 }} />
                                    )}
                                </button>
                            </Tooltip>

                            {/* Delete Customer */}
                            <Tooltip title="Xóa tài khoản khách hàng" arrow>
                                <button
                                    onClick={() => handleDeleteCustomer(cust)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                >
                                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                                </button>
                            </Tooltip>
                        </div>
                    );
                },
            },
        ],
        []
    );

    return (
        <div className="py-6 space-y-6">
            {/* 1. PAGE HEADER (STANDARD PAGE HEADER BANNER) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ManageAccountsOutlinedIcon className="text-violet-600" />
                        <span>Quản Lý Tài Khoản Toàn Hệ Thống</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Quản lý tập trung cả nhân sự quản trị hệ thống và khách hàng đăng ký thành viên CineMeow
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        startIcon={<RefreshOutlinedIcon className={isRefreshing ? "animate-spin" : ""} />}
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

                    {accountTypeTab === "ADMIN" && (
                        <Button
                            variant="contained"
                            onClick={handleAddAccount}
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
                            Thêm quản trị viên
                        </Button>
                    )}
                </div>
            </div>

            {/* 2. PRIMARY TAB SEGMENT SWITCHER: ADMIN vs CUSTOMER */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setAccountTypeTab("ADMIN")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            accountTypeTab === "ADMIN"
                                ? "bg-white text-violet-700 shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        }`}
                    >
                        <SupervisorAccountOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>Tài Khoản Quản Trị & Nhân Sự</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            accountTypeTab === "ADMIN" ? "bg-violet-100 text-violet-800" : "bg-slate-200 text-slate-700"
                        }`}>
                            {accounts.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setAccountTypeTab("CUSTOMER")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                            accountTypeTab === "CUSTOMER"
                                ? "bg-white text-indigo-700 shadow-sm"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                        }`}
                    >
                        <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>Khách Hàng Thành Viên</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            accountTypeTab === "CUSTOMER" ? "bg-indigo-100 text-indigo-800" : "bg-slate-200 text-slate-700"
                        }`}>
                            {customers.length}
                        </span>
                    </button>
                </div>

                <div className="text-xs text-slate-400 font-medium hidden sm:block">
                    {accountTypeTab === "ADMIN"
                        ? "Đang xem: Nhân sự phân quyền vận hành hệ thống"
                        : "Đang xem: Người dùng đăng ký & tích điểm CinePoints"}
                </div>
            </div>

            {/* 3. OVERVIEW STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(accountTypeTab === "ADMIN" ? adminStats : customerStats).map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        bigIcon={stat.bigIcon}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            {/* 4. FILTER TOOLBAR: 2-ROW DESIGN */}
            {accountTypeTab === "ADMIN" ? (
                /* ADMIN FILTERS */
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
                    {/* Row 1: Quick Status / Role Filter Tabs */}
                    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
                        <div className="flex items-center gap-1.5 shrink-0">
                            {[
                                { id: "ALL", label: "Tất cả", count: accounts.length },
                                { id: "ACTIVE", label: "Đang hoạt động", count: activeCount },
                                { id: "INACTIVE", label: "Tạm ngưng", count: accounts.length - activeCount },
                                { id: "SUPER_ADMIN", label: "Super Admin", count: accounts.filter((a) => a.role === "SUPER_ADMIN").length },
                                { id: "CINEMA_MANAGER", label: "Quản lý rạp", count: branchManagerCount },
                            ].map((tab) => {
                                const isSelected = statusTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setStatusTab(tab.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? "bg-violet-50 text-violet-700 border border-violet-200 shadow-2xs"
                                                : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                isSelected
                                                    ? "bg-violet-200/70 text-violet-800"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reset Filter Button */}
                        {isAdminFiltered && (
                            <button
                                onClick={handleResetAdminFilters}
                                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                            >
                                <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>

                    {/* Row 2: Search Input & Dropdowns */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                                <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm quản trị viên theo họ tên, username, email hoặc SĐT..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                                </button>
                            )}
                        </div>

                        {/* Role Select Dropdown */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="ALL">Tất cả vai trò quản trị</option>
                                {Object.values(ADMIN_ROLES).map((r) => (
                                    <option key={r.code} value={r.code}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative min-w-[170px]">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="DEFAULT">Sắp xếp: Mặc định</option>
                                <option value="NAME_ASC">Họ tên: A → Z</option>
                                <option value="NAME_DESC">Họ tên: Z → A</option>
                                <option value="LOGIN_RECENT">Đăng nhập gần nhất</option>
                                <option value="CREATED_NEWEST">Tạo mới nhất</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* CUSTOMER FILTERS */
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 space-y-3">
                    {/* Row 1: Quick Customer Status Tabs */}
                    <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
                        <div className="flex items-center gap-1.5 shrink-0">
                            {[
                                { id: "ALL", label: "Tất cả khách hàng", count: customers.length },
                                { id: "ACTIVE", label: "Đang hoạt động", count: activeCustomersCount },
                                { id: "INACTIVE", label: "Tạm ngưng", count: customers.filter((c) => c.status === "INACTIVE").length },
                                { id: "SUSPENDED", label: "Đã đình chỉ / Khóa", count: customers.filter((c) => c.status === "SUSPENDED").length },
                            ].map((tab) => {
                                const isSelected = custStatusTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setCustStatusTab(tab.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                                                : "text-slate-600 hover:bg-slate-50 border border-transparent"
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                                isSelected
                                                    ? "bg-indigo-200/70 text-indigo-800"
                                                    : "bg-slate-100 text-slate-500"
                                            }`}
                                        >
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Reset Filter Button */}
                        {isCustFiltered && (
                            <button
                                onClick={handleResetCustFilters}
                                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                            >
                                <RestartAltOutlinedIcon sx={{ fontSize: 16 }} />
                                <span>Đặt lại bộ lọc</span>
                            </button>
                        )}
                    </div>

                    {/* Row 2: Search Input & Dropdowns */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center pointer-events-none">
                                <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                            </span>
                            <input
                                type="text"
                                placeholder="Tìm khách hàng theo họ tên, SĐT, email hoặc username..."
                                value={custSearchQuery}
                                onChange={(e) => setCustSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-9 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition shadow-2xs"
                            />
                            {custSearchQuery && (
                                <button
                                    onClick={() => setCustSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                >
                                    <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                                </button>
                            )}
                        </div>

                        {/* Membership Tier Select Dropdown */}
                        <div className="relative min-w-[200px]">
                            <select
                                value={custTierFilter}
                                onChange={(e) => setCustTierFilter(e.target.value)}
                                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="ALL">Tất cả hạng thành viên</option>
                                {Object.values(MEMBERSHIP_TIERS).map((t) => (
                                    <option key={t.code} value={t.code}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative min-w-[180px]">
                            <select
                                value={custSortBy}
                                onChange={(e) => setCustSortBy(e.target.value)}
                                className="w-full pl-3.5 pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none"
                            >
                                <option value="DEFAULT">Sắp xếp: Mặc định</option>
                                <option value="POINTS_DESC">Điểm thưởng: Cao → Thấp</option>
                                <option value="SPENT_DESC">Chi tiêu: Cao → Thấp</option>
                                <option value="NAME_ASC">Họ tên: A → Z</option>
                                <option value="LOGIN_RECENT">Đăng nhập gần nhất</option>
                            </select>
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 5. DATAGRID TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
                {accountTypeTab === "ADMIN" ? (
                    <DataGrid
                        rows={filteredAccounts}
                        columns={adminColumns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        rowHeight={68}
                        autoHeight
                        sx={{
                            border: "none",
                            fontFamily: "inherit",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#F8FAFC",
                                borderBottom: "1px solid #E2E8F0",
                                fontSize: "11px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#475569",
                            },
                            "& .MuiDataGrid-row": {
                                borderBottom: "1px solid #F1F5F9",
                                "&:hover": {
                                    backgroundColor: "#F8FAFC",
                                },
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                outline: "none !important",
                                overflow: "hidden",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #E2E8F0",
                                fontSize: "12px",
                            },
                        }}
                    />
                ) : (
                    <DataGrid
                        rows={filteredCustomers}
                        columns={customerColumns}
                        paginationModel={custPaginationModel}
                        onPaginationModelChange={setCustPaginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        disableRowSelectionOnClick
                        rowHeight={68}
                        autoHeight
                        sx={{
                            border: "none",
                            fontFamily: "inherit",
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#F8FAFC",
                                borderBottom: "1px solid #E2E8F0",
                                fontSize: "11px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#475569",
                            },
                            "& .MuiDataGrid-row": {
                                borderBottom: "1px solid #F1F5F9",
                                "&:hover": {
                                    backgroundColor: "#F8FAFC",
                                },
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                outline: "none !important",
                                overflow: "hidden",
                            },
                            "& .MuiDataGrid-footerContainer": {
                                borderTop: "1px solid #E2E8F0",
                                fontSize: "12px",
                            },
                        }}
                    />
                )}
            </div>

            {/* 6. MODALS & DIALOGS */}
            {/* Create / Edit Admin Account Modal */}
            <AdminAccountModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                mode={modalMode}
                accountData={selectedAccount}
                onSave={handleSaveAccount}
            />

            {/* Reset Password Modal */}
            <ResetPasswordModal
                open={resetPwModalOpen}
                onClose={() => setResetPwModalOpen(false)}
                account={selectedAccount}
                onConfirmReset={handleConfirmResetPassword}
            />

            {/* Account Detail Modal (Admin) */}
            <AccountDetailModal
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                account={selectedAccount}
                onEdit={handleEditAccount}
                onResetPassword={handleOpenResetPassword}
            />

            {/* Customer Detail Modal */}
            <CustomerDetailModal
                open={customerDetailOpen}
                onClose={() => setCustomerDetailOpen(false)}
                customer={selectedCustomer}
                onToggleStatus={handleToggleCustomerStatus}
            />

            {/* Admin Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        maxWidth: "420px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: 2 }}>
                    <div className="flex items-center gap-2.5 text-rose-600">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">
                                Xác nhận xóa tài khoản
                            </h3>
                            <p className="text-[11px] font-normal text-slate-400">
                                Hành động này không thể hoàn tác
                            </p>
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ py: 1.5 }}>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn xóa tài khoản quản trị{" "}
                        <strong className="text-slate-900 font-bold">
                            @{accountToDelete?.username} ({accountToDelete?.fullName})
                        </strong>{" "}
                        khỏi hệ thống CineMeow không? Người này sẽ mất toàn bộ quyền truy cập.
                    </p>
                </DialogContent>

                <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        sx={{
                            color: "#64748B",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2,
                            "&:hover": { backgroundColor: "#F1F5F9" },
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmDelete}
                        sx={{
                            backgroundColor: "#E11D48",
                            "&:hover": { backgroundColor: "#BE123C" },
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2.5,
                            boxShadow: "0 4px 12px rgba(225, 29, 72, 0.25)",
                        }}
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Customer Delete Confirmation Dialog */}
            <Dialog
                open={customerDeleteDialogOpen}
                onClose={() => setCustomerDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        maxWidth: "420px",
                        width: "100%",
                    },
                }}
            >
                <DialogTitle sx={{ pb: 1, pt: 2 }}>
                    <div className="flex items-center gap-2.5 text-rose-600">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                            <WarningAmberOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 leading-snug">
                                Xác nhận xóa khách hàng
                            </h3>
                            <p className="text-[11px] font-normal text-slate-400">
                                Hành động này không thể hoàn tác
                            </p>
                        </div>
                    </div>
                </DialogTitle>

                <DialogContent sx={{ py: 1.5 }}>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn xóa tài khoản khách hàng{" "}
                        <strong className="text-slate-900 font-bold">
                            @{customerToDelete?.username} ({customerToDelete?.fullName})
                        </strong>{" "}
                        khỏi hệ thống không?
                    </p>
                </DialogContent>

                <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
                    <Button
                        onClick={() => setCustomerDeleteDialogOpen(false)}
                        sx={{
                            color: "#64748B",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2,
                            "&:hover": { backgroundColor: "#F1F5F9" },
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmDeleteCustomer}
                        sx={{
                            backgroundColor: "#E11D48",
                            "&:hover": { backgroundColor: "#BE123C" },
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "10px",
                            px: 2.5,
                            boxShadow: "0 4px 12px rgba(225, 29, 72, 0.25)",
                        }}
                    >
                        Xác nhận xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
