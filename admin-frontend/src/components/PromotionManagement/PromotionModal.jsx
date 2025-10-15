import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    IconButton,
    Typography,
    Box,
    Divider,
    Switch,
    FormControlLabel, FormGroup, FormLabel, Checkbox,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Add, Delete } from "@mui/icons-material";
import { useEffect } from "react";

// ✅ Validation schema
const schema = yup.object({
    code: yup.string().required("Mã khuyến mãi không được để trống"),
    name: yup.string().required("Tên chương trình không được để trống"),
    description: yup.string().nullable(),
    type: yup.string().required("Chọn loại khuyến mãi"),
    value: yup
        .number()
        .typeError("Phải là số")
        .positive("Giá trị > 0")
        .required("Nhập giá trị khuyến mãi"),
    minOrderValue: yup
        .number()
        .typeError("Phải là số")
        .min(0, "Không được âm")
        .required("Nhập giá trị đơn hàng tối thiểu"),
    usageLimit: yup
        .number()
        .typeError("Phải là số")
        .min(0, "Không được âm")
        .nullable(),
    status: yup.string().required("Chọn trạng thái"),
    startDate: yup.date().required("Chọn ngày bắt đầu"),
    endDate: yup
        .date()
        .required("Chọn ngày kết thúc")
        .min(yup.ref("startDate"), "Ngày kết thúc phải sau ngày bắt đầu"),
    forGuest: yup.boolean(),
    applyFnb: yup.boolean(),
    applyTicket: yup.boolean(),
    conditions: yup.array().of(
        yup.object({
            type: yup.string().required("Chọn loại điều kiện"),
            operator: yup.string().required("Chọn toán tử"),
            value: yup.string().required("Nhập giá trị"),
        })
    ),
});

// 🧩 Enum mẫu
const PROMOTION_TYPES = [
    { value: "PERCENTAGE", label: "Giảm theo %" },
    { value: "AMOUNT", label: "Giảm theo số tiền" },
];

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Hoạt động" },
    { value: "INACTIVE", label: "Ngưng hoạt động" },
];

const CONDITION_TYPES = [
    { value: "SEAT_TYPE", label: "Loại ghế" },
    { value: "ROOM_TYPE", label: "Loại phòng" },
    { value: "BRAND", label: "Rạp chiếu" },
    { value: "DAY_OF_WEEK", label: "Thứ trong tuần" },
];

const OPERATORS = [
    { value: "EQUALS", label: "=" },
    { value: "IN", label: "IN" },
    { value: "GREATER_THAN", label: ">" },
    { value: "LESS_THAN", label: "<" },
];

