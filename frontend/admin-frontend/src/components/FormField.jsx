import React from 'react';
import {Controller} from "react-hook-form";
import {FormHelperText} from "@mui/material";

const FormField = ({ control, label, name, Component, type, error}) => {
    return (
        <div>
            <p className="font-bold mb-1 text-sm text-[#4B465C]">{label}</p>
            <Controller
                name={name}
                control={control}
                render={({ field: {onChange, value, name}}) => {
                    return (
                        <Component
                            onChange = {onChange}
                            name = {name}
                            value = {value}
                            control = {control}
                            type = {type}
                            error = {error}
                        />
                    );
                }}
            />
            {error?.message && (<FormHelperText error={true}>{error.message}</FormHelperText>)}
        </div>
    );
};

export default FormField;