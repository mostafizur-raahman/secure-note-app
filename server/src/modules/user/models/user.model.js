import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserRole } from "../../../utils/role.enum.js";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
            minlength: [6, "Password must be at least 6 characters"],
        },
        role: { type: String, enum: UserRole, default: UserRole.User },
        interests: [{ type: String, trim: true }],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null },
    },
    { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } },
);
userSchema.index({ interests: 1 });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("Users", userSchema);
export default userModel;
