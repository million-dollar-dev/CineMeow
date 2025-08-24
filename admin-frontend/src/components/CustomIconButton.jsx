import { IconButton } from "@mui/material";

const CustomIconButton = ({ children }) => {
    return (
        <IconButton
            className="bg-gray-100 hover:bg-gray-200 transition-colors"
            sx={{
                width: 48,
                height: 48,
                borderRadius: "16px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}
        >
            {children}
        </IconButton>
    );
};

export default CustomIconButton;
