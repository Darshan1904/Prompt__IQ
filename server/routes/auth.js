import {Router} from 'express';
import {signUp, signIn, googleAuth} from '../controllers/auth.js';

const authRoute = Router();

authRoute.post('/signup', signUp);
authRoute.post('/signin', signIn);
authRoute.post('/googleAuth', googleAuth);

export default authRoute;