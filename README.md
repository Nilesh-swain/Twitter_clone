# Twitter Clone

A full-stack Twitter clone built with React and Node.js.

## Features

- User authentication (signup/login)
- Create and view posts
- Like posts
- Comment on posts
- Follow/unfollow users
- Notifications
- Responsive design

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image uploads
- bcrypt for password hashing

### Frontend

- React 19
- React Router
- Tailwind CSS
- DaisyUI
- React Icons

## Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:

```env
MONGO_URL=mongodb://localhost:27017/twitter-clone
JWT_SECRET=your_jwt_secret_key_here
PORT=9000
NODE_ENV=development
CLIENT_URL=http://localhost:3001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:9000`

### Frontend Setup

1. Navigate to the Frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/user/profile/:username` - Get user profile
- `POST /api/user/follow/:id` - Follow/unfollow user
- `GET /api/user/suggested` - Get suggested users
- `POST /api/user/update` - Update user profile

### Posts

- `GET /api/post/all` - Get all posts
- `GET /api/post/following` - Get following posts
- `POST /api/post/create` - Create new post
- `DELETE /api/post/:id` - Delete post
- `POST /api/post/like/:id` - Like/unlike post
- `POST /api/post/comment/:id` - Comment on post

### Notifications

- `GET /api/notification` - Get notifications
- `DELETE /api/notification/delect` - Delete all notifications

## Project Structure

```
Twitter_clone/
├── Backend/
│   ├── controller/     # Route controllers
│   ├── DB/           # Database connection
│   ├── middleware/    # Custom middleware
│   ├── model/        # Database models
│   ├── router/       # API routes
│   └── server.js     # Main server file
├── Frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── public/       # Static assets
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

