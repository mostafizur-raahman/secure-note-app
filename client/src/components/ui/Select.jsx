export default function SelectField({
    label,
    value,
    onChange,
    options,
    className = "",
}) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-xs font-medium text-[#a3a3a3] mb-1.5">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#262626] rounded-lg text-[#e5e5e5] text-sm">
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
