import React from "react";

export default function Field({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
    className = "",
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-medium text-[#a3a3a3] mb-1.5">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-[#e5e5e5] text-sm placeholder-[#525252] transition-all duration-150"
            />
        </div>
    );
}
