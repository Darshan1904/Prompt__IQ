import {Router} from 'express';
import fetchUser from '../middlewares/fetchUser.js';
import { getProfile, updateProfile } from '../controllers/user.js';

const userRoute = Router();

userRoute.post('/getProfile', getProfile);
userRoute.post('/updateProfile', fetchUser, updateProfile);

export default userRoute;