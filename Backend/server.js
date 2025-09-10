import express from 'express';
import cookieparser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

import authRouter from './router/auth.router.js';
import userRouter from './router/user.router.js';
import postRouter from './router/post.router.js';

import connectMangoDB from './DB/connectmangodb.js';

// This bellows 2 lines will used for to access .env file
import dotenv from 'dotenv';
dotenv.config();
// it is used to the upload images to the cloudinary.
cloudinary.config({
    cloud_name: process.env.CLAUDINARY_CLOUD_NAME,
    api_key: process.env.CLAUDINARY_API_KEY,
    api_secret: process.env.CLAUDINARY_API_SECRET,
    secure: true,
});

const app= express();
const port = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies.
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies.

app.use(cookieparser());

app.use('/api/auth', authRouter); // Mount the auth router.
app.use('/api/user', userRouter); // Mount the user router.
app.use('/api/post', postRouter); // Mount the post router.

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectMangoDB();
});