import { IconButton } from "@mui/material";

const CustomIconButton = ({ children, ...props }) => {
    return (
        <IconButton
            className="!bg-white hover:!bg-gray-200 ease-in-out transition-colors !text-black"
            {...props}
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
