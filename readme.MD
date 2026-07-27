# Secure Note App

A REST API for a secure note-taking platform with role-based access control, JWT authentication, and MongoDB aggregation pipelines.

## Tech Stack

- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Logging:** Winston + Morgan
- **Containerization:** Docker & Docker Compose

## Features

### Authentication

- User registration & login with bcrypt password hashing
- JWT-based stateless authentication
- Token expiry configuration

### Roles & Permissions

| Role      | Capabilities                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **User**  | Create, read, update, delete own notes. Create, update, delete own posts. View public posts. Update own profile (except email). |
| **Admin** | All User capabilities + manage all users (CRUD), view everyone's notes, view interest-based user aggregations.                  |

### Modules

- **Auth:** Register / Login
- **Users:** Profile management, admin user CRUD, soft delete, pagination
- **Notes:** Private note-taking with ownership enforcement, soft delete, pagination
- **Posts:** Public posts visible to everyone, owner-based edit/delete, `$lookup` aggregation

### Aggregation Scenarios

1. **Group by Interests** — `GET /users/interests/grouped`  
   Groups all users by their interests using a single `aggregate()` call.
2. **User Posts ($lookup)** — `GET /posts/user/:userId`  
   Retrieves all posts by a specific user using `$lookup` to join the `Users` collection.

### Optimizations

- Pagination on all list endpoints (`page`, `limit`, `sort`)
- Idempotent database seeder (runs on startup, skips if data exists)

---

## Project Structure

```
secure-note-app/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── envConfig.js         # Environment config loader
│   │   └── logger.js            # Winston logger setup
│   ├── middleware/
│   │   ├── auth.js              # JWT protect + role restrict
│   │   ├── errorHandler.js      # Global error handler (Mongoose + custom)
│   │   └── validate.js          # express-validator wrapper
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.route.js
│   │   │   └── auth.validation.js
│   │   ├── user/
│   │   │   ├── models/
│   │   │   │   └── user.model.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.repository.js
│   │   │   ├── user.service.js
│   │   │   ├── user.route.js
│   │   │   └── user.validation.js
│   │   ├── note/
│   │   │   ├── models/
│   │   │   │   └── note.model.js
│   │   │   ├── note.controller.js
│   │   │   ├── note.repository.js
│   │   │   ├── note.service.js
│   │   │   ├── note.route.js
│   │   │   └── note.validation.js
│   │   ├── post/
│   │   │   ├── models/
│   │   │   │   └── post.model.js
│   │   │   ├── post.controller.js
│   │   │   ├── post.repository.js
│   │   │   ├── post.service.js
│   │   │   ├── post.route.js
│   │   │   └── post.validation.js
│   │   └── seeder/
│   │       └── seeder.js        # Idempotent startup seeder
│   ├── utils/
│   │   ├── error.js             # ApiError custom class
│   │   ├── pagination.js        # Reusable pagination helper
│   │   └── role.enum.js         # USER, ADMIN enum
│   └── app.js                   # Express app setup
├── server.js                    # Entry point
├── .env                         # Environment variables
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Setup

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.sample .env

# 3. Start MongoDB locally (or use Docker for Mongo only)
# Make sure DATABASE_URL=mongodb://localhost:27017/secure-note

# 4. Run the server
npm run dev
```

### Docker (Full Stack)

```bash
# Build and run all services
docker-compose up --build

```

### Environment Variables

| Variable         | Description               | Example                                 |
| ---------------- | ------------------------- | --------------------------------------- |
| `PORT`           | Server port               | `8080`                                  |
| `DATABASE_URL`   | MongoDB connection string | `mongodb://localhost:27017/secure-note` |
| `JWT_SECRET`     | Secret for signing JWTs   | `your_secret_key`                       |
| `JWT_EXPIRES_IN` | Token expiry              | `1d`                                    |
| `NODE_ENV`       | Environment mode          | `development`, `production`             |

> **Docker Note:** Use `mongodb://mongo:27017/secure-note` inside containers. `localhost` won't work because each container has its own network namespace.

---

## API Endpoints

### Auth

| Method | Endpoint                | Auth | Body                                    |
| ------ | ----------------------- | ---- | --------------------------------------- |
| `POST` | `/api/v1/auth/register` | No   | `{ name, email, password, interests? }` |
| `POST` | `/api/v1/auth/login`    | No   | `{ email, password }`                   |

