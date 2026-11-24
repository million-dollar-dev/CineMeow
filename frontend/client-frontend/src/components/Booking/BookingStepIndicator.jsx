import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function BookingStepIndicator({
    currentStep = "seat",
    onStepClick,
    canGoToFnb = false,
    canGoToCheckout = false,
    className = "",
}) {
    const steps = [
        { key: "seat", number: 1, label: "Chọn ghế" },
        { key: "fnb", number: 2, label: "Bắp nước" },
        { key: "checkout", number: 3, label: "Thanh toán" },
    ];

    const getStepStatus = (stepKey) => {
        if (stepKey === currentStep) return "active";
        if (currentStep === "fnb" && stepKey === "seat") return "completed";
        if (currentStep === "checkout" && (stepKey === "seat" || stepKey === "fnb")) return "completed";
        return "upcoming";
    };

    const isStepClickable = (stepKey) => {
        if (!onStepClick) return false;
        if (stepKey === currentStep) return false;
        if (stepKey === "seat") return true;
        if (stepKey === "fnb") return canGoToFnb;
        if (stepKey === "checkout") return canGoToCheckout;
        return false;
    };

    return (
        <div className={`flex items-center justify-start gap-2 sm:gap-4 py-1 text-xs select-none ${className}`}>
            {steps.map((step, idx) => {
                const status = getStepStatus(step.key);
                const clickable = isStepClickable(step.key);

                return (
                    <React.Fragment key={step.key}>
                        <button
                            type="button"
                            disabled={!clickable}
                            onClick={() => clickable && onStepClick(step.key)}
                            className={`flex items-center gap-2 transition-all ${
                                clickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                            }`}
                        >
                            {/* Step Number Circle */}
                            <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                    status === "active"
                                        ? "bg-violet-600 text-white shadow-sm shadow-violet-500/50 ring-2 ring-violet-500/30"
                                        : status === "completed"
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                        : "bg-zinc-850 text-zinc-500 border border-zinc-800"
                                }`}
                            >
                                {status === "completed" ? (
                                    <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
                                ) : (
                                    step.number
                                )}
                            </span>

                            {/* Step Label */}
                            <span
                                className={`font-semibold tracking-wide transition-colors ${
                                    status === "active"
                                        ? "text-violet-400 font-bold"
                                        : status === "completed"
                                        ? "text-zinc-300"
                                        : "text-zinc-500"
                                }`}
                            >
                                {step.label}
                            </span>
                        </button>

                        {/* Thin Connector line between steps */}
                        {idx < steps.length - 1 && (
                            <div
                                className={`w-8 sm:w-12 h-px transition-colors ${
                                    status === "completed" ? "bg-emerald-500/40" : "bg-zinc-800"
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
