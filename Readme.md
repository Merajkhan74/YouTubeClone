# YouTube — Backend 

A backend REST API for a video-sharing platform, inspired by YouTube. Built with **Node.js, Express, and MongoDB**, it implements secure JWT-based authentication, cloud file uploads, and MongoDB aggregation pipelines for features like subscriber counts and watch history.

## Features

- **User Authentication**
  - Register with avatar & cover image upload
  - Login / Logout
  - JWT access token + refresh token strategy
  - Change password
  - Update account details, avatar, and cover image
- **Channel & Watch History**
  - Get channel profile with subscriber count (via MongoDB aggregation)
  - Get watch history with populated video & owner details
- **Secure Sessions**
  - Passwords hashed with bcrypt
  - Tokens stored in httpOnly cookies
  - Refresh token stored in DB for session control

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| File Storage | Multer (local temp) + Cloudinary (cloud) |
| Other | cookie-parser, cors, dotenv |

## Project Structure

```
src/
├── controllers/     # Request handlers / business logic
├── db/               # MongoDB connection setup
├── middlewares/      # Auth (JWT verification) & Multer upload middleware
├── models/            # Mongoose schemas (User, Video, Comment, Like, Playlist, Subscription, Tweet)
├── routes/            # API route definitions
├── utils/             # ApiError, ApiResponse, asyncHandle wrapper, Cloudinary upload helper
├── index.js           # Application entry point
└── aap.js             # Express app configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/Merajkhan74/YouTubeClone.git
cd YouTubeClone

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory with the following:


### Running the Server

```bash
npm run dev
```

The server will start on `http://localhost:8000` (or the port specified in `.env`).

## API Endpoints

Base path: `/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/register` | Register a new user (with avatar & cover image) | No |
| POST | `/login` | Log in a user | No |
| POST | `/logout` | Log out the current user | Yes |
| POST | `/refresh-Token` | Get a new access token using refresh token | No |
| POST | `/change-password` | Change the current user's password | Yes |
| GET | `/current-user` | Get the currently logged-in user | Yes |
| PATCH | `/update-account-details` | Update full name and email | Yes |
| PATCH | `/update-avatar` | Update user avatar | Yes |
| PATCH | `/update-cover-image` | Update user cover image | Yes |
| GET | `/c/:userName` | Get a channel's public profile (with subscriber count) | Yes |
| GET | `/watch-history` | Get the logged-in user's watch history | Yes |

## Data Models

The project defines schemas for the core entities of a video platform:

- **User** — profile, credentials, watch history
- **Video** — video metadata (title, description, duration, views)
- **Comment** — comments on videos
- **Like** — likes on videos, comments, and tweets
- **Playlist** — user-created playlists of videos
- **Subscription** — subscriber-to-channel relationships
- **Tweet** — short text posts (community-style updates)

> **Note:** Currently, only the **User** module has complete controllers and routes. Models for Video, Comment, Like, Playlist, Subscription, and Tweet are defined, and their corresponding controllers/routes are planned for future development.

## Roadmap

- [ ] Video upload, listing, update, and delete endpoints
- [ ] Comment CRUD endpoints
- [ ] Like/unlike endpoints for videos, comments, and tweets
- [ ] Playlist management endpoints
- [ ] Subscribe/unsubscribe endpoint
- [ ] Tweet CRUD endpoints
- [ ] Input validation middleware (e.g., Zod/Joi)
- [ ] API documentation (Postman collection / Swagger)

## License

ISC
