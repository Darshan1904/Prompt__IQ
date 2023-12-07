import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './db/connection.js';

connectDB();

try{
    app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        }
    );
}
catch(err){
    console.error("Connection error", err);
}