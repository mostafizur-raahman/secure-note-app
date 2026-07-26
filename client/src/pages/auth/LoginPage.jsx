import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Field from "../../components/ui/Input";

export default function LoginPage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.login(email, password);
            toast.success("Logged in successfully!");
            router.navigate("home");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight mb-2">
                        Secure<span className="text-[#f97316]">Notes</span>
                    </h1>
                    <p className="text-sm text-[#a3a3a3]">
                        Sign in to your account
                    </p>
                </div>
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                        <Btn
                            variant="primary"
                            className="w-full"
                            disabled={auth.loading}
                            type="submit">
                            {auth.loading ? "Signing in..." : "Sign In"}
                        </Btn>
                    </form>
                    <p className="text-xs text-[#a3a3a3] text-center mt-4">
                        Don't have an account?{" "}
                        <span
                            className="text-[#f97316] cursor-pointer hover:underline"
                            onClick={() => router.navigate("register")}>
                            Register here
                        </span>
                    </p>
                </Card>
            </div>
        </div>
    );
}
