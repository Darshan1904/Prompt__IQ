import Prompt from '../models/Prompt.model.js';
import User from '../models/User.model.js';
import { nanoid } from 'nanoid';

export const fetchPrompts = async (req, res) => {

    let { page } = req.body;

    let maxLimit = 5;

    try {
        let prompts = await Prompt.find({draft: false})
                .sort({"publishedAt": -1})
                .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
                .select('title des tags prompt_id activity publishedAt -_id')
                .skip((page - 1) * maxLimit)
                .limit(maxLimit);

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
        let prompts = await Prompt.find({draft: false})
                .sort({"activity,total_reads": -1, "activity.total_likes":-1,  "publishedAt": -1})
                .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
                .select('title prompt_id publishedAt -_id')
                .limit(5);

        res.status(200).send({prompts});
    } catch (error) {
        res.status(500).send({
            err: error.message
        });
    }
}

export const searchPrompts = async (req, res) => {
    let { query, tag, author, page } = req.body;

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

    let maxLimit = 5;

    try {
        let prompts = await Prompt.find(findQuery)
                .sort({"publishedAt": -1})
                .skip((page - 1) * maxLimit)
                .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
                .select('title des tags prompt_id activity publishedAt -_id')
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
    let { query } = req.body;

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

    let { title, content, des, tags, draft} =  req.body;

    if(!title.length){
        res.status(403).send({
            err: "Title is required."
        });
    }

    if(!content.blocks.length){
        res.status(403).send({
            err: "Content is required."
        });
    }

    if(!des.length || des.length > 5000){
        res.status(403).send({
            err: "Description is required and should be less than 5000 characters."
        });
    }

    if(!tags.length || tags.length > 10){
        res.status(403).send({
            err: "Tags are required and should be less than 10 characters."
        });
    }

    tags = tags.map(tag => tag.toLowerCase());

    let prompt_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    let prompt = new Prompt({
        title, content, des, tags, author: authorId, prompt_id, draft: Boolean(draft)
    });

    await prompt.save().then(prompt => {
        let icrementVal = draft ? 0 : 1;

        User.findOneAndUpdate({_id: authorId}, {$inc: {"account_info.total_posts": icrementVal}, $push: {"prompts": prompt._id}}).then(user => {
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

export const getPrompt = async (req, res) => {
    const { id } = req.body;
    const incrementVal = 1;

    try {
        const prompt = await Prompt.findOneAndUpdate({ "prompt_id" : id }, { $icn : {"activit.total_reads": incrementVal}})
        .populate("author", "personal_info.fullname", "personal_info.usename personal_info.profile_img")
        .select("title des content banner activity publishedAt prompt_id tags");

        await User.findOneAndUpdate({"personal_info.username" : prompt.author.personla_info.username}, { $inc : {"account_info.total_reads": incrementVal}});

        res.status(200).send({prompt});
    } catch (error) {
        res.staus(500).send({error : err.message});
    }
}