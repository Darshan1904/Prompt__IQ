import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../imgs/logo.png'
import AnimationWrapper from '../common/page-animation'
import { useContext } from 'react'
import EditorContext from '../context/User/editorContext'
import UserContext from '../context/User/userContext.jsx'
import EditorJS from '@editorjs/editorjs'
import Tools from './tools.component'
import { toast, Toaster } from 'react-hot-toast';
import axios from '../axios.js';
import { useNavigate } from 'react-router-dom';

const PromptEditor = () => {

    const { blog: {title, content, tags, des, author}, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
    const { userAuth: { authToken } } = useContext(UserContext);
    let Navigate = useNavigate();

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

        setBlog({ title: input.value, content, tags, des, author });
    }

    const publish = async () => {

        if (title.length === 0) {
            toast.error("Write a Prompt Titel to publish.");
            return;
        }

        if(textEditor.isReady) {
            try {    
                const data = await textEditor.save();
                if(data.blocks.length === 0) {
                    toast.error("Write a Prompt to publish.");
                    return;
                }
                setBlog({ title, content: data, tags, des, author });
                setEditorState("publish");
            } catch (error) {
                console.log(error);
            }
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

        if(textEditor.isReady) {

            const data = await textEditor.save();
            let promptObj = { title, content: data, tags, des, author, draft: true };

            try {
                await axios.post("/prompt/post", promptObj, {
                    headers: {
                        "authorization": `Bearer ${authToken}`
                    }
                })

                e.target.classList.remove("disabled");
                toast.dismiss(loadingToast);
                toast.success("Saved 👍");
                setTextEditor({isReady: false});
                setBlog({ title: "", content: [], tags: [], des: "", author: {personal_info : {}} });

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
    }

    useEffect(() => {
        if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holderId: 'textEditor',
                data: content,
                tools: Tools,
                placeholder: "Start writing your prompt here...",
            }));
        }
    }, [])

    return (
        <>
            <Toaster />
            <nav className="navbar">
                <Link to="/" className="flex-none w-10">
                    <img src={logo}></img>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title.length === 0 ? "New Prompt" : title}
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
                        <textarea defaultValue={title} placeholder="Prompt Title" className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                        
                            onKeyDown={handleKeyDown}
                            onChange={handleTitleChange}
                        >

                        </textarea>
                        <hr className="w-full opacity-20 my-5" />

                        <div id="textEditor" className="font-gelasio">

                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default PromptEditor