export default function PromotionModal({ open, onClose, mode = "add", itemData }) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
            name: "",
            description: "",
            type: "PERCENTAGE",
            value: 0,
            minOrderValue: 0,
            usageLimit: 0,
            status: "INACTIVE",
            startDate: "",
            endDate: "",
            forGuest: false,
            applyFnb: false,
            applyTicket: false,
            conditions: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "conditions",
    });

    useEffect(() => {
        if (itemData) {
            reset({
                ...itemData,
                startDate: itemData.startDate?.slice(0, 16),
                endDate: itemData.endDate?.slice(0, 16),
            });
        }
    }, [itemData, reset]);

    const onSubmit = (data) => {
        console.log("✅ Dữ liệu gửi đi:", data);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            sx={{
                "& .MuiDialog-paper": {
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* 🧭 Header cố định */}
            <DialogTitle
                sx={{
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 2,
                    borderBottom: "1px solid #eee",
                }}
            >
                {mode === "add" ? "Thêm khuyến mãi mới" : "Chỉnh sửa khuyến mãi"}
            </DialogTitle>

            {/* 🧱 Content scroll */}
            <DialogContent
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 3,
                }}
            >
                {/* --- Thông tin khuyến mãi --- */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Thông tin khuyến mãi
                </Typography>

                <Box className="grid grid-cols-2 gap-4">
                    {/* Hàng 1 */}
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Mã khuyến mãi"
                                error={!!errors.code}
                                helperText={errors.code?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Tên chương trình"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Hàng 2 */}
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Loại giảm giá"
                                error={!!errors.type}
                                helperText={errors.type?.message}
                                fullWidth
                            >
                                {PROMOTION_TYPES.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    <Controller
                        name="value"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Giá trị giảm"
                                error={!!errors.value}
                                helperText={errors.value?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Hàng 3 */}
                    <Controller
                        name="minOrderValue"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Đơn hàng tối thiểu (VNĐ)"
                                error={!!errors.minOrderValue}
                                helperText={errors.minOrderValue?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="usageLimit"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label="Giới hạn lượt dùng"
                                error={!!errors.usageLimit}
                                helperText={errors.usageLimit?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Hàng 4 */}
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="datetime-local"
                                label="Ngày bắt đầu"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.startDate}
                                helperText={errors.startDate?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="datetime-local"
                                label="Ngày kết thúc"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.endDate}
                                helperText={errors.endDate?.message}
                                fullWidth
                            />
                        )}
                    />

                    {/* Hàng 5: Trạng thái + Nhóm checkbox */}
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Trạng thái"
                                    error={!!errors.status}
                                    helperText={errors.status?.message}
                                    fullWidth
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <FormLabel sx={{ fontWeight: 600, mb: 1 }}>Áp dụng cho:</FormLabel>
                        <FormGroup row sx={{ justifyContent: "space-evenly" }}>
                            <Controller
                                name="forGuest"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={field.value} />}
                                        label="Khách vãng lai"
                                    />
                                )}
                            />
                            <Controller
                                name="applyFnb"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={field.value} />}
                                        label="FnB"
                                    />
                                )}
                            />
                            <Controller
                                name="applyTicket"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox {...field} checked={field.value} />}
                                        label="Vé"
                                    />
                                )}
                            />
                        </FormGroup>
                    </Box>
                </Box>

                {/* Hàng 6: Mô tả */}
                <Box sx={{ mt: 3 }}>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Mô tả"
                                multiline
                                rows={3}
                                fullWidth
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        )}
                    />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* --- Điều kiện áp dụng --- */}
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Điều kiện áp dụng
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {fields.map((field, index) => (
                        <Box
                            key={field.id}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 2fr 40px",
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <Controller
                                name={`conditions.${index}.type`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Loại điều kiện"
                                        error={!!errors.conditions?.[index]?.type}
                                        helperText={errors.conditions?.[index]?.type?.message}
                                    >
                                        {CONDITION_TYPES.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name={`conditions.${index}.operator`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Toán tử"
                                        error={!!errors.conditions?.[index]?.operator}
                                        helperText={errors.conditions?.[index]?.operator?.message}
                                    >
                                        {OPERATORS.map((op) => (
                                            <MenuItem key={op.value} value={op.value}>
                                                {op.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name={`conditions.${index}.value`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Giá trị"
                                        error={!!errors.conditions?.[index]?.value}
                                        helperText={errors.conditions?.[index]?.value?.message}
                                    />
                                )}
                            />

                            <IconButton color="error" onClick={() => remove(index)}>
                                <Delete />
                            </IconButton>
                        </Box>
                    ))}

                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => append({ type: "", operator: "", value: "" })}
                    >
                        Thêm điều kiện
                    </Button>
                </Box>
            </DialogContent>

            {/* 🧭 Footer cố định */}
            <DialogActions
                sx={{
                    position: "sticky",
                    bottom: 0,
                    background: "#fff",
                    borderTop: "1px solid #eee",
                    py: 2,
                }}
            >
                <Button onClick={onClose} color="error" variant="outlined">
                    Đóng
                </Button>
                <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                    {mode === "add" ? "Lưu" : "Cập nhật"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
