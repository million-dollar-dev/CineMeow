import React from 'react';
import {TextField} from "@mui/material";

const TextInput = ({onChange, name, value, type = 'text'}) => {
    return (
        <TextField name={name} value={value} onChange={onChange} variant="outlined" type={type} />
    );
};

export default TextInput;