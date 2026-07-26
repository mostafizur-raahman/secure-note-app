import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import Btn from "./ui/Button";
import Badge from "./ui/Badge";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { navigate, page, requireAuth } = useRouter();
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("home");
    };

    if (!user) {
        return (
            <nav className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626]/50">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <span
                        className="text-lg font-semibold tracking-tight cursor-pointer"
                        onClick={() => navigate("home")}>
                        Secure<span className="text-[#f97316]">Notes</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <Btn
                            variant="primary"
                            size="sm"
                            onClick={() => requireAuth("home")}>
                            {" "}
                            {/* ← Login then go home */}
                            Login
                        </Btn>
                        <Btn
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate("register")}>
                            Register
                        </Btn>
                    </div>
                </div>
            </nav>
        );
    }

    const mainNav = [
        { label: "Posts Feed", page: "home" },
        { label: "My Notes", page: "my-notes" },
    ];

    const adminNav = [
        { label: "Dashboard", page: "dashboard" },
        { label: "All Notes", page: "admin-notes" },
        { label: "Manage Users", page: "admin-users" },
        { label: "Interest Groups", page: "interest-groups" },
    ];

    return (
        <nav className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626]/50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span
                        className="text-lg font-semibold tracking-tight cursor-pointer"
                        onClick={() =>
                            navigate(isAdmin ? "dashboard" : "home")
                        }>
                        Secure<span className="text-[#f97316]">Notes</span>
                    </span>
                    <div className="hidden md:flex items-center gap-1">
                        {mainNav.map((i) => (
                            <Btn
                                key={i.page}
                                variant="ghost"
                                size="sm"
                                className={
                                    page === i.page
                                        ? "text-[#f97316] bg-[#171717]"
                                        : ""
                                }
                                onClick={() => navigate(i.page)}>
                                {i.label}
                            </Btn>
                        ))}
                        <Btn
                            variant="ghost"
                            size="sm"
                            className={
                                page === "create-post"
                                    ? "text-[#f97316] bg-[#171717]"
                                    : ""
                            }
                            onClick={() => navigate("create-post")}>
                            + Post
                        </Btn>
                        <Btn
                            variant="ghost"
                            size="sm"
                            className={
                                page === "create-note"
                                    ? "text-[#f97316] bg-[#171717]"
                                    : ""
                            }
                            onClick={() => navigate("create-note")}>
                            + Note
                        </Btn>

                        {isAdmin && (
                            <div className="relative">
                                <Btn
                                    variant="ghost"
                                    size="sm"
                                    className={
                                        adminNav.some((i) => i.page === page)
                                            ? "text-[#f97316] bg-[#171717]"
                                            : ""
                                    }
                                    onClick={() =>
                                        setAdminMenuOpen(!adminMenuOpen)
                                    }>
                                    Admin ▾
                                </Btn>
                                {adminMenuOpen && (
                                    <div
                                        className="absolute top-full left-0 mt-1 bg-[#0a0a0a] border border-[#262626] rounded-xl py-2 min-w-[180px] shadow-lg anim-fadeIn"
                                        onMouseLeave={() =>
                                            setAdminMenuOpen(false)
                                        }>
                                        {adminNav.map((i) => (
                                            <button
                                                key={i.page}
                                                className={`w-full text-left px-4 py-2 text-sm cursor-pointer ${page === i.page ? "text-[#f97316] bg-[#171717]" : "text-[#e5e5e5] hover:bg-[#171717]"}`}
                                                onClick={() => {
                                                    navigate(i.page);
                                                    setAdminMenuOpen(false);
                                                }}>
                                                {i.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isAdmin ? "admin" : "user"}>
                        {user?.role === "ADMIN" ? "Admin" : "User"}
                    </Badge>
                    <span className="text-xs text-[#a3a3a3] hidden sm:inline">
                        {user?.name || user?.email}
                    </span>
                    <Btn variant="secondary" size="sm" onClick={handleLogout}>
                        Logout
                    </Btn>
                </div>
            </div>

            {/* Mobile nav */}
            <div className="md:hidden px-4 pb-2 flex flex-wrap gap-1">
                {mainNav.map((i) => (
                    <Btn
                        key={i.page + "-m"}
                        variant="ghost"
                        size="sm"
                        className={
                            page === i.page ? "text-[#f97316] bg-[#171717]" : ""
                        }
                        onClick={() => navigate(i.page)}>
                        {i.label}
                    </Btn>
                ))}
                <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("create-post")}>
                    + Post
                </Btn>
                <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("create-note")}>
                    + Note
                </Btn>
                {isAdmin &&
                    adminNav.map((i) => (
                        <Btn
                            key={i.page + "-m"}
                            variant="ghost"
                            size="sm"
                            className={
                                page === i.page
                                    ? "text-[#f97316] bg-[#171717]"
                                    : ""
                            }
                            onClick={() => navigate(i.page)}>
                            {i.label}
                        </Btn>
                    ))}
            </div>
        </nav>
    );
}
