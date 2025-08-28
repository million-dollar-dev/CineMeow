import React, {useEffect} from 'react';
import FormField from "../components/FormField.jsx";
import {FormProvider, useForm} from "react-hook-form";
import TextInput from "../components/FormInputs/TextInput.jsx";
import {Alert, Button, CircularProgress} from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {setTokens} from "../redux/slices/authSlice.js";
import {useLoginMutation} from "../services/authService.js";

const AuthPage = () => {
    const formSchema = yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    })

    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
          username: "",
          password: "",
        },
        resolver: yupResolver(formSchema)
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, {data = {}, isError, error, isSuccess, isLoading}] = useLoginMutation();

    function onSubmit(formData) {
        console.log(formData);
        login(formData);
    }

    useEffect(() => {
        if (isSuccess) {
            console.log(data);
            dispatch(openSnackbar({message: 'Login successfully!'}));
            dispatch(setTokens({accessToken: data.data.accessToken, refreshToken: data.data.refreshToken}));
            navigate("/");
        }
    }, [isSuccess, data, navigate, dispatch, isLoading]);
    return (
        <div className="bg-gray-300 flex items-center justify-center h-screen">
            <div className="bg-white shadow-sm w-[450px] h-fit px-8 py-10 rounded-xl">
                <FormProvider>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="font-bold text-[2vw] mx-auto">CineMeow Admin</h1>
                        <FormField
                            name="username"
                            label="Username"
                            control={control}
                            Component={TextInput}
                            error={errors["username"]}
                        />
                        <FormField
                            name="password"
                            label="Password"
                            control={control}
                            Component={TextInput}
                            type={"password"}
                            error={errors["password"]}
                        />
                        <Button variant="contained" type="submit">
                            {isLoading && (<CircularProgress size="20px" color={"white"} className="mr-1"/>)}
                            Login
                        </Button>
                        {isError && <Alert severity="error">{error?.data?.message}</Alert>}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthPage;