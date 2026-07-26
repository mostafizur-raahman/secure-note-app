import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import userService from "../../services/userService";
import postService from "../../services/postService";
import noteService from "../../services/noteService";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";

export default function DashboardPage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalRegularUsers: 0,
        totalPosts: 0,
        totalNotes: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch users — get all to count admins vs regular
                const usersData = await userService.list(1, 100);
                const usersList = usersData.data || usersData.users || [];
                const totalUsers =
                    usersData.meta?.total ||
                    usersData.total ||
                    usersList.length ||
                    0;

                // Count admins and regular users from the list
                const totalAdmins = usersList.filter(
                    (u) => u.role === "ADMIN",
                ).length;
                const totalRegularUsers = totalUsers - totalAdmins;

                // Fetch posts — just get total count from meta
                const postsData = await postService.list(1, 1);
                const totalPosts =
                    postsData.meta?.total || postsData.total || 0;

                // Fetch all notes — admin endpoint, just get total count
                const notesData = await noteService.getAll(1, 1);
                const totalNotes =
                    notesData.meta?.total || notesData.total || 0;

                setStats({
                    totalUsers,
                    totalAdmins,
                    totalRegularUsers,
                    totalPosts,
                    totalNotes,
                });
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Spinner />;

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: "👥",
            color: "border-blue-700/40 bg-blue-900/20",
            textColor: "text-blue-400",
            page: "admin-users",
        },
        {
            label: "Admins",
            value: stats.totalAdmins,
            icon: "🛡️",
            color: "border-red-700/40 bg-red-900/20",
            textColor: "text-red-400",
            page: "admin-users",
        },
        {
            label: "Regular Users",
            value: stats.totalRegularUsers,
            icon: "👤",
            color: "border-green-700/40 bg-green-900/20",
            textColor: "text-green-400",
            page: "admin-users",
        },
        {
            label: "Total Posts",
            value: stats.totalPosts,
            icon: "📝",
            color: "border-orange-700/40 bg-orange-900/20",
            textColor: "text-orange-400",
            page: "home",
        },
        {
            label: "Total Notes",
            value: stats.totalNotes,
            icon: "📋",
            color: "border-purple-700/40 bg-purple-900/20",
            textColor: "text-purple-400",
            page: "admin-notes",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                    Admin Dashboard <Badge variant="admin">Admin</Badge>
                </h2>
                <span className="text-xs text-[#525252]">
                    Logged in as{" "}
                    <span className="text-[#f97316]">{auth.user?.name}</span>
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className={`${card.color} border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 hover:border-opacity-100`}
                        onClick={() => router.navigate(card.page)}>
                        <div className="text-2xl mb-2">{card.icon}</div>
                        <div className={`text-2xl font-bold ${card.textColor}`}>
                            {card.value}
                        </div>
                        <div className="text-xs text-[#a3a3a3] mt-1">
                            {card.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5 mb-8">
                <h3 className="text-sm font-medium text-[#a3a3a3] mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                        onClick={() => router.navigate("admin-users")}
                        className="px-4 py-3 bg-[#171717] border border-[#262626] rounded-lg text-sm text-[#e5e5e5] hover:bg-[#262626] transition-colors cursor-pointer">
                        👥 Manage Users
                    </button>
                    <button
                        onClick={() => router.navigate("admin-notes")}
                        className="px-4 py-3 bg-[#171717] border border-[#262626] rounded-lg text-sm text-[#e5e5e5] hover:bg-[#262626] transition-colors cursor-pointer">
                        📋 All Notes
                    </button>
                    <button
                        onClick={() => router.navigate("interest-groups")}
                        className="px-4 py-3 bg-[#171717] border border-[#262626] rounded-lg text-sm text-[#e5e5e5] hover:bg-[#262626] transition-colors cursor-pointer">
                        🏷️ Interest Groups
                    </button>
                    <button
                        onClick={() => router.navigate("home")}
                        className="px-4 py-3 bg-[#171717] border border-[#262626] rounded-lg text-sm text-[#e5e5e5] hover:bg-[#262626] transition-colors cursor-pointer">
                        📝 Posts Feed
                    </button>
                </div>
            </div>

            {/* Your Info */}
            <div className="bg-[#0a0a0a] border border-[#262626] rounded-xl p-5">
                <h3 className="text-sm font-medium text-[#a3a3a3] mb-3">
                    Your Account
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#525252]">Name:</span>
                        <span className="text-sm font-medium">
                            {auth.user?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#525252]">Email:</span>
                        <span className="text-sm text-[#a3a3a3]">
                            {auth.user?.email}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-[#525252]">Role:</span>
                        <Badge variant="admin">{auth.user?.role}</Badge>
                    </div>
                    {auth.user?.interests && auth.user.interests.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#525252]">
                                Interests:
                            </span>
                            <div className="flex gap-1">
                                {auth.user.interests.map((i) => (
                                    <Badge key={i} variant="orange">
                                        {i}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
