import React, { useContext } from 'react'
import { Link } from 'react-router-dom';

const NotificationCard = ({ data, index, notificationState }) => {

  let { type, seen, comment, replied_on_comment, user: { personal_info: { fullname, username, profile_img } }, prompt: { prompt_id, title } } = data;

  return (
    <div className={"p-6 border-b border-grey border-l-black " + (!seen ? "border-l-2" : "")}>
        <div className="flex gap-5 mb-3">
            <img src={profile_img} className="w-14 h-14 flex-none rounded-full" />
            <div className="w-full">
                <h1 className="font-medium text-xl text-dark-grey">
                    <span className="lg:inline-block hidden capitalize">{fullname}</span>
                    <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
                    <span className="font-normal">
                        {
                            type == 'like' ? "Liked your blog" :
                            type == 'comment' ? "Commented on your blog" :
                            "Replied on"
                        }
                    </span>
                </h1>
                {
                    type == 'reply' ?
                    <div className="p-4 mt-4 rounded-md bg-grey">
                        <p>{ replied_on_comment}</p>
                    </div> 
                    : 
                    <Link to={`/prompts/:${prompt_id}`} className="font-medium text-dark-grey hover:underline line-clamp-1">{`"${title}"`}</Link>
                }
            </div>
        </div>
        
        {
            type != "like" ?
            <p className="ml-14 pl-5 font-gelasio text-xl my-5">{comment?.comment}</p>
            :
            ""
        }

    </div>
  )
}

export default NotificationCard