### Users

| Method   | Endpoint                          | Auth | Role  | Description                    |
| -------- | --------------------------------- | ---- | ----- | ------------------------------ |
| `GET`    | `/api/v1/users/me`                | ✅   | Any   | Get my profile                 |
| `PATCH`  | `/api/v1/users/me`                | ✅   | Any   | Update profile (no email/role) |
| `GET`    | `/api/v1/users`                   | ✅   | Admin | List all users (paginated)     |
| `POST`   | `/api/v1/users`                   | ✅   | Admin | Create user                    |
| `PUT`    | `/api/v1/users/:id`               | ✅   | Admin | Update any user                |
| `DELETE` | `/api/v1/users/:id`               | ✅   | Admin | Soft delete user               |
| `GET`    | `/api/v1/users/interests/grouped` | ✅   | Admin | Group users by interests       |

**Query params for lists:** `?page=1&limit=10&sort=-createdAt`

### Notes

| Method   | Endpoint                 | Auth | Role  | Description                   |
| -------- | ------------------------ | ---- | ----- | ----------------------------- |
| `POST`   | `/api/v1/notes`          | ✅   | Any   | Create note                   |
| `GET`    | `/api/v1/notes/my-notes` | ✅   | Any   | List my notes                 |
| `GET`    | `/api/v1/notes/all`      | ✅   | Admin | List everyone's notes         |
| `GET`    | `/api/v1/notes/:id`      | ✅   | Any   | Get single note (owner/admin) |
| `PATCH`  | `/api/v1/notes/:id`      | ✅   | Any   | Update my note                |
| `DELETE` | `/api/v1/notes/:id`      | ✅   | Any   | Soft delete my note           |

### Posts

| Method   | Endpoint                     | Auth | Description                   |
| -------- | ---------------------------- | ---- | ----------------------------- |
| `GET`    | `/api/v1/posts`              | No   | List all public posts         |
| `GET`    | `/api/v1/posts/:id`          | No   | Get single post               |
| `GET`    | `/api/v1/posts/user/:userId` | No   | Get posts by user (`$lookup`) |
| `POST`   | `/api/v1/posts`              | ✅   | Create post                   |
| `PATCH`  | `/api/v1/posts/:id`          | ✅   | Update my post                |
| `DELETE` | `/api/v1/posts/:id`          | ✅   | Delete my post                |

### Health

| Method | Endpoint  | Auth | Description         |
| ------ | --------- | ---- | ------------------- |
| `GET`  | `/health` | No   | Server health check |

---

## Seeded Credentials

On first server start, the idempotent seeder creates default data:

| Role  | Email             | Password   |
| ----- | ----------------- | ---------- |
| Admin | `admin@gmail.com` | `admin123` |
| User  | `user@gmail.com`  | `user123`  |
| User  | `user1@gmail.com` | `user123`  |

The seeder checks if data already exists and skips if it does, so it's safe to restart the server.

---

## Response Format

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated List

```json
{
  "success": true,
  "users": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 47,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error

```json
{
    "success": false,
    "status": "fail",
    "message": "Validation failed",
    "errors": [{ "field": "email", "message": "Valid email is required" }]
}
```

---

## Indexes

| Collection | Index                                           | Purpose                        |
| ---------- | ----------------------------------------------- | ------------------------------ |
| `Users`    | `{ email: 1 }`                                  | Login, uniqueness              |
| `Users`    | `{ role: 1 }`                                   | Admin queries, filtering       |
| `Users`    | `{ createdAt: -1 }`                             | Pagination sorting             |
| `Users`    | `{ interests: 1 }`                              | Aggregation group by interests |
| `Users`    | `{ isDeleted: 1 }`                              | Soft-delete filtering          |
| `Notes`    | `{ createdBy: 1, isDeleted: 1, createdAt: -1 }` | User listing own notes         |
| `Notes`    | `{ isDeleted: 1, createdAt: -1 }`               | Admin listing all notes        |
| `Posts`    | `{ createdBy: 1, createdAt: -1 }`               | User posts query + `$lookup`   |

---

## Scripts

```bash
npm run dev      # Start with nodemon
npm start        # Start production
```

---

## License

MIT
"""

with open("/mnt/agents/output/README.md", "w") as f:
f.write(readme_content)

print("README.md saved successfully")
