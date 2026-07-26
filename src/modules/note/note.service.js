import noteRepository from "./note.repository.js";
import ApiError from "../../utils/error.js";
import { UserRole } from "../../utils/role.enum.js";

const createNote = async (noteData, userId) => {
    const newNote = await noteRepository.createNote({
        ...noteData,
        createdBy: userId,
        updatedBy: userId,
    });

    return {
        id: newNote._id,
        title: newNote.title,
        content: newNote.content,
        createdBy: newNote.createdBy,
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt,
    };
};

const getMyNotes = async (userId, query) => {
    const { data: notes, meta } = await noteRepository.findNotesByUser(
        userId,
        query,
    );

    return {
        meta,
        notes: notes.map((n) => ({
            id: n._id,
            title: n.title,
            content: n.content,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
        })),
    };
};

const getAllNotes = async (query) => {
    const { data: notes, meta } = await noteRepository.findAllNotes(query);

    return {
        meta,
        notes: notes.map((n) => ({
            id: n._id,
            title: n.title,
            content: n.content,
            owner: n.createdBy,
            createdAt: n.createdAt,
            updatedAt: n.updatedAt,
        })),
    };
};

const getNoteById = async (noteId, userId, userRole, isAdmin) => {
    const note = await noteRepository.findNoteById(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    if (!isAdmin && note.createdBy.toString() !== userId) {
        throw new ApiError(403, "You do not have access to this note");
    }

    return {
        id: note._id,
        title: note.title,
        content: note.content,
        createdBy: note.createdBy,
        updatedBy: note.updatedBy,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
    };
};

const updateNote = async (noteId, updateData, userId, userRole) => {
    const note = await noteRepository.findNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");

    if (
        userRole !== UserRole.Admin &&
        note.createdBy._id.toString() !== userId
    ) {
        throw new ApiError(403, "You can only update your own notes");
    }

    const updated = await noteRepository.updateNoteById(noteId, updateData);
    return updated;
};

const deleteNote = async (noteId, userId, userRole) => {
    const note = await noteRepository.findNoteById(noteId);
    if (!note) throw new ApiError(404, "Note not found");

    if (
        userRole !== UserRole.Admin &&
        note.createdBy._id.toString() !== userId
    ) {
        throw new ApiError(403, "You can only delete your own notes");
    }

    await noteRepository.softDeleteNoteById(noteId);
    return { message: "Note deleted successfully" };
};

export default {
    createNote,
    getMyNotes,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
};
