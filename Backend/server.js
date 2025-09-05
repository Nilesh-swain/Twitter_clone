import express from 'express';
import authRouter from './router/auth.router.js';
import connectMangoDB from './DB/connectmangodb.js';

// This bellows 2 lines will used for to access .env file
import dotenv from 'dotenv';
dotenv.config();

const app= express();
const port = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies.

app.use('/api/auth', authRouter); // Mount the auth router.

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectMangoDB();
});