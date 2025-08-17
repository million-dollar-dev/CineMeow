import React from 'react';
import FormField from "../components/FormField.jsx";
import {FormProvider, useForm} from "react-hook-form";
import TextInput from "../components/FormInputs/TextInput.jsx";
import {Alert, Button} from "@mui/material";
import {useLoginMutation} from "../services/rootApi.js";

const AuthPage = () => {
    const {control, handleSubmit} = useForm();
    const [login, {data, isLoading, isError, error}] = useLoginMutation();
    function onSubmit(formData) {
        console.log(formData);
        login(formData);
    }
    console.log({data, isLoading});

    return (
        <div className="bg-gray-300 flex items-center justify-center h-screen">
            <div className="bg-white shadow-sm w-[450px] h-fit px-8 py-10 rounded-xl">
                <FormProvider>
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="font-bold text-[2vw] mx-auto">CineMeow Admin</h1>
                        <FormField name="email" label="Username" control={control} Component={TextInput} />
                        <FormField name="password" label="Password" control={control} Component={TextInput} type={"password"} />
                        <Button variant="contained" type="submit">Login</Button>
                        {isError && <Alert severity="error">{error?.data?.message}</Alert>}
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default AuthPage;