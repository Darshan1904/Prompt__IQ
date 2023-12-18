import EditorContext from "./editorContext";
import { useState } from "react";

const EditorState = (props) => {

    const promptStructure = {
        title: "",
        content: [],
        tags: [],
        des: "",
        author: {personal_info : {}}
    }

    const [prompt, setPrompt] = useState(promptStructure);
    const [editroState, setEditorState] = useState("editor");
    const [textEditor, setTextEditor] = useState({isReady: false});

    return (
        <EditorContext.Provider value={{prompt, setPrompt, editroState, setEditorState, textEditor, setTextEditor}}>
            {props.children}
        </EditorContext.Provider>
    );
}

export default EditorState;