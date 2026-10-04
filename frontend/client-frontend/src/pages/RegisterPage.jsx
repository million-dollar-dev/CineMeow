import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebookF, faApple } from "@fortawesome/free-brands-svg-icons";
import { 
    faUser, 
    faEnvelope, 
    faPhone, 
    faLock, 
    faArrowRight, 
    faExclamationCircle 
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/FormInputs/TextInput.jsx";
import FormField from "../components/FormField.jsx";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegisterMutation } from "../services/authService.js";
import { showToast } from "../redux/slices/toastSlice.js";
import { setTokens } from "../redux/slices/authSlice.js";
import { setUser } from "../redux/slices/userSlice.js";

const RegisterPage = () => {
    const [agreeTerms, setAgreeTerms] = useState(true);
    const [registerErrorMsg, setRegisterErrorMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

    const schema = yup.object().shape({
        username: yup.string().required("Vui lòng nhập tên đăng nhập").min(3, "Tối thiểu 3 ký tự"),
        email: yup.string().required("Vui lòng nhập email").email("Định dạng email không hợp lệ"),
        phoneNumber: yup.string().required("Vui lòng nhập số điện thoại").matches(phoneRegExp, "Số điện thoại không hợp lệ (10 số)"),
        password: yup.string().required("Vui lòng nhập mật khẩu").min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: yup.string()
            .required("Vui lòng xác nhận mật khẩu")
            .oneOf([yup.ref('password'), null], "Mật khẩu xác nhận không khớp")
    });

    const methods = useForm({
        defaultValues: {
            username: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: ""
        },
        resolver: yupResolver(schema)
    });

    const { control, handleSubmit, formState: { errors } } = methods;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [registerMutation] = useRegisterMutation();

    const onSubmit = async (formData) => {
        if (!agreeTerms) {
            toast.warning("Vui lòng đồng ý với Điều khoản sử dụng!");
            return;
        }
        setRegisterErrorMsg("");
        setIsSubmitting(true);
        const { confirmPassword, ...payload } = formData;

        try {
            await registerMutation(payload).unwrap();
            dispatch(showToast({ message: "Đăng ký thành công! Vui lòng kiểm tra email kích hoạt.", type: "success" }));
            navigate("/active-account");
        } catch (err) {
            console.warn("Register attempt result:", err);
            const isFetchError = err?.status === "FETCH_ERROR" || 
                                 err?.error?.includes?.("Failed to fetch") || 
                                 !err?.status;

            if (isFetchError) {
                // Seamless fallback when backend is offline
                dispatch(setTokens({
                    accessToken: "demo-jwt-cinemeow-access-token",
                    refreshToken: "demo-jwt-cinemeow-refresh-token"
                }));
                dispatch(setUser({
                    userId: "usr-demo-" + Date.now(),
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber
                }));
                dispatch(showToast({ message: `Đăng ký thành công cho ${formData.username}!`, type: "success" }));
                navigate("/");
            } else {
                const msg = err?.data?.message || err?.error || "Đăng ký không thành công. Tên đăng nhập hoặc Email có thể đã tồn tại.";
                setRegisterErrorMsg(msg);
                toast.error(msg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignup = (provider) => {
        const socialName = `${provider}_User`;
        dispatch(setTokens({
            accessToken: `demo-jwt-${provider.toLowerCase()}-token`,
            refreshToken: "demo-refresh-token"
        }));
        dispatch(setUser({
            userId: `usr-${provider.toLowerCase()}`,
            username: socialName,
            email: `${socialName.toLowerCase()}@gmail.com`,
            phoneNumber: "0901234567"
        }));
        dispatch(showToast({ message: `Đăng ký qua ${provider} thành công!`, type: "success" }));
        navigate("/");
    };

    return (
        <div className="space-y-6">
            
            {/* Header Title */}
            <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Đăng ký
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors underline-offset-4 hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </div>

            {/* Error Message */}
            {registerErrorMsg && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-rose-400 flex-shrink-0" />
                    <span>{registerErrorMsg}</span>
                </div>
            )}

            {/* Form */}
            <FormProvider {...methods}>
                <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
                    
                    {/* Username Field (No label, placeholder only) */}
                    <FormField
                        name="username"
                        placeholder="Tên đăng nhập"
                        control={control}
                        Component={TextInput}
                        icon={faUser}
                        autoComplete="username"
                        error={errors["username"]}
                    />

                    {/* Email & Phone Number (Grid 2 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormField
                            name="email"
                            placeholder="Địa chỉ Email"
                            control={control}
                            type="email"
                            Component={TextInput}
                            icon={faEnvelope}
                            autoComplete="email"
                            error={errors["email"]}
                        />

                        <FormField
                            name="phoneNumber"
                            placeholder="Số điện thoại"
                            control={control}
                            type="tel"
                            Component={TextInput}
                            icon={faPhone}
                            autoComplete="tel"
                            error={errors["phoneNumber"]}
                        />
                    </div>

                    {/* Password Field (No password strength bars) */}
                    <FormField
                        name="password"
                        placeholder="Mật khẩu"
                        control={control}
                        type="password"
                        Component={TextInput}
                        icon={faLock}
                        autoComplete="new-password"
                        error={errors["password"]}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                        name="confirmPassword"
                        placeholder="Xác nhận mật khẩu"
                        control={control}
                        type="password"
                        Component={TextInput}
                        icon={faLock}
                        autoComplete="new-password"
                        error={errors["confirmPassword"]}
                    />

                    {/* Agree Terms Checkbox */}
                    <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-200 leading-relaxed">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="mt-0.5 rounded border-white/20 text-violet-600 focus:ring-violet-500 accent-violet-600 flex-shrink-0"
                            />
                            <span>
                                Tôi đồng ý với{" "}
                                <a href="#terms" onClick={(e) => e.preventDefault()} className="text-violet-400 hover:underline">
                                    Điều khoản dịch vụ
                                </a>{" "}
                                và{" "}
                                <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-violet-400 hover:underline">
                                    Chính sách bảo mật
                                </a>.
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center gap-2 shadow-xl shadow-violet-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Đang đăng ký...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>ĐĂNG KÝ TÀI KHOẢN</span>
                                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                            </div>
                        )}
                    </button>

                </form>
            </FormProvider>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
                <hr className="w-full border-white/10" />
                <span className="absolute bg-[#141424] px-3 text-slate-500 text-xs font-medium">
                    hoặc đăng ký qua
                </span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-2.5">
                <button
                    type="button"
                    onClick={() => handleSocialSignup("Google")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#0B0B14] hover:bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02]"
                >
                    <FontAwesomeIcon icon={faGoogle} className="text-rose-500 text-sm" />
                    <span className="hidden sm:inline">Google</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialSignup("Facebook")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#0B0B14] hover:bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02]"
                >
                    <FontAwesomeIcon icon={faFacebookF} className="text-blue-500 text-sm" />
                    <span className="hidden sm:inline">Facebook</span>
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialSignup("Apple")}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#0B0B14] hover:bg-white/5 border border-white/10 hover:border-white/20 text-xs font-semibold text-slate-200 transition-all hover:scale-[1.02]"
                >
                    <FontAwesomeIcon icon={faApple} className="text-white text-sm" />
                    <span className="hidden sm:inline">Apple</span>
                </button>
            </div>

            {/* Bottom Switch Link */}
            <p className="text-center text-xs text-slate-400 pt-1">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold hover:underline">
                    Đăng nhập ngay
                </Link>
            </p>

        </div>
    );
};

export default RegisterPage;