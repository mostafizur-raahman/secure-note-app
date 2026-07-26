import { useState } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import userService from "../../services/userService";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Field from "../../components/ui/Input";
import SelectField from "../../components/ui/Select";

export default function AdminAddUserPage() {
    const router = useRouter();
    const toast = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [interests, setInterests] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const interestList = interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        try {
            await userService.create({
                name,
                email,
                password,
                role,
                interests: interestList,
            });
            toast.success("User created!");
            router.navigate("admin-users");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Add New User <Badge variant="admin">Admin</Badge>
            </h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                    <Field
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    <Field
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
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
                        placeholder="chess, reading, coding"
                    />
                    <div className="flex gap-3 justify-end">
                        <Btn
                            variant="secondary"
                            onClick={() => router.navigate("admin-users")}>
                            Cancel
                        </Btn>
                        <Btn variant="primary" disabled={loading} type="submit">
                            {loading ? "Creating..." : "Create User"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </div>
    );
}
