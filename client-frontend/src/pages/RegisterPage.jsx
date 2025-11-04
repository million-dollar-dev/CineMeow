import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import TextInput from "../components/FormInputs/TextInput.jsx";
import FormField from "../components/FormField.jsx";
import {FormProvider, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/src/index.js";
import {useRegisterMutation} from "../services/authService.js";
import {useDispatch} from "react-redux";
import {showToast} from "../redux/slices/toastSlice.js";
import Loading from "../components/Loading.jsx";
import OverlayLoading from "../components/Booking/OverlayLoading.jsx";

const RegisterPage = () => {
    const schema = yup.object().shape({
        username: yup.string().required("Username is required").min(3, "Min 3 characters"),
        password: yup.string().required("Password is required").min(3, "Min 3 characters"),
        email: yup.string().required("Email is required").email("Invalid email address"),
        phoneNumber: yup.string().required("Phone number is required"),
    });

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            phoneNumber: "",
        },
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [register,
        {data : response, isError, error, isSuccess, isLoading}
    ] = useRegisterMutation();
    const onSubmit = (formData) => {
        register(formData);
    }

    useEffect(() => {
        if (isSuccess) {
            navigate("/active-account");
        }
        if (isError) {
            dispatch(showToast({message: error?.message || "Something went wrong"}));
        }
    }, [register, isError, isSuccess, error, response]);

    if (isLoading) return <OverlayLoading />;

    return (
        <>
            <div className="bg-white p-10 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Đăng ký
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Đã có tài khoản?{" "}
                    <Link to={"/login"}>
                        <button
                            className="text-black font-medium hover:underline"
                        >
                            Đăng nhập
                        </button>
                    </Link>
                </p>
                <FormProvider>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <FormField
                            name="username"
                            placeholder={"Tên đăng nhập"}
                            control={control}
                            Component={TextInput}
                            error={errors["username"]}
                        />
                        <FormField
                            name="email"
                            placeholder={"Email"}
                            control={control}
                            Component={TextInput}
                            type="email"
                            error={errors["email"]}
                        />
                        <FormField
                            name="password"
                            placeholder={"Mật khẩu"}
                            control={control}
                            type="password"
                            Component={TextInput}
                            error={errors["password"]}
                        />
                        <FormField
                            name="phoneNumber"
                            placeholder={"Số điện thoại"}
                            control={control}
                            Component={TextInput}
                            error={errors["phoneNumber"]}
                        />
                        <p className="text-xs text-gray-500">
                            Khi đăng ký, bạn đồng ý với{" "}
                            <a href="#" className="underline">
                                Điều khoản sử dụng
                            </a>{" "}
                            và{" "}
                            <a href="#" className="underline">
                                Chính sách bảo mật
                            </a>.
                        </p>
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                            Đăng ký
                        </button>
                    </form>
                </FormProvider>


                {/*<div className="flex items-center my-6">*/}
                {/*    <hr className="flex-grow border-gray-300"/>*/}
                {/*    <span className="px-2 text-gray-500 text-sm">hoặc</span>*/}
                {/*    <hr className="flex-grow border-gray-300"/>*/}
                {/*</div>*/}

                {/*<div className="flex gap-4">*/}
                {/*    <button*/}
                {/*        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100">*/}
                {/*        <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500"/> Google*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </>
    );
};

export default RegisterPage;