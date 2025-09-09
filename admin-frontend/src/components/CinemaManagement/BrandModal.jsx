import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {useCreateBrandMutation, useUpdateBrandMutation} from "../../services/brandService.js";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";

const EMPTY_BRAND = {
    name: "CGV Cinemas",
    logoUrl: "https://homepage.momocdn.net/cinema/momo-upload-api-211123095138-637732578984425272.png",
    description: "CGV là chuỗi rạp chiếu phim lớn nhất Việt Nam, mang đến trải nghiệm điện ảnh hiện đại với nhiều phòng chiếu đặc biệt như IMAX, 4DX.",
    employeeCount: 2000,
    backgroundUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
};

const brandSchema = yup.object().shape({
    name: yup
        .string()
        .required("Tên thương hiệu là bắt buộc")
        .min(2, "Tên thương hiệu phải có ít nhất 2 ký tự")
        .max(100, "Tên thương hiệu không được vượt quá 100 ký tự"),

    description: yup
        .string()
        .required("Mô tả là bắt buộc")
        .max(500, "Mô tả không được vượt quá 500 ký tự"),

    logoUrl: yup
        .string()
        .url("Logo phải là một URL hợp lệ")
        .required("Logo là bắt buộc"),

    employeeCount: yup
        .number()
        .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? null : value
        )
        .nullable()
        .required("Số lượng nhân viên là bắt buộc")
        .min(1, "Số nhân viên phải lớn hơn 0")
        .integer("Số nhân viên phải là số nguyên"),

    backgroundUrl: yup
        .string()
        .url("Background phải là một URL hợp lệ")
        .required("Background là bắt buộc"),
});

export default function BrandModal({open, onClose, mode = "add", brandData}) {
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: {errors},
        register,
    } = useForm({
        resolver: yupResolver(brandSchema),
        defaultValues: EMPTY_BRAND,
    });

    const dispatch = useDispatch();
    const [
        createBrand,
        {isLoading: isCreating, isError: isCreateError, error: createError},
    ] = useCreateBrandMutation();

    const [
        updateBrand,
        {isLoading: isUpdating, isError: isUpdateError, error: updateError},
    ] = useUpdateBrandMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    useEffect(() => {
        if (brandData) {
            reset({
                ...brandData
            });
        } else {
            reset(EMPTY_BRAND);
        }
    }, [brandData, open, reset]);

    const onSubmit = async (data) => {
        const payload = {
            ...data
        };

        if (mode === "add") {
            await createBrand(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
        } else {
            await updateBrand({id: brandData.id, ...payload}).unwrap();
            dispatch(openSnackbar({message: "Cập nhật thành công!", type: "success"}));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle className="text-xl font-semibold text-gray-700">
                {mode === "add" ? "Thêm brand mới" : "Chỉnh sửa brand"}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="!p-4">
                    {/* Grid chính */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Cột trái */}
                        <div className="flex flex-col gap-4">
                            <TextField
                                label="Tên"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                fullWidth
                            />

                            <TextField
                                label="Total Empoloyees"
                                type="number"
                                {...register("employeeCount")}
                                error={!!errors.employeeCount}
                                helperText={errors.employeeCount?.message}
                                fullWidth
                            />

                            <Controller
                                name="description"
                                control={control}
                                render={({field}) => (
                                    <div className="flex flex-col">
                                        <label className="text-gray-700 font-medium mb-1">Mô tả</label>
                                        <TextareaAutosize
                                            {...field}
                                            minRows={6}
                                            placeholder="Nhập mô tả thương hiệu..."
                                            style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: errors.description ? "2px solid #f44336" : "1px solid #ccc",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                resize: "vertical",
                                                maxHeight: "150px",
                                            }}
                                        />
                                        {errors.description && (
                                            <FormHelperText error>{errors.description.message}</FormHelperText>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <Controller
                            name="logoUrl"
                            control={control}
                            render={({field}) => (
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        {...field}
                                        label="Logo Url"
                                        fullWidth
                                        error={!!errors.logoUrl}
                                        helperText={errors.logoUrl?.message}
                                    />
                                    {field.value && (
                                        <div className="p-5 rounded-lg overflow-hidden shadow-md flex justify-center items-center">
                                            <img
                                                src={field.value}
                                                alt="Logo Preview"
                                                className="max-w-40 max-h-40 object-contain border rounded-lg"
                                            />
                                        </div>

                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="backgroundUrl"
                            control={control}
                            render={({field}) => (
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        {...field}
                                        label="backgroundUrl"
                                        fullWidth
                                        error={!!errors.backgroundUrl}
                                        helperText={errors.backgroundUrl?.message}
                                    />
                                    {field.value && (
                                        <div className="rounded-lg overflow-hidden shadow-md">
                                            <img
                                                src={field.value}
                                                alt="Background Preview"
                                                className="w-full max-h-64 object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="error" variant="outlined">
                        Đóng
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isCreating || isUpdating}
                        startIcon={
                            (isCreating || isUpdating) && (
                                <CircularProgress size={20} color="inherit"/>
                            )
                        }
                    >
                        {mode === "add" ? "Lưu" : "Cập nhật"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
