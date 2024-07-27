import { useContext, useEffect, useState } from "react"
import UserContext from "../context/User/userContext"
import { Navigate, useParams } from "react-router-dom";
import PromptEditor from "../components/prompt-editor.component";
import PublishForm from "../components/publish-form.component";
import EditorContext from "../context/User/editorContext";
import Loader from "../components/loader.component";
import axios from "../axios.js";
import toast from "react-hot-toast";

const EditorPage = () => {

    const { promptId } = useParams();
    const { userAuth } = useContext(UserContext);
    const { prompt: {title, content, tags, des, author}, setPrompt, editroState } = useContext(EditorContext);
    const [ loading, setLoading ] = useState(true);

    const getPrompt = async(promptId)=>{
        try {
            const result = await axios.get("/prompt/getPrompt", { params : {promptId, draft:true, mode:'edit'}});

            const prompt = result.data.prompt;
            setPrompt(prompt);
            setLoading(false);
        } catch ({response}) {
            toast.error(response.data.error);
            setLoading(false);
        }
    }

    useEffect( ()=>{
        if(!promptId){
            return setLoading(false);
        }

        getPrompt(promptId);        
    })

    return (
        userAuth.authToken === null ? <Navigate to="/signin" />
         : 
        loading ? <Loader /> : 
        editroState === "editor" ? <PromptEditor /> : <PublishForm />
    )
}

export default EditorPage;