import React from 'react';
import FormField from "../components/FormField.jsx";
import {FormProvider, useForm} from "react-hook-form";
import TextInput from "../components/FormInputs/TextInput.jsx";
import {Button} from "@mui/material";

const AuthPage = () => {
    const {control, } = useForm();
    return (
        <div className="bg-gray-300 flex items-center justify-center h-screen">
            <div className="bg-white shadow-sm w-[450px] h-fit">
                <FormProvider>
                    <h1 className="font-bold text-[2vw]">CineMeow</h1>
                    <FormField name="username" label="Username" control={control} Component={TextInput} />
                    <FormField name="password" label="Password" control={control} Component={TextInput} type={"password"} />
                    <Button variant={"contained"}>Login</Button>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthPage;