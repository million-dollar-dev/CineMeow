import React from 'react';
import {TextField} from "@mui/material";

const TextInput = ({onChange, name, value, type = 'text', error}) => {
    return (
        <TextField
            fullWidth
            slotProps={{
                input: { className: "h-10 py-2 px-3"},
                tmlInput: { className: "!p-0"}
            }}
            name={name}
            value={value}
            onChange={onChange}
            variant="outlined"
            type={type}
            error={error}
        />
    );
};

export default TextInput;