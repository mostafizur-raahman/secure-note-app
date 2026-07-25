import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

// Indexes for required queries
noteSchema.index({ createdBy: 1, isDeleted: 1, createdAt: -1 }); // User listing own notes
noteSchema.index({ isDeleted: 1, createdAt: -1 }); // Admin listing all notes

const Note = mongoose.model("Notes", noteSchema);
export default Note;
