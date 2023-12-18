import PromptContext from "./promptContext";
import { useState } from "react";

const PromptState = (props) => {

    const promptStructure = {
        title: "",
        des: "",
        content: [],
        tags: [],
        author: { personal_info : {}},
        publishedAt: ""
    }

    const [prompt, setPrompt] = useState(promptStructure);
    const [isLikedByUser, setLikedByUser] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [totalParentCommentLoaded, setTotalParentCommentLoaded] = useState(0);

    return (
        <PromptContext.Provider value={{prompt, setPrompt, isLikedByUser, setLikedByUser, showComment, setShowComment, totalParentCommentLoaded, setTotalParentCommentLoaded}}>
            {props.children}
        </PromptContext.Provider>
    );
}

export default PromptState;