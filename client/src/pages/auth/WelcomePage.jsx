import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

export default function WelcomePage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const handleLogout = () => {
        auth.logout();
        toast.info("Logged out");
        router.navigate("login");
    };

    const user = auth.user;

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="max-w-md w-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold tracking-tight mb-3">
                        Welcome,{" "}
                        <span className="text-[#f97316]">
                            {user?.name || user?.email}
                        </span>
                        !
                    </h2>

                    {/* Role badge — handles "USER" and "ADMIN" */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Badge variant={auth.isAdmin ? "admin" : "user"}>
                            {user?.role || "USER"}
                        </Badge>
                        <span className="text-xs text-[#a3a3a3]">
                            {user?.email}
                        </span>
                    </div>

                    {/* Interests */}
                    {user?.interests && user.interests.length > 0 && (
                        <div className="mb-4 flex items-center justify-center gap-2 flex-wrap">
                            <span className="text-xs text-[#a3a3a3]">
                                Interests:
                            </span>
                            {user.interests.map((i) => (
                                <Badge key={i} variant="orange">
                                    {i}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Btn variant="secondary" onClick={handleLogout}>
                        Logout
                    </Btn>
                </div>
            </Card>
        </div>
    );
}
