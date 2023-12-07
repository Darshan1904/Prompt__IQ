import { useContext } from "react"
import UserContext from "../context/User/userContext"
import { Navigate } from "react-router-dom";
import PromptEditor from "../components/prompt-editor.component";
import PublishForm from "../components/publish-form.component";
import EditorContext from "../context/User/editorContext";

const EditorPage = () => {

    const { userAuth } = useContext(UserContext);
    const { editroState } = useContext(EditorContext);

    return (
        userAuth.authToken === null ? <Navigate to="/signin" />
         : 
        editroState === "editor" ? <PromptEditor /> : <PublishForm />
    )
}

export default EditorPage;