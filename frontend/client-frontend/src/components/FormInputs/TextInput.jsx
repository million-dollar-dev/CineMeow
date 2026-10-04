import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const TextInput = ({ 
    onChange, 
    name, 
    value, 
    type = "text", 
    error, 
    placeholder, 
    icon,
    autoComplete,
    disabled = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" ? (showPassword ? "text" : "password") : type;

    return (
        <div className="w-full space-y-1.5">
            <div className="relative flex items-center">
                {/* Optional Leading Icon */}
                {icon && (
                    <div className="absolute left-4 text-slate-400 pointer-events-none text-sm">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    className={`w-full bg-[#0B0B14]/80 text-white placeholder-slate-500 text-xs sm:text-sm rounded-2xl py-3.5 transition-all duration-300 border ${
                        icon ? "pl-11" : "pl-4"
                    } ${
                        type === "password" ? "pr-11" : "pr-4"
                    } ${
                        error 
                            ? "border-rose-500/80 bg-rose-500/5 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" 
                            : "border-white/10 hover:border-white/20 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:shadow-[0_0_20px_rgba(127,90,240,0.2)]"
                    } focus:outline-none`}
                />

                {/* Password Toggle Button */}
                {type === "password" && (
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-sm" />
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="flex items-center gap-1.5 text-rose-400 text-xs pl-1 animate-fadeIn">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-[11px]" />
                    <span>{error.message}</span>
                </p>
            )}
        </div>
    );
};

export default TextInput;
