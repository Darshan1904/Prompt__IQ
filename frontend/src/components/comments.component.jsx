import { useContext } from "react";
import PromptContext from "../context/User/promptContext";
import CommentField from "./comment-field.component";
import axios from "../axios.js";
import NoData from "../components/nodata.component.jsx";
import AnimationWrapper from "../common/page-animation.jsx";
import CommentCard from "./comment-card.component.jsx";

export const fetchComments = async ({skip = 0, promptId, setParentCommentCountFun, commentArray = null}) => {
    let res;

    await axios.get("/prompt/getComments", { params : {promptId, skip} }).then(({data})=> {
        data.comments.map(comment => {
            comment.childrenLevel = 0;
        });

        setParentCommentCountFun(prevVal => prevVal + data.comments.length);

        if(commentArray == null){
            res = { result : data.comments};
        }
        else{
            res = { result : [...commentArray, ...data.comments]};
        }
    });

    return res;
}

const CommentsContainer = () => {

    let {prompt,  prompt: {_id, title, comment: {result: commentsArr}, activity: { total_parent_comments }}, setPrompt, showComment, setShowComment, totalParentCommentLoaded, setTotalParentCommentLoaded } = useContext(PromptContext);

    const loadMoreComments = async () => {
        let newCommetnsArr = await fetchComments({skip: totalParentCommentLoaded, promptId: _id, setParentCommentCountFun: setTotalParentCommentLoaded, commentArray: commentsArr});

        setPrompt({...prompt, comment: newCommetnsArr});
    }

    return (
        <div className={"max-sm:w-full fixed overflow-y-scroll " + ( showComment ? "top-[40%] sm:right-0" : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-[60%] md:h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>

            <div className="relative">
                <h1 className="text-xl font-medium">Comments</h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>

                <button className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={()=>setShowComment(false)}>
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button> 

                <hr className="border-grey my-8 w-[120%] -ml-10" />

                <CommentField action="Comment" />

                {
                    commentsArr && commentsArr.length ?
                    commentsArr.map((comment, i) => {
                        return <AnimationWrapper key={i}>
                            <CommentCard index={i} leftVal={comment.childrenLevel*4} commentData={comment} />
                        </AnimationWrapper>
                    })
                    :
                    <NoData message="No Comments" />
                }

                {
                    total_parent_comments > totalParentCommentLoaded ? 
                    <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadMoreComments}>Load More</button>
                    :
                    null
                }
            </div>

        </div>
    )
}

export default CommentsContainer;