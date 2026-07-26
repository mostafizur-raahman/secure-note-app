import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Field from "../../components/ui/Input";

export default function RegisterPage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [interests, setInterests] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const interestList = interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        try {
            await auth.register({
                name,
                email,
                password,
                interests: interestList,
            });
            toast.success("Account created! Please login now.");
            router.navigate("login"); // Go to login page (no token from register)
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">
                        Create Account
                    </h1>
                    <p className="text-sm text-[#a3a3a3]">
                        Join the note-taking platform
                    </p>
                </div>
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
                        <Field
                            label="Interests (comma-separated)"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="chess, reading, coding"
                        />
                        <Btn
                            variant="primary"
                            className="w-full"
                            disabled={auth.loading}
                            type="submit">
                            {auth.loading ? "Creating..." : "Create Account"}
                        </Btn>
                    </form>
                    <p className="text-xs text-[#a3a3a3] text-center mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-[#f97316] cursor-pointer hover:underline"
                            onClick={() => router.navigate("login")}>
                            Sign in
                        </span>
                    </p>
                </Card>
            </div>
        </div>
    );
}
