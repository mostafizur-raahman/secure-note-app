import React from "react";

export default function Spinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
