import EditorContext from "./editorContext";
import { useState } from "react";

const EditorState = (props) => {

    const blogStructure = {
        title: "",
        content: [],
        tags: [],
        des: "",
        author: {personal_info : {}}
    }

    const [blog, setBlog] = useState(blogStructure);
    const [editroState, setEditorState] = useState("editor");
    const [textEditor, setTextEditor] = useState({isReady: false});

    return (
        <EditorContext.Provider value={{blog, setBlog, editroState, setEditorState, textEditor, setTextEditor}}>
            {props.children}
        </EditorContext.Provider>
    );
}

export default EditorState;