import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "../../contexts/RouterContext";
import { useToast } from "../../contexts/ToastContext";
import noteService from "../../services/noteService";
import { extractList, extractTotalPages } from "../../utils/extractData";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Btn from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";
import Pagination from "../../components/ui/Pagination";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function AdminNotesPage() {
    const auth = useAuth();
    const router = useRouter();
    const toast = useToast();

    const [notes, setNotes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchNotes = async (p) => {
        setLoading(true);
        try {
            const data = await noteService.getAll(p);
            const list = extractList(data);
            setNotes(list);
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
            await noteService.del(deleteId);
            toast.success("Note deleted!");
            setDeleteId(null);
            fetchNotes(page);
        } catch (err) {
            toast.error(err.message);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        fetchNotes(1);
    }, []);

    // Backend uses "owner" field for note author
    const getAuthorName = (note) => {
        if (note.owner?.name) return note.owner.name;
        if (note.owner?.email) return note.owner.email;
        if (note.author?.name) return note.author.name;
        if (note.createdBy?.name) return note.createdBy.name;
        return "Unknown";
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                All Notes <Badge variant="admin">Admin</Badge>
            </h2>

            {deleteId && (
                <ConfirmModal
                    title="Delete Note"
                    message="Are you sure you want to delete this note?"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}

            {loading ? (
                <Spinner />
            ) : notes.length === 0 ? (
                <Empty />
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <Card key={note.id || note._id}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h3 className="text-base font-medium mb-1">
                                        {note.title}
                                    </h3>
                                    <p className="text-sm text-[#a3a3a3] whitespace-pre-wrap line-clamp-3">
                                        {note.content}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="orange">
                                            {getAuthorName(note)}
                                        </Badge>
                                        <span className="text-xs text-[#525252]">
                                            {new Date(
                                                note.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <Btn
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.navigate("edit-note", {
                                                noteId: note.id || note._id,
                                            })
                                        }>
                                        Edit
                                    </Btn>
                                    <Btn
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setDeleteId(note.id || note._id)
                                        }>
                                        <span className="text-red-400">
                                            Del
                                        </span>
                                    </Btn>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={fetchNotes}
            />
        </div>
    );
}
