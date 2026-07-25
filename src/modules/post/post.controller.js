import postService from "./post.service.js";

export const createPost = async (req, res, next) => {
    try {
        const post = await postService.createPost(req.body, req.user.id);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPosts = async (req, res, next) => {
    try {
        const data = await postService.getAllPosts(req.query);
        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const post = await postService.updatePost(
            req.params.id,
            req.body,
            req.user.id,
        );
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ── $lookup endpoint ──
export const getPostsByUser = async (req, res, next) => {
    try {
        const data = await postService.getPostsByUser(
            req.params.userId,
            req.query,
        );
        res.status(200).json({
            success: true,
            ...data,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
};
