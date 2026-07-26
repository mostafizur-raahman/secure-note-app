import { useState, useEffect } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import postService from "../../services/postService";
import { extractList } from "../../utils/extractData";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";

export default function UserPostsPage() {
    const router = useRouter();
    const toast = useToast();
    const userId = router.params.userId;

    const [posts, setPosts] = useState([]);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            router.navigate("home");
            return;
        }
        postService
            .getByUser(userId)
            .then((response) => {
                setPosts(extractList(response));
                const data = response.data || response;
                setUserName(data.user?.name || data.userName || userId);
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
            });
    }, [userId]);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                    Posts by <span className="text-[#f97316]">{userName}</span>
                </h2>
                <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() => router.navigate("home")}>
                    ← Back
                </Btn>
            </div>
            <p className="text-xs text-[#a3a3a3] mb-4">
                MongoDB Aggregation — $lookup pipeline joining posts with user
                collection
            </p>

            {loading ? (
                <Spinner />
            ) : posts.length === 0 ? (
                <Empty message="No posts from this user" />
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post._id || post.id}>
                            <h3 className="text-base font-medium mb-1">
                                {post.title}
                            </h3>
                            <p className="text-sm text-[#a3a3a3] whitespace-pre-wrap">
                                {post.content}
                            </p>
                            <span className="text-xs text-[#525252] mt-2 block">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
