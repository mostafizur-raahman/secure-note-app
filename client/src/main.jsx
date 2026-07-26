import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "./contexts/RouterContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuth } from "./contexts/AuthContext";
import { useRouter } from "./contexts/RouterContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import WelcomePage from "./pages/auth/WelcomePage";

function App() {
    const auth = useAuth();
    const router = useRouter();

    // Not logged in → show auth pages
    if (!auth.user) {
        if (router.page === "register") return <RegisterPage />;
        return <LoginPage />;
    }

    // Logged in → show welcome page
    if (
        router.page === "login" ||
        router.page === "register" ||
        router.page === "home"
    ) {
        return <WelcomePage />;
    }

    return <WelcomePage />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <RouterProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </RouterProvider>
    </AuthProvider>,
);
