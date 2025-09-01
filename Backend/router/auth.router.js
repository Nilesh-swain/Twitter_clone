import express from 'express';
import { Login, SingUp, SingIn } from '../controller/auth.controller.js';

const router = express.Router();

router.get('/login', Login);

router.get('/singup', SingUp);

router.get('/singin', SingIn);
export default router;