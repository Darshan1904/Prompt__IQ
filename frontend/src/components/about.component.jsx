import { Link } from "react-router-dom";
import { getFullday } from "../common/date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
    return (
        <div className={"md:w-[90%] md:mt-7 " + className}>
            <p className="text-xl leading-7">{bio.length ? bio : "Nothing to read here."}</p>

            <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
                {
                    Object.keys(social_links).map((key)=>{
                        const link = social_links[key];

                        return link && <Link to={link} key={key} target="_blank">{key.includes("twitter") ? 
                        <p className="-mt-2"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg></p>
                        :<i className={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"} />}</Link>
                    })
                }
            </div>

            <p className="text-xl leading-7 text-dark-grey">Joined on {getFullday(joinedAt)}</p>
        </div>
    )
}

export default AboutUser;