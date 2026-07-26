import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RouterProvider } from "./contexts/RouterContext";
import { ToastProvider } from "./contexts/ToastContext";
import { useAuth } from "./contexts/AuthContext";
import { useRouter } from "./contexts/RouterContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/posts/HomePage";
import CreatePostPage from "./pages/posts/CreatePostPage";
import EditPostPage from "./pages/posts/EditPostPage";

const pageMap = {
    home: HomePage,
    "create-post": CreatePostPage,
    "edit-post": EditPostPage,
};

function App() {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
        if (router.page === "register") return <RegisterPage />;
        return <LoginPage />;
    }

    const PageComp = pageMap[router.page] || HomePage;

    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <PageComp />
            </main>
        </div>
    );
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
