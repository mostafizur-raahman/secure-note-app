import postRepository from "./post.repository.js";
import ApiError from "../../utils/error.js";
import { UserRole } from "../../utils/role.enum.js";

const createPost = async (postData, userId) => {
    const newPost = await postRepository.createPost({
        ...postData,
        createdBy: userId,
    });

    return {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        createdBy: newPost.createdBy,
        createdAt: newPost.createdAt,
    };
};

const getAllPosts = async (query) => {
    const { data: posts, meta } = await postRepository.findAllPosts(query);

    return {
        meta,
        posts: posts.map((p) => ({
            id: p._id,
            title: p.title,
            content: p.content,
            author: p.createdBy,
            createdAt: p.createdAt,
        })),
    };
};

const getPostById = async (postId) => {
    const post = await postRepository.findPostById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    return {
        id: post._id,
        title: post.title,
        content: post.content,
        author: post.createdBy,
        createdAt: post.createdAt,
    };
};

const updatePost = async (postId, updateData, userId, userRole) => {
    const post = await postRepository.findPostById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    if (
        userRole !== UserRole.Admin &&
        post.createdBy._id.toString() !== userId
    ) {
        throw new ApiError(403, "You can only update your own posts");
    }

    const updated = await postRepository.updatePostById(postId, updateData);
    return {
        id: updated._id,
        title: updated.title,
        content: updated.content,
        updatedAt: updated.updatedAt,
    };
};

const deletePost = async (postId, userId, userRole) => {
    const post = await postRepository.findPostById(postId);
    if (!post) throw new ApiError(404, "Post not found");

    if (
        userRole !== UserRole.Admin &&
        post.createdBy._id.toString() !== userId
    ) {
        throw new ApiError(403, "You can only delete your own posts");
    }

    await postRepository.deletePostById(postId);
    return { message: "Post deleted successfully" };
};

const getPostsByUser = async (userId, query) => {
    const { data: posts, meta } = await postRepository.getPostsByUserWithLookup(
        userId,
        query,
    );

    return {
        meta,
        posts,
    };
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByUser,
};
