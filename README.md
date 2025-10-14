# Twitter Clone

A full-stack Twitter clone built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication (signup, login, logout)
- 📝 Create, edit, and delete posts
- ❤️ Like and unlike posts
- 🔄 Repost posts
- 💬 Comment on posts
- 🔖 Bookmark posts
- 👥 Follow/unfollow users
- 🔔 Real-time notifications
- 📱 Responsive design
- 🖼️ Image upload with Cloudinary
- 🔍 Search users
- 📊 User profiles

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- DaisyUI
- React Router
- React Query
- React Hot Toast
- React Icons
- Emoji Picker

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Nodemailer
- Twilio

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd twitter-clone
```

2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Set up environment variables:
   Create a `.env` file in the `Backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/twitter-clone
JWT_SECRET=your_jwt_secret_here
PORT=9000
CLIENT_URL=http://localhost:5173
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

4. Start the development servers:

```bash
# Start backend (from Backend directory)
npm run dev

# Start frontend (from Frontend directory)
npm run dev
```

## Project Structure

```
twitter-clone/
├── Backend/
│   ├── controller/          # Route controllers
│   ├── model/              # Database models
│   ├── router/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── DB/                 # Database connection
│   └── server.js           # Main server file
├── Frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── hooks/          # Custom hooks
│   └── public/             # Static assets
└── package.json           # Root package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Posts

- `GET /api/post/all` - Get all posts
- `GET /api/post/following` - Get following posts
- `POST /api/post/create` - Create post
- `DELETE /api/post/:id` - Delete post
- `POST /api/post/like/:id` - Like/unlike post
- `POST /api/post/repost/:id` - Repost/unrepost
- `POST /api/post/bookmark/:id` - Bookmark post
- `POST /api/post/comment/:id` - Comment on post

### Users

- `GET /api/user/profile/:username` - Get user profile
- `POST /api/user/follow/:id` - Follow/unfollow user
- `GET /api/user/suggested` - Get suggested users
- `GET /api/user/search` - Search users
- `POST /api/user/update` - Update user profile

### Notifications

- `GET /api/notification` - Get notifications
- `DELETE /api/notification/delete` - Delete all notifications
- `DELETE /api/notification/delete/:id` - Delete single notification

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email your-email@example.com or create an issue in the repository.
