import React from 'react';
import {Controller} from "react-hook-form";

const FormField = ({ control, label, name, Component, type}) => {
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
                        />
                    );
                }}
            />
        </div>
    );
};

export default FormField;