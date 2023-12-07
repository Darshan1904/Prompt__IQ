import User from '../models/User.model.js';

export const getProfile = async (req,res) => {
    try {
        const {username} = req.body;
    
        const user = await User.findOne({ "personal_info.username": username })
                         .select("-personal_info.password -google_auth -updatedAt -prompts");
    
        return res.status(200).send(user); 
    } catch (error) {
        return res.status(500).send({error : error.message});
    }
}