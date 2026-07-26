import express from "express";
import postController from "./post.controller.js";
import { protect } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
    createPostValidation,
    updatePostValidation,
    postIdParamValidation,
    userIdParamValidation,
} from "./post.validation.js";

const postRoutes = express.Router();

postRoutes.get("/", postController.getAllPosts);
postRoutes.get(
    "/:id",
    validate(postIdParamValidation),
    postController.getPostById,
);

postRoutes.get(
    "/user/:userId",
    validate(userIdParamValidation),
    postController.getPostsByUser,
);

postRoutes.use(protect);

postRoutes.post(
    "/create",
    validate(createPostValidation),
    postController.createPost,
);

postRoutes.patch(
    "/:id",
    validate(updatePostValidation),
    postController.updatePost,
);

postRoutes.delete(
    "/:id",
    validate(postIdParamValidation),
    postController.deletePost,
);

export default postRoutes;
