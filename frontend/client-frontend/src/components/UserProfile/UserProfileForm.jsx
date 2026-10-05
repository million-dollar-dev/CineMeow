import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPhone,
    faEnvelope,
    faUser,
    faIdCard,
    faCopy,
    faCheck,
    faShieldHalved,
    faRotateLeft,
    faFloppyDisk,
    faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { useUpdateProfileMutation } from "../../services/profileService.js";
import { toast } from "react-toastify";
import { setUser } from "../../redux/slices/userSlice.js";

const schema = yup.object({
    phoneNumber: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9+() -]{9,15}$/, "Số điện thoại không hợp lệ (từ 9 - 15 số)"),
    email: yup
        .string()
        .required("Vui lòng nhập địa chỉ email")
        .email("Định dạng email không hợp lệ"),
});

export default function UserProfileForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [copiedId, setCopiedId] = useState(false);

    const [updateProfile, { data: response, isLoading, isError, error: updateError, isSuccess }] =
        useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
        },
    });

    // Populate or sync form whenever user changes in Redux
    useEffect(() => {
        if (user) {
            reset({
                phoneNumber: user.phoneNumber || "",
                email: user.email || "",
            });
        }
    }, [user?.phoneNumber, user?.email, reset]);

    const handleCopyId = () => {
        const idToCopy = user?.userId || "CM-MEMBER";
        navigator.clipboard.writeText(idToCopy);
        setCopiedId(true);
        toast.info("Đã sao chép mã thành viên vào bộ nhớ tạm!");
        setTimeout(() => setCopiedId(false), 2500);
    };

    const handleResetForm = () => {
        reset({
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
        });
        toast.info("Đã khôi phục dữ liệu ban đầu");
    };

    const onSubmit = async (data) => {
        if (!user?.userId) {
            toast.warn("Không tìm thấy mã người dùng để cập nhật");
            return;
        }
        updateProfile({ id: user.userId, payload: data });
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch(
                setUser({
                    phoneNumber: response?.phoneNumber,
                    email: response?.email,
                })
            );
            toast.success("Cập nhật thông tin tài khoản thành công!");
        }
        if (isError) {
            console.error("Lỗi cập nhật hồ sơ:", updateError);
            toast.error(updateError?.data?.message || "Cập nhật thông tin thất bại. Vui lòng thử lại!");
        }
    }, [isSuccess, isError, response, updateError, dispatch]);

    return (
        <div className="space-y-6">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-[#12121e]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6"
            >
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-violet-400" />
                            <span>Thông Tin Cá Nhân</span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-1">
                            Quản lý thông tin liên hệ nhận vé điện tử và quyền lợi thành viên CineMeow
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold self-start sm:self-auto">
                        <FontAwesomeIcon icon={faCrown} className="text-amber-400 text-xs" />
                        <span>Hội viên CineMeow Club</span>
                    </div>
                </div>

                {/* Read-Only Account Identity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0B14]/80 border border-white/5">
                    {/* Username */}
                    <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Tên tài khoản (Username)
                        </span>
                        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-sm font-semibold">
                            <FontAwesomeIcon icon={faUser} className="text-violet-400 text-xs" />
                            <span className="truncate">{user?.username || "Thành viên"}</span>
                            <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                Đã xác thực
                            </span>
                        </div>
                    </div>

                    {/* Member ID with Copy */}
                    <div>
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                            Mã thành viên (User ID)
                        </span>
                        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white text-sm font-mono">
                            <div className="flex items-center gap-2 truncate">
                                <FontAwesomeIcon icon={faIdCard} className="text-zinc-500 text-xs" />
                                <span className="truncate text-zinc-300">{user?.userId || "Chưa cấp ID"}</span>
                            </div>
                            {user?.userId && (
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    className="ml-2 p-1 text-zinc-400 hover:text-violet-400 transition cursor-pointer"
                                    title="Sao chép ID"
                                >
                                    <FontAwesomeIcon icon={copiedId ? faCheck : faCopy} className={copiedId ? "text-emerald-400" : ""} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Editable Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                            Số điện thoại nhận vé <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 text-xs">
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                            <input
                                type="text"
                                {...register("phoneNumber")}
                                placeholder="Nhập số điện thoại (vd: 0912345678)"
                                className={`w-full h-11 pl-10 pr-4 bg-zinc-900/90 border rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 transition ${
                                    errors.phoneNumber
                                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                                        : "border-zinc-700/80 focus:border-violet-500 focus:ring-violet-500/40"
                                }`}
                            />
                        </div>
                        {errors.phoneNumber ? (
                            <p className="text-rose-400 text-xs mt-1.5 font-medium">
                                {errors.phoneNumber.message}
                            </p>
                        ) : (
                            <p className="text-zinc-500 text-[11px] mt-1.5">
                                Dùng để nhận tin nhắn SMS xác nhận mã vé khi đặt vé online
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                            Địa chỉ email <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 text-xs">
                                <FontAwesomeIcon icon={faEnvelope} />
                            </div>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Nhập địa chỉ email của bạn"
                                className={`w-full h-11 pl-10 pr-4 bg-zinc-900/90 border rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 transition ${
                                    errors.email
                                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                                        : "border-zinc-700/80 focus:border-violet-500 focus:ring-violet-500/40"
                                }`}
                            />
                        </div>
                        {errors.email ? (
                            <p className="text-rose-400 text-xs mt-1.5 font-medium">
                                {errors.email.message}
                            </p>
                        ) : (
                            <p className="text-zinc-500 text-[11px] mt-1.5">
                                Hóa đơn điện tử và vé PDF sẽ được gửi trực tiếp về email này
                            </p>
                        )}
                    </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={handleResetForm}
                        disabled={!isDirty || isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                        <span>Khôi phục ban đầu</span>
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-violet-900/40 transition disabled:opacity-60 cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} className="text-xs" />
                        <span>{isLoading ? "Đang lưu thay đổi..." : "Lưu Thông Tin"}</span>
                    </button>
                </div>
            </form>

            {/* Privacy & Security Note Box */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs text-zinc-400">
                <FontAwesomeIcon icon={faShieldHalved} className="text-violet-400 text-base mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                    <span className="font-semibold text-zinc-300">Cam kết bảo mật dữ liệu: </span>
                    CineMeow luôn bảo vệ thông tin cá nhân của hội viên theo tiêu chuẩn an toàn bảo mật cao nhất. Thông tin chỉ dùng cho mục đích đặt vé, nhận voucher và hỗ trợ khách hàng tại rạp.
                </p>
            </div>
        </div>
    );
}
