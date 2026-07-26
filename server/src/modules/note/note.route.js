import express from "express";
import noteController from "./note.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
    createNoteValidation,
    updateNoteValidation,
    noteIdParamValidation,
} from "./note.validation.js";
import { UserRole } from "../../utils/role.enum.js";

const noteRoutes = express.Router();

noteRoutes.use(protect);

noteRoutes.post(
    "/create",
    validate(createNoteValidation),
    noteController.createNote,
);

noteRoutes.get("/my-notes", noteController.getMyNotes);

// Admin: view everyone's notes
noteRoutes.get("/all", restrictTo(UserRole.Admin), noteController.getAllNotes);

noteRoutes.get(
    "/:id",
    validate(noteIdParamValidation),
    noteController.getNoteById,
);

noteRoutes.patch(
    "/:id",
    validate(updateNoteValidation),
    noteController.updateNote,
);

noteRoutes.delete(
    "/:id",
    validate(noteIdParamValidation),
    noteController.deleteNote,
);

export default noteRoutes;
