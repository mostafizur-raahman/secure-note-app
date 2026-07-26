import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../contexts/RouterContext";
import Btn from "./ui/Button";
import Badge from "./ui/Badge";

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const { navigate, page } = useRouter();

    const handleLogout = () => {
        logout();
        navigate("login");
    };

    const navItems = [
        { label: "Posts Feed", page: "home", adminOnly: false },
        { label: "Create Post", page: "create-post", adminOnly: false },
        { label: "My Notes", page: "my-notes", adminOnly: false },
        { label: "Create Note", page: "create-note", adminOnly: false },
    ];

    const visible = navItems.filter((i) => !i.adminOnly || isAdmin);

    return (
        <nav className="sticky top-0 z-30 bg-[#050505]/90 backdrop-blur-md border-b border-[#262626]/50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span
                        className="text-lg font-semibold tracking-tight cursor-pointer"
                        onClick={() => navigate("home")}>
                        Secure<span className="text-[#f97316]">Notes</span>
                    </span>
                    <div className="hidden md:flex items-center gap-1">
                        {visible.map((i) => (
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
            <div className="md:hidden px-4 pb-2 flex flex-wrap gap-1">
                {visible.map((i) => (
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
            </div>
        </nav>
    );
}
