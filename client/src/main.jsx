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

    if (!auth.user) {
        if (router.page === "register") return <RegisterPage />;
        return <LoginPage />;
    }

    // Admin → go to dashboard by default, User → go to home
    if (router.page === "home" && auth.isAdmin) {
        // Optional: admin home redirects to dashboard
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
