import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import TextInput from "../components/FormInputs/TextInput.jsx";
import FormField from "../components/FormField.jsx";
import {FormProvider, useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {setTokens} from "../redux/slices/authSlice.js";
import {useLoginMutation} from "../services/authService.js";

const RegisterPage = () => {
    const schema = yup.object().shape({
        username: yup.string().required("Username is required").min(3, "Min 3 characters"),
        password: yup.string().required("Password is required").min(3, "Min 3 characters"),
    });

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, {data = {}, isError, error, isSuccess, isLoading}] = useLoginMutation();

    const onSubmit = (formData) => {
        // login(formData);
    };

    useEffect(() => {
        if (isSuccess) {
            console.log(data)
            dispatch(setTokens({accessToken: data.data.token}));
            // navigate("/");
        }
        if(isError) {
            console.log(data)
            toast.error(error?.data?.message || "Đăng nhập thất bại!");
        }
    }, [isSuccess, data, navigate, dispatch, isLoading]);

    return (
        <>
            {/* RIGHT SIDE - FORM */}
            <div className="bg-white p-10 flex flex-col justify-center">
                {/* Tiêu đề thay đổi */}
                <h2 className="text-2xl font-bold mb-2 text-gray-900">Đăng nhập</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Chưa có tài khoản?{" "}
                    <Link to={"/register"}>
                        <button className="text-black font-medium hover:underline">
                            Đăng ký
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
                        name="password"
                        placeholder={"Mật khẩu"}
                        control={control}
                        type="password"
                        Component={TextInput}
                        error={errors["password"]}
                    />

                    <p className="text-sm text-gray-500 text-right underline">
                        Quên mật khẩu
                    </p>
                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Đăng nhập
                    </button>
                </form>
                </FormProvider>
                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300"/>
                    <span className="px-2 text-gray-500 text-sm">hoặc</span>
                    <hr className="flex-grow border-gray-300"/>
                </div>

                <div className="flex gap-4">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100">
                        <FontAwesomeIcon icon={faGoogle} className="text-lg text-red-500"/> Google
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;