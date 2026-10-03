import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {useUpdateProfileMutation} from "../../services/profileService.js";
import {useEffect} from "react";
import {toast} from "react-toastify";
import {setUser} from "../../redux/slices/userSlice.js";

const schema = yup.object({
    phoneNumber: yup
        .string()
        // .matches(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
});

export default function UserProfileForm() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [updateProfile, {data: response, isLoading, isError, errors: updateErrors, isSuccess}] = useUpdateProfileMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            phoneNumber: user?.phoneNumber || "",
            email: user?.email || "",
        },
    });

    const onSubmit = async (data) => {
        updateProfile({ id: user?.userId, payload: data });
    };

    useEffect(() => {
        if(isSuccess) {
            dispatch(
                setUser({
                    phoneNumber: response?.phoneNumber,
                    email: response?.email,
                })
            );
            toast.success("Cập nhật thông tin thành công");
        }
        if (isError) {
            console.log(updateErrors);
            toast.warn(updateErrors?.data || "Cập nhật thông tin thất bại");
        }
    }, [updateProfile, isLoading, isError, isSuccess, updateErrors]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6 mb-8 shadow-[0_0_10px_rgba(127,90,240,0.05)]"
        >
            <h2 className="font-bold text-lg mb-4 text-[#eaeaea]">
                Thông tin cá nhân
            </h2>

            {/* Form grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Số điện thoại */}
                <div>
                    <label className="text-sm text-gray-400">Số điện thoại</label>
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="absolute right-3 top-4 text-gray-500"
                        />
                        <input
                            type="text"
                            {...register("phoneNumber")}
                            className={`w-full bg-[#1b1b1b] border ${
                                errors.phoneNumber ? "border-red-500" : "border-[#2a2a2a]"
                            } text-[#eaeaea] rounded-md p-2 mt-1 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition`}
                        />
                    </div>
                    {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="absolute right-3 top-4 text-gray-500"
                        />
                        <input
                            type="email"
                            {...register("email")}
                            className={`w-full bg-[#1b1b1b] border ${
                                errors.email ? "border-red-500" : "border-[#2a2a2a]"
                            } text-[#eaeaea] rounded-md p-2 mt-1 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 bg-[#7f5af0] text-white px-6 py-2 rounded-md font-medium hover:bg-[#9f7bff] active:scale-95 transition disabled:opacity-60"
            >
                {isLoading ? "Đang lưu..." : "Lưu thông tin"}
            </button>
        </form>
    );
}
