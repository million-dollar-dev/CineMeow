import React from "react";

export function FilterToolbar({ children, className = "" }) {
    return (
        <div className={`p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3.5 ${className}`}>
            {children}
        </div>
    );
}

export function FilterToolbarHeader({ children, className = "" }) {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3 ${className}`}>
            {children}
        </div>
    );
}

export function FilterToolbarControls({ children, className = "" }) {
    return (
        <div className={`flex flex-col md:flex-row items-center gap-3 ${className}`}>
            {children}
        </div>
    );
}

FilterToolbar.Header = FilterToolbarHeader;
FilterToolbar.Controls = FilterToolbarControls;

export default FilterToolbar;

