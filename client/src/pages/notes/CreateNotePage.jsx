import { useState } from "react";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import noteService from "../../services/noteService";
import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Button";
import Field from "../../components/ui/Input";
import Area from "../../components/ui/TextArea";

export default function CreateNotePage() {
    const router = useRouter();
    const toast = useToast();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await noteService.create({ title, content });
            toast.success("Note created!");
            router.navigate("my-notes");
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                Create Note
            </h2>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Note title"
                        required
                    />
                    <Area
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note..."
                        rows={6}
                        required
                    />
                    <div className="flex gap-3 justify-end">
                        <Btn
                            variant="secondary"
                            onClick={() => router.navigate("my-notes")}>
                            Cancel
                        </Btn>
                        <Btn variant="primary" disabled={loading} type="submit">
                            {loading ? "Creating..." : "Create Note"}
                        </Btn>
                    </div>
                </form>
            </Card>
        </div>
    );
}
