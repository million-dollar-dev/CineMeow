import React from "react";

export default function FilterTabs({
    tabs = [],
    activeTab,
    onChange,
    className = "",
}) {
    if (!tabs || tabs.length === 0) return null;

    return (
        <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none ${className}`}>
            {tabs.map((tab) => {
                const tabValue =
                    tab.value !== undefined
                        ? tab.value
                        : tab.id !== undefined
                        ? tab.id
                        : tab.key;
                const isSelected = activeTab === tabValue;
                const hasCount = tab.count !== undefined && tab.count !== null;

                return (
                    <button
                        key={tabValue}
                        type="button"
                        onClick={() => onChange && onChange(tabValue)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                                ? "bg-violet-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                        }`}
                    >
                        <span>{tab.label}</span>
                        {hasCount && (
                            <span
                                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                    isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

