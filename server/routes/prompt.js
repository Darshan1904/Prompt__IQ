import {Router} from 'express';
import { fetchPrompts, promptPost, fetchTrendingPrompts, searchPrompts, getCount, getSearchCount, searchUsers, getPrompt, likePrompt, islikedByUser, addComment, getComments, getReplies, deleteComment, deletePrompt } from '../controllers/prompt.js';
import fetchUser from '../middlewares/fetchUser.js';

const promptRouter = Router();

promptRouter.get('/latestPrompts', fetchPrompts);
promptRouter.get('/trendingPrompts', fetchTrendingPrompts);
promptRouter.post('/searchPrompts', searchPrompts);
promptRouter.post('/post', fetchUser, promptPost);
promptRouter.get('/promptsCounte', getCount);
promptRouter.post('/searchPromptsCounte', getSearchCount);
promptRouter.get('/searchUsers', searchUsers);
promptRouter.get('/getPrompt', getPrompt);
promptRouter.post('/likePrompt', fetchUser, likePrompt);
promptRouter.post('/isLikedByUser', fetchUser, islikedByUser);
promptRouter.post('/addComment', fetchUser, addComment);
promptRouter.get('/getComments', getComments);
promptRouter.get('/getReplies', getReplies);
promptRouter.post('/deleteComment', fetchUser, deleteComment);
promptRouter.post('/deletePrompt', fetchUser, deletePrompt);

export default promptRouter;