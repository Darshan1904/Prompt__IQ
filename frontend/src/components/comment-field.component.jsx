import { useState, useContext } from "react";
import { toast, Toaster } from 'react-hot-toast';
import UserContext from "../context/User/userContext";
import axios from "../axios.js";
import PromptContext from "../context/User/promptContext.jsx";

const CommentField = ({action}) => {

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
            const result = await axios.post("/prompt/addComment", {_id, promptAuthor, comment}, {
                headers: {
                    'authorization': `Bearer ${authToken}`
                }
            });

            setComment("");
            result.data.commented_by = { personal_info: { username, profile_img, fullname } };

            let newCommentArr;

            result.data.childrenLevel = 0;

            newCommentArr = [ result.data, ...commentsArr.comments ];

            setPrompt({...prompt, comment:{ result : { comments : newCommentArr } }, activity:{...activity, total_comments: total_comments+1, total_parent_comments: total_parent_comments+1}});

            setTotalParentCommentLoaded(prevVal => prevVal + 1);

        } catch (error) {
            toast.error("Something went wrong!!");
            console.log(error);
        }

    }

    return (
        <>
            <Toaster />
            <textarea value={comment} placeholder="Leave a comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" onChange={(e) => setComment(e.target.value)}></textarea>

            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>
        </>
    )
}

export default CommentField;