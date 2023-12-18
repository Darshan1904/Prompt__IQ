import {Router} from 'express';
import { fetchPrompts, promptPost, fetchTrendingPrompts, searchPrompts, getCount, getSearchCount, searchUsers, getPrompt, likePrompt, islikedByUser, addComment, getComments } from '../controllers/prompt.js';
import fetchUser from '../middlewares/fetchUser.js';

const promptRouter = Router();

promptRouter.post('/latestPrompts', fetchPrompts);
promptRouter.get('/trendingPrompts', fetchTrendingPrompts);
promptRouter.post('/searchPrompts', searchPrompts);
promptRouter.post('/post', fetchUser, promptPost);
promptRouter.post('/promptsCounte', getCount);
promptRouter.post('/searchPromptsCounte', getSearchCount);
promptRouter.post('/searchUsers', searchUsers);
promptRouter.post('/getPrompt', getPrompt);
promptRouter.post('/likePrompt', fetchUser, likePrompt);
promptRouter.post('/isLikedByUser', fetchUser, islikedByUser);
promptRouter.post('/addComment', fetchUser, addComment);
promptRouter.post('/getComments', getComments);

export default promptRouter;