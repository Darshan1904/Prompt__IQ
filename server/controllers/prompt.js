import Prompt from '../models/Prompt.model.js';
import User from '../models/User.model.js';
import Notification from '../models/Notification.model.js';
import Comment from '../models/Comment.model.js';
import { nanoid } from 'nanoid';

export const fetchPrompts = async (req, res) => {
    let { page } = req.query;
    let maxLimit = 5;

    try {
        let prompts = await Prompt.aggregate([
            { $match: { draft: false } },
            { $sort: { publishedAt: -1 } },
            { $skip: (page - 1) * maxLimit },
            { $limit: maxLimit },
            { $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }},
            { $unwind: '$author' },
            { $project: {
                title: 1,
                des: 1,
                tags: 1,
                prompt_id: 1,
                activity: 1,
                publishedAt: 1,
                'author.personal_info.profile_img': 1,
                'author.personal_info.username': 1,
                'author.personal_info.fullname': 1
            }}
        ]);

        res.status(200).send({prompts});
    } catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const getCount = async (req, res) => {
    try {
        let count = await Prompt.countDocuments({draft: false});
        res.status(200).send({totalDocs:count});
    }
    catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const getSearchCount = async (req, res) => {
    let { tag, query, author } = req.body;

    let findQuery;
    if(tag){
        findQuery = { tags: tag, draft: false };
    }
    else if(query){
        findQuery = { title: new RegExp(query, 'i') , draft: false };
    }
    else if(author){
        findQuery = { author, draft: false}
    }

    try {
        let count = await Prompt.countDocuments(findQuery);
        res.status(200).send({totalDocs:count});
    }
    catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const fetchTrendingPrompts = async (req, res) => {
    try {
        let prompts = await Prompt.aggregate([
            { $match: { draft: false } },
            { $sort: { 
                "activity.total_reads": -1, 
                "activity.total_likes": -1,  
                "publishedAt": -1 
            }},
            { $limit: 5 },
            { $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author'
            }},
            { $unwind: '$author' },
            { $project: {
                title: 1,
                prompt_id: 1,
                publishedAt: 1,
                'author.personal_info.profile_img': 1,
                'author.personal_info.username': 1,
                'author.personal_info.fullname': 1
            }}
        ]);

        res.status(200).send({prompts});
    } catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const searchPrompts = async (req, res) => {
    let { query, tag, author, page, limit, eliminatePrompt } = req.body;

    let findQuery;

    if(tag){
        findQuery = { tags: tag, draft: false, prompt_id: { $ne: eliminatePrompt} };
    }
    else if(query){
        findQuery = { title: new RegExp(query, 'i') , draft: false };
    }
    else if(author){
        findQuery = { author }
    }

    let maxLimit = limit ? limit : 5;

    try {
        let prompts = await Prompt.find(findQuery)
                .sort({"publishedAt": -1})
                .skip((page - 1) * maxLimit)
                .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
                .select('title des tags prompt_id activity publishedAt -_id draft')
                .limit(maxLimit);
        page = page + 1;
        res.status(200).send({prompts});
    } catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const searchUsers = async (req,res)=>{
    let { query } = req.query;

    let findQuery = { "personal_info.username": new RegExp(query, 'i') };

    try {
        let users = await User.find(findQuery)
                .select('personal_info.profile_img personal_info.username personal_info.fullname -_id')
                .limit(25);

        res.status(200).send({users});
    } catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const promptPost = async (req, res) => {
    let authorId = req.user._id;
    let { title, content, des, tags, draft, promptId} =  req.body;

    if(draft==false){
        if(!title.length){
            return res.status(403).send({
                err: "Title is required."
            });
        }

        if(!des.length){
            return res.status(403).send({
                err: "Description is required."
            });
        }

        if(!tags.length || tags.length > 10){
            return res.status(403).send({
                err: "Tags are required and should be less than 10 characters."
            });
        }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let prompt_id;
    if(promptId &&  Object.entries(promptId).length){
        prompt_id = promptId
    }
    else{
        prompt_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
    }

    if(promptId &&  Object.entries(promptId).length){

        await Prompt.findOneAndUpdate({ "prompt_id" : promptId.promptId }, { title, content, des, tags, draft: Boolean(draft) }, { new: true })
        .then(prompt => { 
            User.findOneAndUpdate({_id: authorId}, {$inc: {"account_info.total_posts": 1}}).then(user => {
                res.status(200).send({
                    id : prompt.prompt_id
                });
            }).catch(err => {
                res.status(500).send({
                    err: err.message
                });
            });
        }).catch(err => {
            res.status(500).send({
                err: err.message
            });
        });

    }else{
        let prompt = new Prompt({
            title, content, des, tags, author: authorId, prompt_id, draft: Boolean(draft)
        });
    
        await prompt.save().then(prompt => {
            let incrementVal = draft ? 0 : 1;
    
            User.findOneAndUpdate({_id: authorId}, {$inc: {"account_info.total_posts": incrementVal}, $push: {"prompts": prompt._id}}).then(user => {
                    res.status(200).send({
                        id : prompt.prompt_id
                    });
                }).catch(err => {
                    res.status(500).send({
                        err: err.message
                    });
                });
            }).catch(err => {
                res.status(500).send({
                    err: err.message
            });
        });
    }
}

export const getPrompt = async (req, res) => {
    const { promptId, draft, mode } = req.query;
    const incrementVal = mode != 'edit' ? 1 : 0;
    
    try {
        const prompt = await Prompt.findOneAndUpdate({ "prompt_id" : promptId }, { $inc: {"activity.total_reads": incrementVal}})
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .select("title des content banner activity publishedAt prompt_id tags");

        await User.findOneAndUpdate({"personal_info.username" : prompt.author.personal_info.username}, { $inc : {"account_info.total_reads": incrementVal}});

        if(prompt.draft && !draft){
            return res.status(500).send({error: "You can not access draft prompt."})
        }

        res.status(200).send({prompt});
    } catch (error) {
        res.status(500).send({error : error.message});
    }
}

export const likePrompt = async (req, res) => {
    const { promptId, isLikedByUser } = req.body;
    const userId = req.user._id;

    let incrementVal = !isLikedByUser ? 1 : -1;

    try {
        const prompt = await Prompt.findOneAndUpdate({_id: promptId}, {$inc: {"activity.total_likes": incrementVal}})
        if(!isLikedByUser){
            let like = new Notification({
                type: "like",
                prompt: promptId,
                notification_for: prompt.author,
                user: userId
            });
    
            like.save().then(() => {
                res.status(200).send({likedByUser: !isLikedByUser});
            });
        }
        else{
            Notification.findOneAndDelete({type: "like", prompt: promptId, user: userId}).then(()=>{
                res.status(200).send({likedByUser: !isLikedByUser});
            })
        }
    } catch (error) {
        res.status(500).send({
            err: err.message
        });
    }
}

export const islikedByUser = async (req, res) => {
    const userId = req.user._id;
    const { promptId } = req.body;

    try {
        const result = await Notification.exists({type: "like", prompt: promptId, user: userId})
        if(result){
            res.status(200).send({likedByUser: true});
        }
        else{
            res.status(200).send({likedByUser: false});
        }
    } catch (error) {
        res.status(500).send({
            err: err.message
        });
    }

}

export const addComment = (req, res) => {
    const userId = req.user._id;
    const { _id, comment, promptAuthor, replying_to } = req.body;

    if(!comment.length){
        return res.status(403).send({error: "Write something to leave a comment..."})
    }

    let commentObj = {
        prompt_id : _id,
        prompt_author: promptAuthor,
        comment,
        commented_by: userId
    };

    if(replying_to){
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(commentFile => {
        let { comment, commentedAt, children } = commentFile;

        Prompt.findOneAndUpdate({_id}, { $push: { "comments" : commentFile._id }, $inc: {"activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 }})
        .then(async prompt => {
            let notification = {
                type: replying_to ? "reply" : "comment",
                prompt: _id,
                notification_for: promptAuthor,
                user: userId,
                comment: commentFile._id
            };

            if(replying_to){
                notification.replied_on_comment = replying_to;

                await Comment.findOneAndUpdate({_id: replying_to}, {$push: {children: commentFile._id}}).then(replyingToCommentDoc => {
                    {notification.notification_for = replyingToCommentDoc.commented_by}
                });

            }

            new Notification(notification).save().then(notify => res.status(200).send({comment, commentedAt, _id: commentFile._id, children}));
        }).catch(error => {
            res.status(500).send({ error: error.message });
        });
    })

}

export const getComments = async (req, res) => {
    const { promptId, skip } = req.query;

    const maxLimit = 5;

    try {   
        const comments = await Comment.find({ prompt_id: promptId, isReply: false }).populate('commented_by', 'personal_info.profile_img personal_info.username personal_info.fullname')
        .skip(skip)
        .limit(maxLimit)
        .sort({
            commentedAt: -1
        })
        res.status(200).send({comments});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const getReplies = async (req, res) => {
    const { _id, skip } = req.query;

    const maxLimit = 5;

    try {
        const doc = await Comment.findOne({ _id })
        .populate({
            path: "children",
            option:{
                skip: skip,
                limit: maxLimit,
                sort: { 'commentedAt' : -1 }
            },
            populate: {
                path: 'commented_by',
                select: 'personal_info.profile_img personal_info.username personal_info.fullname'
            },
            select: "-prompt_id -updatedAt"
        })
        .select("children")
        res.status(200).send({replies : doc.children});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }

}

const deleteCommentFunc = async (comment) => {
    if(comment.parent){
        await Comment.findOneAndUpdate({_id: comment.parent}, {$pull : {children: comment._id}});
    }    
        
    await Comment.findOneAndDelete({_id: comment._id});
    await Notification.findOneAndDelete({comment: comment._id});
    await Notification.findOneAndDelete({reply: comment._id});

    await Prompt.findOneAndUpdate({_id: comment.prompt_id}, {$pull: {comments: comment._id}, $inc: {"activity.total_comments": -1,  "activity.total_parent_comments": comment.parent? 0 : -1 }}).then(async prompt => {
        if(comment.children.length){
            comment.children.map(async replies => {
                replies = await Comment.findOne({_id:replies});
                deleteCommentFunc(replies);
            })
        }
    })
    .catch((error)=>{
        res.status(500).send({error: error.message});
    });
}

export const deleteComment = async (req, res) => {
    const userId = req.user._id;
    const { _id } = req.body;

    try{
        const comment = await Comment.findOne({_id})

        if (!comment) {
            return res.status(404).send({error: "Comment not found"});
        }
        if (comment.commented_by != userId) {
            return res.status(403).send({error: "You are not authorized to delete this comment."});
        }
            
        await Comment.findByIdAndDelete({_id});
        deleteCommentFunc(comment);
    
        res.status(200).send({msg:"Comment deleted"});
    } catch (error) {
        res.status(500).send({error: error.message});
    };
}

const deletePromptFunc = async (prompt, userId) => {
    await Comment.deleteMany({prompt_id: prompt._id});
    await Notification.deleteMany({prompt: prompt._id});

    await User.findOneAndUpdate({_id: userId}, {$inc: {"account_info.total_posts": -1, "account_info.total_reads": -prompt.activity.total_reads}, $pull: {prompts: prompt._id}}) 
    .catch((error)=>{
        res.status(500).send({error: error.message});
    });
}

export const deletePrompt = async (req, res) => {
    const userId = req.user._id;
    const { promptId } = req.body;

    try { 
        const prompt = await Prompt.findOne({prompt_id: promptId})
        if (!prompt) {
            return res.status(404).send({error: "Prompt not found"});
        }
        if (prompt.author != userId) {
            return res.status(403).send({error: "You are not authorized to delete this prompt."});
        }
            
        await Prompt.findOneAndDelete({prompt_id: promptId});
        deletePromptFunc(prompt, userId);
    
        res.status(200).send({msg:"Prompt deleted"});
    } catch (error) {
        res.status(500).send({error: error.message});
    }

}