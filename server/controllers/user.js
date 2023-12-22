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

export const updateProfile = async (req, res) => {

    const { username, bio, social_links } = req.body;

    const bioLimit = 150;

    if(username.length < 3){
        return res.status(403).send({error : "Username must be atleast 3 characters long"});
    }

    if(bio.length > bioLimit){
        return res.status(403).send({error : `Bio must be less than ${bioLimit} characters`});
    }

    const socialLInkArr = Object.keys(social_links);

    try{

        for(let i=0; i<socialLInkArr.length; i++){
            if(social_links[socialLInkArr[i]].length){
                const hostName = new URL(social_links[socialLInkArr[i]]).hostname;
                
                if(!hostName.includes(`${socialLInkArr[i]}.com`) && socialLInkArr[i] != 'website'){
                    return res.status(403).send({error : `Invalid ${socialLInkArr[i]} link`});
                }
            }
        }

    }catch(err){
        return res.status(500).send({error : "You must provide full social links with http(s) included."});
    }

    const updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    try {
        await User.findOneAndUpdate({_id: req.user._id}, updateObj, {
            runValidators: true
        });

        return res.status(200).send({username});
    } catch (error) {
        if(error.code == 1100){
            return res.status(409).json({error: "Username is already taken"});
        }
        return res.status(500).send({error : error.message});
    }

}