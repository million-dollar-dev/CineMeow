import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const TextInput = ({ onChange, name, value, type = "text", error, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
    return (
        <>
            <div className="relative">
                <input
                    placeholder={placeholder}
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black ${
                        error ? "border-red-500" : ""
                    }`}
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    type={inputType}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </>
    );
};

export default TextInput;
