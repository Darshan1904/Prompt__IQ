import {Router} from 'express';
import { getProfile } from '../controllers/user.js';

const userRoute = Router();

userRoute.post('/getProfile', getProfile);

export default userRoute;