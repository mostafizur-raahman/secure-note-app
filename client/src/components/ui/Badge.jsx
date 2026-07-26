import React from "react";

export default function Badge({ children, variant = "default" }) {
    const styles = {
        default: "bg-[#171717] text-[#a3a3a3]",
        orange: "bg-orange-900/40 text-orange-400",
        admin: "bg-red-900/40 text-red-400",
        user: "bg-blue-900/40 text-blue-400",
    };
    return (
        <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
            {children}
        </span>
    );
}
