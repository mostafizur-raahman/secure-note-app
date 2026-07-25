import postModel from "./models/post.model.js";
import { getPagination, getPaginationMeta } from "../../utils/pagination.js";
import mongoose from "mongoose";

const createPost = async (postData) => {
    return await postModel.create(postData);
};

const findPostById = async (id) => {
    return await postModel.findById(id).populate("createdBy", "name email");
};

const findAllPosts = async (query = {}) => {
    const { page, limit, skip } = getPagination(query);

    const [posts, total] = await Promise.all([
        postModel
            .find()
            .sort(query.sort || "-createdAt")
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email"),
        postModel.countDocuments(),
    ]);

    return {
        data: posts,
        meta: getPaginationMeta({ page, limit, total }),
    };
};

const updatePostById = async (id, updateData) => {
    return await postModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deletePostById = async (id) => {
    return await postModel.findByIdAndDelete(id);
};

const getPostsByUserWithLookup = async (userId, query = {}) => {
    const { page, limit, skip } = getPagination(query);

    const pipeline = [
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "author",
            },
        },
        { $unwind: "$author" },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "author.id": "$author._id",
                "author.name": 1,
                "author.email": 1,
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $facet: {
                data: [{ $skip: skip }, { $limit: limit }],
                totalCount: [{ $count: "count" }],
            },
        },
    ];

    const [result] = await postModel.aggregate(pipeline);
    const posts = result.data;
    const total = result.totalCount[0]?.count || 0;

    return {
        data: posts,
        meta: getPaginationMeta({ page, limit, total }),
    };
};

export default {
    createPost,
    findPostById,
    findAllPosts,
    updatePostById,
    deletePostById,
    getPostsByUserWithLookup,
};
