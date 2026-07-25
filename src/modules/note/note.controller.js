import noteService from "./note.service.js";

export const createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyNotes = async (req, res, next) => {
    try {
        const data = await noteService.getMyNotes(req.user.id, req.query);
        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllNotes = async (req, res, next) => {
    try {
        const data = await noteService.getAllNotes(req.query);
        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

export const getNoteById = async (req, res, next) => {
    try {
        const note = await noteService.getNoteById(
            req.params.id,
            req.user.id,
            req.user.role,
            req.user.role === "ADMIN",
        );
        res.status(200).json({
            success: true,
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const updateNote = async (req, res, next) => {
    try {
        const note = await noteService.updateNote(
            req.params.id,
            req.body,
            req.user.id,
        );
        res.status(200).json({
            success: true,
            message: "Note updated successfully",
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        await noteService.deleteNote(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createNote,
    getMyNotes,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
};
