import { useState, useEffect } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import userService from "../../services/userService";
import { extractList, extractTotalPages } from "../../utils/extractData";
import Badge from "../../components/ui/Badge";
import Btn from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function AdminUsersPage() {
    const router = useRouter();
    const toast = useToast();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchUsers = async (p) => {
        setLoading(true);
        try {
            const data = await userService.list(p);
            const list = extractList(data);
            setUsers(list);
            setTotalPages(extractTotalPages(data, list.length, p));
            setPage(p);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await userService.del(deleteId);
            toast.success("User removed!");
            setDeleteId(null);
            fetchUsers(page);
        } catch (err) {
            toast.error(err.message);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                    Manage Users <Badge variant="admin">Admin</Badge>
                </h2>
                <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => router.navigate("admin-add-user")}>
                    + Add User
                </Btn>
            </div>

            {deleteId && (
                <ConfirmModal
                    title="Remove User"
                    message="Permanently remove this user and all their data?"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            {loading ? (
                <Spinner />
            ) : users.length === 0 ? (
                <Empty message="No users found" />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#262626] text-[#a3a3a3] text-xs uppercase tracking-wider">
                                <th className="pb-3 text-left">Name</th>
                                <th className="pb-3 text-left">Email</th>
                                <th className="pb-3 text-left">Role</th>
                                <th className="pb-3 text-left">Interests</th>
                                <th className="pb-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id || u._id}
                                    className="border-b border-[#171717]">
                                    <td className="py-3 font-medium">
                                        {u.name}
                                    </td>
                                    <td className="py-3 text-[#a3a3a3]">
                                        {u.email}
                                    </td>
                                    <td className="py-3">
                                        <Badge
                                            variant={
                                                u.role === "ADMIN"
                                                    ? "admin"
                                                    : "user"
                                            }>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-[#a3a3a3]">
                                        {u.interests?.join(", ") || "—"}
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex gap-1 justify-end">
                                            <Btn
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.navigate(
                                                        "admin-edit-user",
                                                        {
                                                            userId:
                                                                u.id || u._id,
                                                        },
                                                    )
                                                }>
                                                Edit
                                            </Btn>
                                            <Btn
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    router.navigate(
                                                        "user-posts",
                                                        {
                                                            userId:
                                                                u.id || u._id,
                                                        },
                                                    )
                                                }>
                                                Posts
                                            </Btn>
                                            <Btn
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setDeleteId(u.id || u._id)
                                                }>
                                                <span className="text-red-400">
                                                    Del
                                                </span>
                                            </Btn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={fetchUsers}
            />
        </div>
    );
}
