import { useState, useEffect } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import userService from "../../services/userService";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Field from "../../components/ui/Input";
import SelectField from "../../components/ui/Select";
import Spinner from "../../components/ui/Spinner";

export default function AdminEditUserPage() {
    const router = useRouter();
    const toast = useToast();
    const userId = router.params.userId;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("USER");
    const [interests, setInterests] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) {
            router.navigate("admin-users");
            return;
        }
        userService
            .get(userId)
            .then((response) => {
                const u = response.data?.user || response.data || response;
                setName(u.name || "");
                setEmail(u.email || "");
                setRole(u.role || "USER");
                setInterests(u.interests?.join(", ") || "");
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                router.navigate("admin-users");
            });
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const interestList = interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        try {
            await userService.update(userId, {
                name,
                email,
                role,
                interests: interestList,
            });
            toast.success("User updated!");
            router.navigate("admin-users");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Edit User <Badge variant="admin">Admin</Badge>
            </h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Field
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <SelectField
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        options={[
                            { value: "USER", label: "User" },
                            { value: "ADMIN", label: "Admin" },
                        ]}
                    />
                    <Field
                        label="Interests (comma-separated)"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                    />
                    <div className="flex gap-3 justify-end">
                        <Btn
                            variant="secondary"
                            onClick={() => router.navigate("admin-users")}>
                            Cancel
                        </Btn>
                        <Btn variant="primary" disabled={saving} type="submit">
                            {saving ? "Saving..." : "Save Changes"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </div>
    );
}
