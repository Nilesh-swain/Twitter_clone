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
MONGO_URL=mongodb+srv://nileshswain715_db_user:31RD8z0dlilL2fQ5@cluster0.fbmjzwa.mongodb.net/twitter-clone?retryWrites=true&w=majority
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

## Deployment on Render.com

This project is configured for deployment as a single web service on Render.com.

### Prerequisites

- Render.com account
- MongoDB Atlas database
- Cloudinary account (for image uploads)
- SMTP service (e.g., Gmail) for email notifications
- Twilio account (for SMS OTP, optional)

### Deployment Steps

1. **Fork or clone the repository to your GitHub account.**

2. **Create a new Web Service on Render.com:**
   - Connect your GitHub repository
   - Set the service type to "Web Service"
   - Set the runtime to "Node"
   - Set the build command to: `npm run build`
   - Set the start command to: `npm start`
   - Set the root directory to: `Backend`

3. **Configure Environment Variables:**
   In the Render dashboard, add the following environment variables (copy from `.env.example`):

   - `PORT`: 10000 (or any available port)
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your Render app URL (e.g., https://your-app.onrender.com)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: From your Cloudinary account
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: For email notifications
   - `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`: For SMS OTP (optional)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your application
   - Your app will be available at the provided URL

### Notes

- The build process will install frontend dependencies, build the React app, and copy the build files to the Backend directory.
- The backend serves both the API and the static frontend files.
- For local testing of the production build, run `npm run build` in the Backend directory, then `npm start`.

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

