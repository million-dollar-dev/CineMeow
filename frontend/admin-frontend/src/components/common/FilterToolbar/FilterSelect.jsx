import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function FilterSelect({
    icon,
    value,
    onChange,
    options,
    children,
    ariaLabel,
    className = "relative w-full md:w-56 shrink-0",
    selectClassName = "",
}) {
    const handleChange = (e) => {
        if (typeof onChange === "function") {
            onChange(e.target.value);
        }
    };

    return (
        <div className={className}>
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                    {icon}
                </div>
            )}
            <select
                value={value}
                onChange={handleChange}
                aria-label={ariaLabel}
                className={`w-full ${
                    icon ? "pl-8.5" : "pl-3.5"
                } pr-8 py-2 text-xs font-bold text-slate-700 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition cursor-pointer shadow-2xs appearance-none truncate ${selectClassName}`}
            >
                {options
                    ? options.map((opt) => {
                          const optValue =
                              opt.value !== undefined
                                  ? opt.value
                                  : opt.code !== undefined
                                  ? opt.code
                                  : opt.key;
                          return (
                              <option key={optValue} value={optValue}>
                                  {opt.label || opt.name || optValue}
                              </option>
                          );
                      })
                    : children}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            </div>
        </div>
    );
}

