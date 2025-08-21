import React from 'react';
import {Controller} from "react-hook-form";

const FormField = ({ control, placeholder, name, Component, type, error}) => {
    return (
        <div>
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
                            placeholder = {placeholder}
                        />
                    );
                }}
            />
        </div>
    );
};

export default FormField;