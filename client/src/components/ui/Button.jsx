export default function Btn({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled,
    className = "",
    type = "button",
}) {
    const base =
        "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg";
    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };
    const variants = {
        primary:
            "bg-[#f97316] hover:bg-[#fb923c] text-white active:scale-95 cursor-pointer",
        secondary:
            "bg-[#171717] hover:bg-[#262626] text-[#e5e5e5] border border-[#262626] cursor-pointer",
        danger: "bg-red-900/50 hover:bg-red-800/50 text-red-300 border border-red-700/40 cursor-pointer",
        ghost: "text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#171717] cursor-pointer",
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            type={type}
            className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
            {children}
        </button>
    );
}
