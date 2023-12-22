import {Router} from 'express';
import {signUp, signIn, googleAuth, changePassword} from '../controllers/auth.js';
import fetchUser from '../middlewares/fetchUser.js';

const authRoute = Router();

authRoute.post('/signup', signUp);
authRoute.post('/signin', signIn);
authRoute.post('/googleAuth', googleAuth);
authRoute.post('/changePassword', fetchUser, changePassword);

export default authRoute;