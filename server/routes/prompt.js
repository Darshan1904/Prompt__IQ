import {Router} from 'express';
import { fetchPrompts, promptPost, fetchTrendingPrompts, searchPrompts, getCount, getSearchCount, searchUsers, getPrompt } from '../controllers/prompt.js';
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

export default promptRouter;