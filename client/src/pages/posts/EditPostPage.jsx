import React, { useState } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import postService from "../../services/postService";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Field from "../../components/ui/Input";
import Area from "../../components/ui/TextArea";
import Spinner from "../../components/ui/Spinner";

export default function EditPostPage() {
    const router = useRouter();
    const toast = useToast();
    const postId = router.params.postId;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    React.useEffect(() => {
        if (!postId) {
            router.navigate("home");
            return;
        }
        postService
            .get(postId)
            .then((response) => {
                // Handle { success, data: { ... } } format
                const post = response.data?.post || response.data || response;
                setTitle(post.title || "");
                setContent(post.content || "");
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                router.navigate("home");
            });
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await postService.update(postId, { title, content });
            toast.success("Post updated!");
            router.navigate("home");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Edit Post
            </h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Area
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        required
                    />
                    <div className="flex gap-3 justify-end">
                        <Btn
                            variant="secondary"
                            onClick={() => router.navigate("home")}>
                            Cancel
                        </Btn>
                        <Btn variant="primary" disabled={saving} type="submit">
                            {saving ? "Saving..." : "Save Changes"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </div>
    );
}
