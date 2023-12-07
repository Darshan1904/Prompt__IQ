import { useParams } from "react-router-dom"

const PromptPage = () => {

    let { blog_id } = useParams()

    return (
        <div>
            <h1>Prompt Page</h1>
        </div>
    )
};

export default PromptPage;