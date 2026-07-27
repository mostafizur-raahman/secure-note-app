import userModel from "../user/models/user.model.js";
import postModel from "../post/models/post.model.js";
import { UserRole } from "../../utils/role.enum.js";

const seedData = async () => {
    try {
        console.log("Seeder: Checking data...");

        const usersToSeed = [
            {
                name: "Super Admin",
                email: "admin@gmail.com",
                password: "admin123",
                role: UserRole.Admin,
                interests: ["management", "reading", "tech"],
            },
            {
                name: "Mostafizur Rahman",
                email: "user@gmail.com",
                password: "user123",
                role: UserRole.User,
                interests: ["coding", "gaming", "music"],
            },
            {
                name: "Md Alamin",
                email: "user1@gmail.com",
                password: "user123",
                role: UserRole.User,
                interests: ["coding", "reading", "travel"],
            },
        ];

        const seededUsers = [];

        for (const userData of usersToSeed) {
            const exists = await userModel.findOne({ email: userData.email });
            if (exists) {
                console.log(`Skipped: ${userData.email} already exists`);
                seededUsers.push(exists);
            } else {
                const newUser = await userModel.create(userData);
                console.log(`Created: ${newUser.email} (${newUser.role})`);
                seededUsers.push(newUser);
            }
        }

        const postExists = await postModel.findOne();
        if (postExists) {
            console.log("Skipped: Posts already exist");
        } else {
            const [admin, user, user1] = seededUsers;

            const posts = [
                {
                    title: "Getting Started with Node.js",
                    content:
                        "Node.js is a JavaScript runtime built on Chrome's V8 engine...",
                    createdBy: user._id,
                },
                {
                    title: "MongoDB Best Practices",
                    content:
                        "Always index your queries and use aggregation pipelines wisely...",
                    createdBy: user._id,
                },
                {
                    title: "Understanding JWT Authentication",
                    content:
                        "JSON Web Tokens provide a stateless authentication mechanism...",
                    createdBy: user1._id,
                },
                {
                    title: "REST API Design Guidelines",
                    content:
                        "Use proper HTTP methods, status codes, and versioning...",
                    createdBy: admin._id,
                },
                {
                    title: "Docker for Beginners",
                    content:
                        "Containers allow you to package applications with dependencies...",
                    createdBy: user._id,
                },
            ];

            await postModel.insertMany(posts);
            console.log(`Created ${posts.length} posts`);
        }

        console.log("Seeder successfully done...");
    } catch (error) {
        console.error("Seeder failed:", error.message);
    }
};

export default seedData;
