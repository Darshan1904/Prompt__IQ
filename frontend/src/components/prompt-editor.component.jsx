import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import logo from '../imgs/logo.png'
import AnimationWrapper from '../common/page-animation'
import { useContext } from 'react'
import EditorContext from '../context/User/editorContext'
import UserContext from '../context/User/userContext.jsx'
import { toast, Toaster } from 'react-hot-toast';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';

const PromptEditor = () => {

    const { prompt, prompt: {title, content, tags, des, author}, setPrompt, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    const { userAuth: { authToken } } = useContext(UserContext);
    const [ newTitle, setNewTitle ] = useState(title);
    let Navigate = useNavigate();

    const promptId = useParams();

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.target.blur();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";

        setNewTitle(input.value);
    }

    const publish = async () => {

        if (title.length === 0) {
            toast.error("Write a Prompt Titel to publish.");
            return;
        }

        try {    
            setPrompt({ title: newTitle, content, tags, des, author });
            setEditorState("publish");
        } catch (error) {
            toast.error("Something went wrong 😕");
            console.log(error);
        }
    }

    const saveDraft = async (e) => {
        if(e.target.className.includes("disabled")){
            return;
        }

        if(!title.length){
            toast.error("Title is required.");
        }

        let loadingToast = toast.loading("Saving Draft....");

        e.target.classList.add("disabled");

            let promptObj = { title: newTitle, content, tags, des, author, draft: true };

            try {
                await axios.post("/prompt/post",{ ...promptObj, promptId}, {
                    headers: {
                        "authorization": `Bearer ${authToken}`
                    }
                })

                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                toast.success("Saved 👍");
                setTextEditor({isReady: false});
                setPrompt({ title: "", content: [], tags: [], des: "", author: {personal_info : {}} });

                setTimeout(() => {
                    Navigate("/");
                }, 500);

            } catch (error) {
                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                console.log(error);
                toast.error("Something went wrong 😕");
            }
    }

    return (
        <>
            <Toaster />
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo}></img>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length === 0 ? "New Prompt" : newTitle}
                </p>

                <div className="flex gap-4 ml-auto">
                    <button className='btn-dark py-2'
                        onClick={publish}
                    >
                        Publish
                    </button>
                    <button className="btn-light py-2" onClick={saveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">
                        <textarea defaultValue={newTitle} placeholder="Prompt Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                        
                            onKeyDown={handleKeyDown}
                            onChange={handleTitleChange}
                        >

                        </textarea>
                        <hr className="w-full opacity-20 my-5" />
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default PromptEditor