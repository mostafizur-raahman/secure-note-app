import React from "react";

export default function Empty({ message = "Nothing here yet" }) {
    return (
        <div className="text-center py-12 text-[#525252]">
            <p className="text-sm">{message}</p>
        </div>
    );
}
