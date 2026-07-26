import React from "react";

export default function Area({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
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
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                required={required}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-[#e5e5e5] text-sm placeholder-[#525252] transition-all duration-150 resize-vertical"
            />
        </div>
    );
}
