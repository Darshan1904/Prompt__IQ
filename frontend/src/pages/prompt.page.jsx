import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "../axios.js";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component.jsx";
import { getFullday } from "../common/date.jsx";
import PromptInteraction from "../components/prompt-interaction.component.jsx";
import PromptContext from "../context/User/promptContext.jsx";
import PromptCard from "../components/prompt-post.component.jsx";
import { toast, Toaster } from 'react-hot-toast';
import CommentsContainer, { fetchComments } from "../components/comments.component.jsx";

const PromptPage = () => {

    let { promptId } = useParams();
    promptId = promptId.slice(1);
    const { prompt, setPrompt, showComment, setShowComment, totalParentCommentLoaded, setTotalParentCommentLoaded } = useContext(PromptContext);
    const [loading, setLoading] = useState(true);
    const [similarPrompts, setSimilarPrompts] = useState(null);

    const {title, des, author:{ personal_info : {username: author_username, fullname, profile_img}}, publishedAt} = prompt;

    const fetchPrompt = async () => {
        try {
            const result = await axios.get('/prompt/getPrompt', { params : {promptId} });
            const prompt = result.data.prompt;

            prompt.comment = await fetchComments({promptId: prompt._id, setParentCommentCountFun: setTotalParentCommentLoaded})

            setPrompt(prompt);
            const similarResult = await axios.post('prompt/searchPrompts', {tag: prompt.tags[0], limit: 6, eliminatePrompt: promptId});

            setSimilarPrompts(similarResult.data.prompts);
            setLoading(false);
        } catch (error) {
            toast.error("Something went wrong 😕");
            setLoading(false);
        }
    }

    const resetState = () => {
        setSimilarPrompts(null);
        setLoading(true);
        setShowComment(false);
        setTotalParentCommentLoaded(0);
    }

    useEffect(() => {
        resetState();
        fetchPrompt();
    }, [promptId]);

    return (
        <AnimationWrapper>
            <Toaster/>
            {
                loading ? <Loader />
                :
                <>
                <CommentsContainer />

                <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    <div className="mt-6">
                        <h2>{title}</h2>

                        <div className="my-12 font-gelasio blog-page-content text-justify">
                            {des}
                        </div>

                        <div className="flex max-sm:flex-col justify-between my-8">
                            <div className="flex gap-5 items-start">
                                <img src={profile_img} className="w-12 h-12 rounded-full"/>
                                <p className="capitalize">
                                    {fullname}
                                    <br/>
                                    @
                                    <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                </p>
                            </div>
                            <p className="text-dark-grey opacity-75 max:sm mt-6 max-sm:ml-12 max-sm:pl-5">
                                Published on {getFullday(publishedAt)}
                            </p>
                        </div>
                    </div>

                    <PromptInteraction />
                    
                        {
                            similarPrompts != null && similarPrompts.length ?
                            <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Prompts</h1>

                                {
                                    similarPrompts?.map((prompt, i)=>{
                                        let { author: {personal_info}} = prompt;

                                        return <AnimationWrapper key={i} transition={{duration: 1, delay: i*0.08}}>
                                            <PromptCard prompt={prompt} author={personal_info}/>
                                        </AnimationWrapper>
                                    })
                                }
                            </>
                            :
                            <></>
                        }
                </div>
                </>
            }
        </AnimationWrapper>
    )
};

export default PromptPage;