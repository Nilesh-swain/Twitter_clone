import express from 'express';
import authRouter from './router/auth.router.js';
 
const app= express();
const port = 8000;

app.use('/api/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});