export const ROOM_TYPES = [
    { value: "_2D", label: "2D" },
    { value: "_3D", label: "3D" },
    { value: "_IMAX", label: "IMAX" },
    { value: "_4DX", label: "4DX" },
];

export const ROOM_STATUSES = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "MAINTENANCE", label: "Maintenance" },
];

export const getRoomTypeLabel = (value) =>
    ROOM_TYPES.find((item) => item.value === value)?.label || value;

export const getRoomStatusLabel = (value) =>
    ROOM_STATUSES.find((item) => item.value === value)?.label || value;