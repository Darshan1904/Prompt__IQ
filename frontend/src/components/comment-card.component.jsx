import { useContext, useState } from "react";
import { getFullday } from "../common/date";
import UserContext from "../context/User/userContext";
import { toast, Toaster } from 'react-hot-toast';
import CommentField from "./comment-field.component";
import PromptContext from "../context/User/promptContext";
import axios from "../axios.js";

const CommentCard = ({ index, leftVal, commentData}) => {

    const { commented_by: { personal_info: {profile_img, fullname, username: commented_by_username} }, commentedAt, comment, _id, children} = commentData;
    const { userAuth: { authToken, username } } = useContext(UserContext);
    const { prompt, prompt: { comment: pcomment, comment: { result: commentsArr }, activity, activity: {total_parent_comments}}, setPrompt, setTotalParentCommentLoaded} = useContext(PromptContext);

    const [ isReplying, setReplying ] = useState(false);

    const handleReplyClick = () => {
        if(!authToken){
            return toast.error("Login first to leave a reply");
        }

        setReplying(preVal => !preVal);
    }

    const getParentIndex = () => {
        let start = index - 1;

        try{
            while(commentsArr[start].childrenLevel >= commentData.childrenLevel){
                start--;
            }
        }catch{
            start = undefined;
        }

        return start;
    }

    const removeCommentsCard = (startIndex, isDelete = false) => {
        if(commentsArr[startIndex]){
            while(commentsArr[startIndex].childrenLevel > commentData.childrenLevel){
                commentsArr.splice(startIndex, 1);

                if(!commentsArr[startIndex]){
                    break;
                }
            }
        }

        setPrompt({...prompt, comments: commentsArr});

        if(isDelete){
            const parentIndex = getParentIndex();

            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)

                if(commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArr.splice(index, 1);

            if(commentData.childrenLevel == 0 && isDelete){
                setTotalParentCommentLoaded(prev => prev-1);
            }

            setPrompt({...prompt, comments: commentsArr, activity: {...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)}});
        }
    }

    const deleteComment = async (e) => {
        e.target.setAttribute("disabled", true);
        try {
            await axios.post('/prompt/deleteComment', {_id}, {
                headers: {
                    "authorization": `Bearer ${authToken}`
                }
            });

            removeCommentsCard(index+1, true);
        } catch ({response}) {
            toast.error(response.data.error);
        }

        e.target.setAttribute("disabled", false);
    }

    const loadReply = async ({skip = 0}) => {
        if(children.length){
            hideReply();

            try {
                const result = await axios.get("/prompt/getReplies", { params : {_id, skip} });

                commentData.isReplyLoaded = true;

                let replies = result.data.replies;

                for(let i=0; i<replies.length; i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;

                    commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                }

                setPrompt({...prompt, comment: { ...pcomment, result: commentsArr }})

            } catch ({response}) {
                toast.error(response.data.error);
            }
        }
    }

    const hideReply = () => {
        commentData.isReplyLoaded = false;

        removeCommentsCard(index + 1);
    }

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />

                    <p className="line-clamp-1">{fullname} @{commented_by_username}</p>
                    <p className="min-w-fit">{getFullday(commentedAt)}</p>

                </div>
                
                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 mt-5 items-center">

                    {
                        commentData.isReplyLoaded ? 
                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReply}>
                            <i className="fi fi-rs-comment-dots" />Hide Reply
                        </button>
                        :
                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReply}>
                            <i className="fi fi-rs-comment-dots" />{children.length} Reply
                        </button>
                    }

                    <button className="underline" onClick={handleReplyClick}>Reply</button>

                    {
                        username == commented_by_username &&
                        <button className="p-2 px-3 rounded-md border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={deleteComment}><i className="fi fi-rr-trash pointer-events-none"></i></button>
                    }
                </div>

                {
                    isReplying && 
                    <div className="mt-8">
                        <CommentField action="Reply" index={index} replyingTo={_id} setReplying={setReplying} />
                    </div>
                }
            </div>
            <Toaster />
        </div>
    )
}

export default CommentCard;