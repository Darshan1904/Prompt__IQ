import { useContext, useEffect } from "react";
import PromptContext from "../context/User/promptContext";
import UserContext from "../context/User/userContext"
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "../axios.js";

const PromptInteraction = () => {
    let { prompt, prompt: { _id, title, des, prompt_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username }}}, setPrompt, isLikedByUser, setLikedByUser, setShowComment } = useContext(PromptContext);

    const { userAuth: { username, authToken } } = useContext(UserContext);

    useEffect(() => {
        if(authToken){
            axios.post("/prompt/isLikedByUser", {promptId: _id}, {
                headers:{
                    'authorization' : `Bearer ${authToken}`
                }
            })
            .then(res => {
                setLikedByUser(res.data.likedByUser);
            })

        }
    
    }, []);

    const handleLike = async ()=>{
        if(authToken){
            setLikedByUser(prevVal => !prevVal);

            !isLikedByUser ? total_likes++ : total_likes--;

            setPrompt({...prompt, activity: {...activity, total_likes} });

            try {
                const result = await axios.post("/prompt/likePrompt", {promptId: _id, isLikedByUser}, {headers:{
                    'authorization' : `Bearer ${authToken}`
                }});

            } catch ({response}) {
                toast.error(response.data.error);
            }
        }
        else{
            toast.error("Please login to like this prompt");  
        }
    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
                <div className="flex gap-6 justify-between">
                    <div className="flex gap-3 items-center">
                       
                            <button 
                                onClick={handleLike}
                                className={"w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 " + ( isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80" )}>
                                <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                            </button>
                            <p className="text-xl text-dark-grey">{total_likes}</p>
                       
                            <button 
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80" 

                                onClick={() => setShowComment(prev => !prev)}
                            >
                                <i className="fi fi-rr-comment-dots"></i>
                            </button>
                            <p className="text-xl text-dark-grey">{total_comments}</p>

                            <button className="w-max h-10 px-4 rounded-full flex items-center justify-center gap-2 bg-grey/80" onClick={() => {
                                navigator.clipboard.writeText(des); 
                                toast.success("Copied to clipboard")
                            }}>
                                <i className='fi fi-rr-copy'/> copy
                            </button>
                       
                    </div>

                    <div className="flex gap-6 items-center">
                        {
                            username == author_username &&
                            <Link to={`/editor/${prompt_id}`} className="underline hover:text-purple">Edit</Link>
                        }
                        <Link to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </Link>
                    </div>
                </div>
            <hr className="border-grey my-2" />
        </>
    );
}

export default PromptInteraction;