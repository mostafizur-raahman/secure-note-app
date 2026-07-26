import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import postService from "../../services/postService";
import { extractList, extractTotalPages } from "../../utils/extractData";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Btn from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function HomePage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [posts, setPosts] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [deleteId, setDeleteId] = React.useState(null);

    const fetchPosts = async (p) => {
        setLoading(true);
        try {
            const data = await postService.list(p);
            const list = extractList(data);
            setPosts(list);
            // Pass currentPage so pagination never disappears on page 2+
            setTotalPages(extractTotalPages(data, list.length, p));
            setPage(p);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await postService.del(deleteId);
            toast.success("Post deleted!");
            setDeleteId(null);
            fetchPosts(page);
        } catch (err) {
            toast.error(err.message);
            setDeleteId(null);
        }
    };

    React.useEffect(() => {
        fetchPosts(1);
    }, []);

    const isMyPost = (post) => {
        const myId = auth.user?.id || auth.user?._id;
        const authorId = post.author?.id || post.author?._id;
        return myId === authorId;
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                    Posts Feed
                </h2>
                <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => router.navigate("create-post")}>
                    + New Post
                </Btn>
            </div>

            {deleteId && (
                <ConfirmModal
                    title="Delete Post"
                    message="Are you sure you want to delete this post?"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            {loading ? (
                <Spinner />
            ) : posts.length === 0 ? (
                <Empty message="No posts yet. Create one!" />
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post._id || post.id}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="text-base font-medium mb-1">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-[#a3a3a3] whitespace-pre-wrap">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <Badge variant="orange">
                                            {post.author?.name ||
                                                post.author?.email ||
                                                "Unknown"}
                                        </Badge>
                                        <span className="text-xs text-[#525252]">
                                            {new Date(
                                                post.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {isMyPost(post) && (
                                    <div className="flex gap-1">
                                        <Btn
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.navigate("edit-post", {
                                                    postId: post._id || post.id,
                                                })
                                            }>
                                            Edit
                                        </Btn>
                                        <Btn
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteId(post._id || post.id)
                                            }>
                                            <span className="text-red-400">
                                                Del
                                            </span>
                                        </Btn>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={fetchPosts}
            />
        </div>
    );
}
