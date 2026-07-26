import noteModel from "./models/note.model.js";
import { getPagination, getPaginationMeta } from "../../utils/pagination.js";

const createNote = async (noteData) => {
    return await noteModel.create(noteData);
};

const findNoteById = async (id) => {
    return await noteModel.findOne({ _id: id, isDeleted: false });
};

const findNotesByUser = async (userId, query = {}) => {
    const { page, limit, skip } = getPagination(query);
    const filter = { createdBy: userId, isDeleted: false };

    const [notes, total] = await Promise.all([
        noteModel
            .find(filter)
            .sort(query.sort || "-createdAt")
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email"),
        noteModel.countDocuments(filter),
    ]);

    return {
        data: notes,
        meta: getPaginationMeta({ page, limit, total }),
    };
};

const findAllNotes = async (query = {}) => {
    const { page, limit, skip } = getPagination(query);
    const filter = { isDeleted: false };

    const [notes, total] = await Promise.all([
        noteModel
            .find(filter)
            .sort(query.sort || "-createdAt")
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .populate("updatedBy", "name email"),
        noteModel.countDocuments(filter),
    ]);

    return {
        data: notes,
        meta: getPaginationMeta({ page, limit, total }),
    };
};

const updateNoteById = async (id, updateData) => {
    return await noteModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updateData,
        { new: true, runValidators: true },
    );
};

const softDeleteNoteById = async (id) => {
    return await noteModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
    );
};

export default {
    createNote,
    findNoteById,
    findNotesByUser,
    findAllNotes,
    updateNoteById,
    softDeleteNoteById,
};
