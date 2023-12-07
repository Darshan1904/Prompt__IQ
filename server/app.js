import expresss from 'express';
import authRouter from './routes/auth.js';
import cors from 'cors';
import promptRouter from './routes/prompt.js';
import userRoute from './routes/user.js';

const app = expresss();

app.use(cors());
app.use(expresss.json({limit: "16kb"}));
app.use(expresss.urlencoded({extended: true, limit: "16kb"}));
app.use(expresss.static("public"));

//use routes
app.use('/auth', authRouter);

//prompt routes
app.use('/prompt', promptRouter);

//user routes
app.use('/user', userRoute);

export default app;