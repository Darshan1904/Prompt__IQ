import { useContext } from "react";
import {formatDate} from "../common/date";
import { Link } from "react-router-dom";
import UserContext from "../context/User/userContext";

const PromptCard = ({prompt, author, route = "", onDelete}) => {

    let {title, des, draft, activity: { total_likes }, tags, publishedAt, prompt_id: id} = prompt;
    let {username, profile_img, fullname} = author;
    const { userAuth : { username : loggedInUser } } = useContext(UserContext);

    const handlePromptDelete = async () => {
        onDelete(id);
    }

    return (
        <div className="flex gap-8 items-center border-b border-grey pb-5 mb-4">
            <div className="w-full">
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} alt="profile" className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{formatDate(publishedAt)}</p>
                    {route=="/user" && draft==false && username === loggedInUser && <button className="ml-auto px-4 py-2 text-red" onClick={handlePromptDelete}><i className="fi fi-rr-delete text-2xl"/></button>}
                </div>

                <Link to={`/prompts/:${id}`}>
                    <h1 className="blog-title">{title}</h1>

                    <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2 text-justify">{des}</p>

                    <div className="mt-7 flex gap-4">
                        {draft ? 
                            <span className="flex items-center gap-5">
                                <span className="text-dark-grey underline">
                                    Drafted Prompt
                                </span>
                                <Link to={`/editor/${id}`} className="btn-dark rounded-md text-sm px-2 py-2">Publish</Link>
                            </span>
                        :
                        <span className="btn-light py-1 px-4">{tags[0]}</span>}
                        {draft==false && <span className="ml-3 flex items-center gap-2 text-dark-grey">
                            <i className="fi fi-rr-heart text-xl"></i>
                            {total_likes}
                        </span>}
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default PromptCard;