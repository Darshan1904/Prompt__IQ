import { useEffect } from "react";
import {formatDate} from "../common/date";
import { Link } from "react-router-dom";

const PromptCard = ({prompt, author}) => {

    let {title, des, activity: { total_likes }, tags, publishedAt, prompt_id: id} = prompt;
    let {username, profile_img, fullname} = author;

    return (
        <Link to={`/prompts/${id}`} className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} alt="profile" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{formatDate(publishedAt)}</p>
                </div>

                <h1 className="blog-title">{title}</h1>

                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

                <div className="mt-7 flex gap-4">
                    <span className="btn-light py-1 px-4">{tags[0]}</span>
                    <span className="ml-3 flex items-center gap-2 text-dark-grey">
                        <i className="fi fi-rr-heart text-xl"></i>
                        {total_likes}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default PromptCard;