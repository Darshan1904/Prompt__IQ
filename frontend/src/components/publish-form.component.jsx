import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useState, useContext } from "react";
import EditorContext from "../context/User/editorContext";
import UserContext from "../context/User/userContext";
import Tag from "./tags.component";
import axios from "../axios.js";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {

    const {prompt, setPrompt, setTextEditor, setEditorState} = useContext(EditorContext);
    const {userAuth: {authToken}} = useContext(UserContext);
    const [newPrompt, setNewPrompt] = useState(prompt)
    const tagLimit = 10;
    const promptId = useParams();
    let Navigate = useNavigate();

    const handleClose = () => {
        setEditorState("editor");
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        setNewPrompt({...newPrompt, title: input.value.trim() });
    }

    const handleDesChange = (e) => {
        let input = e.target;

        setNewPrompt({...newPrompt, des: input.value.trim() });
    }

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
        }
    }

    const handleTagKeyDown = (e) => {
        if (e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            let tag = e.target.value.trim();

            if (newPrompt.tags.length < tagLimit) {
                if(!newPrompt.tags.includes(tag) && tag.length) {
                    setNewPrompt({ ...newPrompt, tags: [...newPrompt.tags, tag] });
                }
            }
            else{
                toast.error(`You can add only ${tagLimit} tags.`);
                return;
            }
            e.target.value = "";
        }
    }

    const publishPrompt = async (e) => {

        if(e.target.className.includes("disabled")){
            return;
        }

        if(!newPrompt.title.trim().length){
            toast.error("Title is required.");
            return;
        }
    
        if(!newPrompt.des.trim().length){
            toast.error("Prompt is required.");
            return;
        }
    
        if(!newPrompt.tags.length || newPrompt.tags.length > tagLimit){
           toast.error(`Tags are required and should be less than ${tagLimit}.`);
           return;
        }

        let loadingToast = toast.loading("Publishing....");

        e.target.classList.add("disabled");

        let promptObj = newPrompt;

        try {
            await axios.post("/prompt/post", {...promptObj, promptId}, {
                headers: {
                    "authorization": `Bearer ${authToken}`
                }
            })

            e.target.classList.remove("disabled");
            toast.dismiss(loadingToast);
            toast.success("Published 👍");
            setTextEditor({isReady: false});
            setPrompt({ title: "", content: [], tags: [], des: "", author: {personal_info : {}} });
            setNewPrompt({ title: "", content: [], tags: [], des: "", author: {personal_info : {}} });

            setTimeout(() => {
                Navigate("/");
                setEditorState("editor");
            }, 1000);

        } catch ({response}) {
            e.target.classList.remove("disabled");
            toast.dismiss(loadingToast);
            toast.error(response.data.error);
        }
    }

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py:16 lg:gap-4"> 
                <Toaster />
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleClose}>
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center items-start justify-start">
                    <p className="text-dark-grey mb-1 w-full">Preview</p>
                    <h1 className="text-4xl font-md mt-2 leading-tight line-clamp-2 w-full">{newPrompt.title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4 w-full">{newPrompt.des}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-gray mb-2 mt-9">Prompt Title</p>
                    <input type="text" placeholder="Prompt Title" className="input-box pl-4" defaultValue={newPrompt.title} onChange={handleTitleChange}/>

                    <p className="text-dark-gray mb-2 mt-9">Write your prompt here</p>
                    <textarea placeholder="Write your promtp here" 
                        className="input-box pl-4 h-40 resize-none leading-7" 
                        defaultValue={newPrompt.des} 
                        onChange={handleDesChange}
                        onKeyDown={handleKeyDown}
                    />

                    <p className="text-dark-gray mb-2 mt-9">Topics - (Help in Searching and Ranking your Prompt)</p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topics" 
                            className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" 
                            onKeyDown={handleTagKeyDown}
                        />
                        {
                            newPrompt.tags.map((tag, index) => { 
                                return <Tag key={index} tag={tag} index={index} newPrompt={newPrompt} setNewPrompt={setNewPrompt} />
                            })
                        }
                    </div>
                    <p className="mt-1 text-dark-grey text-sm text-right">{tagLimit - newPrompt.tags.length} tags left</p>

                    <button className="btn-dark px-8" onClick={publishPrompt}>Publish</button>
                </div>
            </section>
        </AnimationWrapper>
    )
}

export default PublishForm;