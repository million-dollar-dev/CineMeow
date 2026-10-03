import React from 'react';

const OverlayLoading = () => {
    return (
        (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#9f7bff] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    );
};

export default OverlayLoading;