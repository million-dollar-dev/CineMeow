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

const EMPTY_BRAND = {
    name: "EMPTY_BRAND",
    description: "Description",
    logoUrl: "https://homepage.momocdn.net/blogscontents/momo-upload-api-210604170617-637584231772974269.png",
    employees: 111,
    bgUrl: "https://media.vneconomy.vn/images/upload/2024/04/02/galaxy.png",
};

const brandSchema = yup.object().shape({

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
        console.log(data);
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
                                {...register("employees")}
                                error={!!errors.employees}
                                helperText={errors.employees?.message}
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
                                                className="max-w-64 max-h-64 object-contain border rounded-lg"
                                            />
                                        </div>

                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="bgUrl"
                            control={control}
                            render={({field}) => (
                                <div className="flex flex-col gap-2">
                                    <TextField
                                        {...field}
                                        label="bgUrl"
                                        fullWidth
                                        error={!!errors.bgUrl}
                                        helperText={errors.bgUrl?.message}
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
                        // disabled={isCreating || isUpdating}
                        startIcon={
                            // (isCreating || isUpdating) && (
                                <CircularProgress size={20} color="inherit"/>
                            //)
                        }
                    >
                        {mode === "add" ? "Lưu" : "Cập nhật"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
