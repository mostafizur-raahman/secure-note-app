import userModel from "./models/user.model.js";
import { getPagination, getPaginationMeta } from "../../utils/pagination.js";

const createUser = async (userData) => {
    return await userModel.create(userData);
};

const findUserByEmail = async (email) => {
    return await userModel.findOne({ email }).select("+password");
};

const findUserById = async (id) => {
    return await userModel.findById(id).select("-password");
};

const findAllUsers = async (filter = {}, query = {}) => {
    const { page, limit, skip } = getPagination(query);

    const [users, total] = await Promise.all([
        userModel
            .find(filter)
            .select("-password")
            .sort(query.sort || "-createdAt")
            .skip(skip)
            .limit(limit),
        userModel.countDocuments(filter),
    ]);

    return {
        data: users,
        meta: getPaginationMeta({ page, limit, total }),
    };
};

const findAllWithoutAdmin = async (query = {}) => {
    return await findAllUsers({ role: { $ne: "ADMIN" } }, query);
};

const updateUserById = async (id, updateData) => {
    return await userModel
        .findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
        .select("-password");
};

const findByIdWithoutPassword = async (id) => {
    return await userModel.findById(id).select("-password");
};

const deleteUserById = async (id) => {
    return await userModel.findByIdAndDelete(id);
};

const softDeleteUserById = async (id) => {
    return await userModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
    );
};

// Aggregation: Group users by interests
const getUsersGroupedByInterests = async () => {
    return await userModel.aggregate([
        { $match: { interests: { $exists: true, $ne: [] } } },
        { $unwind: "$interests" },
        {
            $group: {
                _id: "$interests",
                users: {
                    $push: {
                        id: "$_id",
                        name: "$name",
                        email: "$email",
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        {
            $project: {
                _id: 0,
                interest: "$_id",
                count: 1,
                users: 1,
            },
        },
    ]);
};

export default {
    createUser,
    findUserById,
    findUserByEmail,
    findAllUsers,
    findAllWithoutAdmin,
    updateUserById,
    deleteUserById,
    softDeleteUserById,
    findByIdWithoutPassword,
    getUsersGroupedByInterests,
};
