import React from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import postService from "../../services/postService";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Field from "../../components/ui/Input";
import Area from "../../components/ui/TextArea";

export default function CreatePostPage() {
    const router = useRouter();
    const toast = useToast();

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await postService.create({ title, content });
            toast.success("Post created!");
            router.navigate("home");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Create Post
            </h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        required
                    />
                    <Area
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post..."
                        rows={6}
                        required
                    />
                    <div className="flex gap-3 justify-end">
                        <Btn
                            variant="secondary"
                            onClick={() => router.navigate("home")}>
                            Cancel
                        </Btn>
                        <Btn variant="primary" disabled={loading} type="submit">
                            {loading ? "Creating..." : "Create Post"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </div>
    );
}
