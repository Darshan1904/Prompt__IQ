import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema({
    
    prompt_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'prompts'
    },
    prompt_author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'prompts',
    },
    comment: {
        type: String,
        required: true
    },
    children: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'users'
    },
    isReply: {
        type: Boolean,
        default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }

},
{
    timestamps: {
        createdAt: 'commentedAt'
    }
})

export default mongoose.model("comments", commentSchema)