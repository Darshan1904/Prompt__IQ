import { useState, useContext } from "react";
import { toast, Toaster } from 'react-hot-toast';
import UserContext from "../context/User/userContext";
import axios from "../axios.js";
import PromptContext from "../context/User/promptContext.jsx";

const CommentField = ({action, index=undefined, replyingTo=undefined, setReplying}) => {

    const [comment, setComment] = useState("");
    const { userAuth: { username, authToken, fullname, profile_img } } = useContext(UserContext);
    const { prompt, prompt: {_id, author: { _id: promptAuthor}, activity, activity:{total_comments, total_parent_comments}, comment: { result: commentsArr}}, setPrompt, comments, setTotalParentCommentLoaded } = useContext(PromptContext);

    const handleComment = async () => {

        if(!authToken){
            toast.error("Login first to leave a comment");
            return;
        }

        if(!comment.length){
            toast.error("Write something to leave a comment...");
            return;
        }

        try {
            const result = await axios.post("/prompt/addComment", {_id, promptAuthor, comment, replying_to: replyingTo}, {
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            });

            setComment("");
            result.data.commented_by = { personal_info: { username, profile_img, fullname } };

            let newCommentArr;

            if(replyingTo){
                commentsArr[index].children.push(result.data._id);

                result.data.childrenLevel = commentsArr[index].childrenLevel + 1;

                result.data.parentIndex = index;

                commentsArr[index].isReplyLoaded = true;
                commentsArr.splice(index+1, 0, result.data);

                newCommentArr = commentsArr;
                setReplying(prevVal => !prevVal);
            }
            else{
                result.data.childrenLevel = 0;
                newCommentArr = [ result.data, ...commentsArr ];
            }
    
            let parentCommentIncrementval = replyingTo ? 0 : 1;

            setPrompt({...prompt, comment:{ result : newCommentArr }, activity:{...activity, total_comments: total_comments+1, total_parent_comments: total_parent_comments+parentCommentIncrementval}});
    
            setTotalParentCommentLoaded(prevVal => prevVal + parentCommentIncrementval);

        } catch ({response}) {
            toast.error(response.data.error);
        }

    }

    return (
        <>
            <Toaster />
            <textarea value={comment} placeholder={`Leave a ${action}..` }className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" onChange={(e) => setComment(e.target.value)}></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>
        </>
    )
}

export default CommentField;