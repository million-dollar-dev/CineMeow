import React from 'react';

const CinemaBrandSelector = () => {
    return (
        <button className="px-[1.2vw] py-[0.4vw] bg-white text-black hover:opacity-95">
            <div className="flex items-center justify-between flex-col gap-[0.2vw]">
                <div className="w-[4vw] h-[4vw] border-2 border-gray-400 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/CGV_logo.svg/1200px-CGV_logo.svg.png"
                        alt="CGV Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <p className="text-[1.2vw] font-semibold">CGV</p>
            </div>
        </button>
    );
};

export default CinemaBrandSelector;