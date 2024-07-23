import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';

export const getProfile = async (req, res) => {
    try {
      const { username } = req.query;
  
      const user = await User.findOne({ 'personal_info.username': username })
        .select('-personal_info.password -google_auth -updatedAt -prompts');
  
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      return res.status(200).send(user);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  };
  

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

export const notification = async (req, res) => {
    let userId = req.user._id;

    try {
        const result = await Notification.exists({notification_for: userId, seen: false, user:{ $ne: userId }});
    
        if(result){
            return res.status(200).send({newNotification: true});
        }
        else{
            return res.status(200).send({newNotification: false});
        }  
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

export const notifications = async (req, res) => {
    const userId = req.user._id;

    const { page, filter, deletedDocCount } = req.body;
    const maxLimit = 10;
    const findQuery = { notification_for: userId, user:{ $ne: userId } };
    const skipDocs = ( page -1 )*maxLimit;

    if(filter != "all"){
        findQuery.type = filter;
    }

    if(deletedDocCount){
        skipDocs -= deletedDocCount;
    }

    try {
        const notifications = await Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("prompt", "title prompt_id")
        .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .sort({ createdAt: -1 })
        .select("createdAt type seen reply");

        await Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)

        return res.status(200).send(notifications);
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}

export const notificationCount = async (req, res) => {
    const userId = req.user._id;

    const { filter } = req.body;

    const findQuery = { notification_for: userId, user:{ $ne: userId } };

    if(filter != "all"){
        findQuery.type = filter;
    }

    try {
        const count = await Notification.countDocuments(findQuery);
    
        return res.status(200).send({totalDocs : count});
    } catch (error) {
        return res.status(500).send({error: error.message});
    }
}