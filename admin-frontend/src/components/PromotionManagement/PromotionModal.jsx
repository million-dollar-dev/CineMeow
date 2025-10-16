import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    Divider,
    MenuItem,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    IconButton, CircularProgress,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import {useCreatePromotionMutation} from "../../services/promotionService.js";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";

// Mock data enums
const PROMOTION_TYPES = [
    { label: "Giảm theo %", value: "PERCENTAGE" },
    { label: "Giảm theo số tiền", value: "FIXED_AMOUNT" },
];
const STATUS_OPTIONS = [
    { label: "Kích hoạt", value: "ACTIVE" },
    { label: "Chưa kích hoạt", value: "INACTIVE" },
];
const CONDITION_TYPES = [
    { label: "Loại ghế", value: "SEAT_TYPE" },
    { label: "Thương hiệu", value: "BRAND" },
    { label: "Ngày trong tuần", value: "DAY_OF_WEEK" },
];


const schema = yup.object().shape({
    code: yup.string().required("Mã khuyến mãi không được để trống"),
    name: yup.string().required("Tên chương trình không được để trống"),
    type: yup.string().required("Chọn loại giảm giá"),
    value: yup.number().positive().required("Giá trị giảm không hợp lệ"),
    startDate: yup.string().required("Chọn ngày bắt đầu"),
    endDate: yup.string().required("Chọn ngày kết thúc"),
});

export default function PromotionModal({ open, onClose, mode = "add", itemData }) {
    const {
        control,
        handleSubmit,
        reset,
        setError,
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

    const dispatch = useDispatch();
    const [
        createPromotion,
        {isLoading: isCreating, isError: isCreateError, error: createError}
    ] = useCreatePromotionMutation();

    useEffect(() => {
        if (itemData) {
            reset({
                ...itemData,
                startDate: itemData.startDate?.slice(0, 16),
                endDate: itemData.endDate?.slice(0, 16),
            });
        }
    }, [itemData, reset]);

    useFormServerErrors(isCreateError, createError, setError);

    const onSubmit = async (data) => {
        const payload = {
            ...data
        };

        console.log(payload)

        if (mode === "add") {
            await createPromotion(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            PaperProps={{
                component: "form",
                onSubmit: handleSubmit(onSubmit),
            }}
            sx={{
                "& .MuiDialog-paper": {
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Header cố định */}
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

            {/* Nội dung form */}
            <DialogContent sx={{ flex: 1, overflowY: "auto", p: 3 }}>
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

                    {/* Hàng 5: Trạng thái + Checkbox */}
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Trạng thái" fullWidth>
                                {STATUS_OPTIONS.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Box>
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
                                gridTemplateColumns: "2fr 2fr 40px",
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <Controller
                                name={`conditions.${index}.type`}
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Loại điều kiện">
                                        {CONDITION_TYPES.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                            <Controller
                                name={`conditions.${index}.value`}
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Giá trị" />
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
                        onClick={() => append({ type: "", value: "" })}
                    >
                        Thêm điều kiện
                    </Button>
                </Box>
            </DialogContent>

            {/* Footer cố định */}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isCreating}
                    startIcon={
                        (isCreating) && (
                            <CircularProgress size={20} color="inherit"/>
                        )
                    }
                >
                    {mode === "add" ? "Lưu" : "Cập nhật"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
