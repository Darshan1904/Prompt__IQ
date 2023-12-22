import { Link } from "react-router-dom";
import {formatDate} from "../common/date";

const MinimalPromptPost = ({ prompt, index }) => {
    
    let { title, prompt_id: id, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = prompt;

    return (
        <Link to={`/prompts/:${id}`} className="flex gap-5 mb-8">
            <h1 className="blog-index">{index < 10 ? "0" + (index+1) : index+1}</h1>
            <div>
                <div className="flex gap-2 items-center mb-3">
                    <img src={profile_img} alt="profile" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{formatDate(publishedAt)}</p>
                </div>
                <h1 className="blog-title">{title}</h1>
            </div>
        </Link>
    );
};

export default MinimalPromptPost;