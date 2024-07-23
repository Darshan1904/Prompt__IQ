import {Router} from 'express';
import fetchUser from '../middlewares/fetchUser.js';
import { getProfile, notification, notificationCount, notifications, updateProfile } from '../controllers/user.js';

const userRoute = Router();

userRoute.get('/getProfile', getProfile);
userRoute.post('/updateProfile', fetchUser, updateProfile);
userRoute.get('/newNotification', fetchUser, notification);
userRoute.post('/notifications', fetchUser, notifications);
userRoute.post('/notificationsCount', fetchUser, notificationCount);

export default userRoute;