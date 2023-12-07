import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

const Tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading here...",
            levels: [2, 3],
            defaultLevel: 2,
        },
        inlineToolbar: true
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
}

export default Tools;