export default function Card({ children, className = "" }) {
    return (
        <div
            className={`bg-[#0a0a0a] border border-[#262626] rounded-xl p-5 transition-colors duration-200 hover:border-[#404040] ${className}`}>
            {children}
        </div>
    );
}
