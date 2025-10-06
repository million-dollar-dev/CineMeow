import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText, MenuItem,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import useFormServerErrors from "../../hooks/useFormServerErrors.js";
import {openSnackbar} from "../../redux/slices/snackbarSlice.js";
import {useCreateFnBMutation, useUpdateFnBMutation} from "../../services/cinemaService.js";
import {useGetAllBrandsQuery} from "../../services/brandService.js";
import {FNB_AVAILABLE, FNB_CATEGORY} from "../../constants/fnbContants.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

const fnbSchema = yup.object().shape({
    brandId: yup
        .string()
        .required("Vui lòng chọn thương hiệu."),
    name: yup
        .string()
        .trim()
        .required("Tên sản phẩm không được để trống.")
        .max(100, "Tên sản phẩm không vượt quá 100 ký tự."),
    description: yup
        .string()
        .trim()
        .max(500, "Mô tả không vượt quá 500 ký tự.")
        .nullable(),
    imageUrl: yup
        .string()
        .url("URL không hợp lệ.")
        .required("Vui lòng nhập URL hình ảnh."),
    price: yup
        .number()
        .typeError("Giá phải là một số.")
        .positive("Giá phải lớn hơn 0.")
        .required("Vui lòng nhập giá sản phẩm."),
    category: yup
        .string()
        .required("Vui lòng chọn danh mục."),
    available: yup
        .boolean()
        .required("Vui lòng chọn trạng thái."),
});

const EMPTY_ITEM = {
    brandId: "",
    name: "",
    imageUrl: "",
    description: "",
    price: "",
    category: "",
    available: true,
};

export default function FnBModal({open, onClose, mode = "add", itemData}) {
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: {errors},
        register,
    } = useForm({
        resolver: yupResolver(fnbSchema),
        defaultValues: EMPTY_ITEM,
    });

    const dispatch = useDispatch();

    const {data: brandResponse, isError, error, isLoading} = useGetAllBrandsQuery();
    const brands = brandResponse?.data ?? [];

    const [
        createItem,
        {isLoading: isCreating, isError: isCreateError, error: createError},
    ] = useCreateFnBMutation();

    const [
        updateItem,
        {isLoading: isUpdating, isError: isUpdateError, error: updateError},
    ] = useUpdateFnBMutation();

    useFormServerErrors(isCreateError, createError, setError);
    useFormServerErrors(isUpdateError, updateError, setError);

    useEffect(() => {
        if (itemData) {
            reset({
                brandId: itemData.cinemaBrand?.id || "",
                name: itemData.name || "",
                imageUrl: itemData.imageUrl || "",
                description: itemData.description || "",
                price: itemData.price || "",
                category: itemData.category || "",
                available: itemData.available ?? true,
            });
        } else {
            reset(EMPTY_ITEM);
        }
    }, [itemData, open, brands, reset]);

    console.log(itemData)

    const onSubmit = async (data) => {
        const payload = {
            ...data
        };

        if (mode === "add") {
            await createItem(payload).unwrap();
            dispatch(openSnackbar({message: "Thêm thành công!", type: "success"}));
        } else {
            await updateItem({id: itemData.id, ...payload}).unwrap();
            dispatch(openSnackbar({message: "Cập nhật thành công!", type: "success"}));
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle className="text-xl font-semibold text-gray-700">
                {mode === "add" ? "Thêm sản phẩm mới" : "Chỉnh sửa sẩn phẩm"}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent className="!p-4">
                    {/* Grid chính */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Cột trái */}
                        <div className="flex flex-col gap-4">
                            <Controller
                                name="brandId"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Thương hiệu"
                                        fullWidth
                                        error={!!errors.brandId}
                                        helperText={errors.brandId?.message}
                                        SelectProps={{
                                            renderValue: (selected) => {
                                                console.log('selected', selected)
                                                const brand = brands.find((b) => b.id === selected);
                                                if (!brand) return "";
                                                return (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <img
                                                            src={brand.logoUrl}
                                                            alt={brand.name}
                                                            style={{ width: 30, height: 30, borderRadius: "50%" }}
                                                        />
                                                        <span>{brand.name}</span>
                                                    </Box>
                                                );
                                            },
                                        }}
                                    >
                                        {brands.map((brand) => (
                                            <MenuItem key={brand.id} value={brand.id}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <img
                                                        src={brand.logoUrl}
                                                        alt={brand.name}
                                                        style={{ width: 30, height: 30, borderRadius: "50%" }}
                                                    />
                                                    <span>{brand.name}</span>
                                                </Box>
                                            </MenuItem>
                                        ))}

                                        {
                                            brands.length === 0 && (
                                                <MenuItem>
                                                    <p>Không có dữ liệu</p>
                                                </MenuItem>
                                            )
                                        }
                                    </TextField>
                                )}
                            />

                            <TextField
                                label="Tên"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                fullWidth
                            />

                            <TextField
                                label="Giá"
                                type="number"
                                {...register("price")}
                                error={!!errors.price}
                                helperText={errors.price?.message}
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
                                            placeholder="Nhập mô tả sản phẩm..."
                                            style={{
                                                width: "100%",
                                                padding: "8px 12px",
                                                border: errors.description ? "2px solid #f44336" : "1px solid #ccc",
                                                borderRadius: "4px",
                                                fontSize: "14px",
                                                resize: "vertical",
                                                Height: "40px",
                                                maxHeight: "150px",
                                            }}
                                        />
                                        {errors.description && (
                                            <FormHelperText error>{errors.description.message}</FormHelperText>
                                        )}
                                    </div>
                                )}
                            />

                            <Controller
                                name="imageUrl"
                                control={control}
                                render={({field}) => (
                                    <div className="flex flex-col gap-2">
                                        <TextField
                                            {...field}
                                            label="Ảnh mô tả"
                                            fullWidth
                                            error={!!errors.imageUrl}
                                            helperText={errors.imageUrl?.message}
                                        />
                                        {field.value && (
                                            <div className="rounded-lg overflow-hidden shadow-md">
                                                <img
                                                    src={field.value}
                                                    alt="Ảnh"
                                                    className="w-full max-h-64 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Phân loại"
                                    error={!!errors.category}
                                    helperText={errors.category?.message}
                                    fullWidth
                                >
                                    {FNB_CATEGORY.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />

                        <Controller
                            name="available"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Phục vụ"
                                    error={!!errors.available}
                                    helperText={errors.available?.message}
                                    fullWidth
                                >
                                    {FNB_AVAILABLE.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
