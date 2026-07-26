import React from "react";
import { useToast } from "../../contexts/ToastContext";
import noteService from "../../services/noteService"; // Changed: uses noteService.getAll()
import { extractList, extractTotalPages } from "../../utils/extractData";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Empty from "../../components/ui/Empty";
import Pagination from "../../components/ui/Pagination";

export default function AdminNotesPage() {
    const toast = useToast();

    const [notes, setNotes] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(true);

    const fetchNotes = async (p) => {
        setLoading(true);
        try {
            const data = await noteService.getAll(p); // /notes/all
            const list = extractList(data);
            setNotes(list);
            setTotalPages(extractTotalPages(data, list.length));
            setPage(p);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotes(1);
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
                All Notes <Badge variant="admin">Admin</Badge>
            </h2>
            {loading ? (
                <Spinner />
            ) : notes.length === 0 ? (
                <Empty />
            ) : (
                <div className="space-y-3">
                    {notes.map((note) => (
                        <Card key={note._id}>
                            <h3 className="text-base font-medium mb-1">
                                {note.title}
                            </h3>
                            <p className="text-sm text-[#a3a3a3] whitespace-pre-wrap line-clamp-3">
                                {note.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="orange">
                                    {note.author?.name ||
                                        note.author?.email ||
                                        "Unknown"}
                                </Badge>
                                <span className="text-xs text-[#525252]">
                                    {new Date(
                                        note.createdAt,
                                    ).toLocaleDateString()}
                                </span>
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
