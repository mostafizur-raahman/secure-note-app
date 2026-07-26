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
import UserPostsPage from "./pages/posts/UserPostsPage";
import MyNotesPage from "./pages/notes/MyNotesPage";
import CreateNotePage from "./pages/notes/CreateNotePage";
import EditNotePage from "./pages/notes/EditNotePage";
import AdminNotesPage from "./pages/admin/AdminNotesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAddUserPage from "./pages/admin/AdminAddUserPage";
import AdminEditUserPage from "./pages/admin/AdminEditUserPage";
import InterestGroupsPage from "./pages/admin/InterestGroupsPage";
import DashboardPage from "./pages/admin/DashboardPage";

// Pages that require authentication
const authRequiredPages = [
    "create-post",
    "edit-post",
    "my-notes",
    "create-note",
    "edit-note",
    "dashboard",
    "admin-notes",
    "admin-users",
    "admin-add-user",
    "admin-edit-user",
    "interest-groups",
    "user-posts",
];

const pageMap = {
    home: HomePage,
    "create-post": CreatePostPage,
    "edit-post": EditPostPage,
    "user-posts": UserPostsPage,
    "my-notes": MyNotesPage,
    "create-note": CreateNotePage,
    "edit-note": EditNotePage,
    dashboard: DashboardPage,
    "admin-notes": AdminNotesPage,
    "admin-users": AdminUsersPage,
    "admin-add-user": AdminAddUserPage,
    "admin-edit-user": AdminEditUserPage,
    "interest-groups": InterestGroupsPage,
};

function App() {
    const auth = useAuth();
    const router = useRouter();

    // Auth pages (login/register) — always accessible
    if (router.page === "login") return <LoginPage />;
    if (router.page === "register") return <RegisterPage />;

    // Public pages — accessible without login
    if (router.page === "home") {
        return (
            <div className="min-h-screen">
                <Navbar />
                <main>
                    <HomePage />
                </main>
            </div>
        );
    }

    // Auth-required pages — need to be logged in
    if (!auth.user) {
        // Redirect to login, saving intended destination
        router.requireAuth(router.page, router.params);
        return <LoginPage />;
    }

    // Logged in — show full app
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
