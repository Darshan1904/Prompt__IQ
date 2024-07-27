import { useContext, useState, useEffect, useRef } from "react";
import UserContext from "../context/User/userContext";
import { profileStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { toast, Toaster } from "react-hot-toast";
import axios from "../axios.js";
import InputBox from "../components/input.component";
import { storeInSession } from "../common/session.jsx";

const EditProfile = () => {

    let bioLimit = 150;
    const { userAuth, userAuth: { username, authToken }, setUserAuth } = useContext(UserContext);
    const [ profile, setProfile ] = useState(profileStructure);
    const [ loading, setLoading ] = useState(true);
    const [ charactersLeft, setCharactersLeft ] = useState(bioLimit);
    const editProfileForm = useRef();

    const { personal_info: {fullname, username: profileUsername, profile_img, email, bio}, social_links } = profile;

    const handleCharChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(editProfileForm.current);
        let formData = { };

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        const { username, bio, youtube, facebook, twitter, github, instagram, website } = formData;

        if(username.length<3){
            return toast.error("Username should be atleast 3 letters long.");
        }
        if(bio.length > bioLimit){
            return toast.error(`Bio should not be more than ${bioLimit}`);
        }

        const loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        try {
            const result = await axios.post('/user/updateProfile', {username, bio, social_links:{
                youtube, facebook, twitter, github, instagram, website
            }}, {
                headers:{
                    'authorization': `Bearer ${authToken}`,
                }
            })

            const { data } = result;
            let newUserAuth = {...userAuth, username: data.username };
            storeInSession("user", JSON.stringify(newUserAuth));
            setUserAuth(newUserAuth);

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Profile Updated");
            
        } catch ({response}) {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error(response.data.error);
        }
    }

    useEffect(() => {

        if(authToken){
   
            axios.get('/user/getProfile', {
                params: { username },
            })
            .then(({data})=>{
                setProfile(data);
                setLoading(false);
                setCharactersLeft(bioLimit - data.personal_info.bio.length);
            })
            .catch(({response}) => {
                toast.error(response.data.error);
            });
        
        }

    }, []);

    return (
        <AnimationWrapper>
            {
                loading ? <Loader />
                :
                <form ref={editProfileForm}>
                    <Toaster />

                    <h1 className="max-md:hidden">Edit Profile</h1>
                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">

                        <div className="max-lg:center mb-5">
                            <p className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden border-grey border">
                                <img src={profile_img} />
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 mg:gap-5 gap-6">
                                <div>
                                    <InputBox name="fullname" type="text" value={fullname} placeholder="Full Name" disable={true} icon="fi-rr-user" />
                                </div>

                                <div>
                                    <InputBox name="email" type="email" value={email} placeholder="Email" disable={true} icon="fi-rr-envelope" />
                                </div>

                                <InputBox type="text" name="username" value={profileUsername} placeholder="Username" icon="fi-rr-at" />
                            </div>

                            <p className="text-dark-grey -mt-3">Username will be used to search user and will be visible to all users</p>

                            <textarea name="bio" maxLength={bioLimit} defaultValue={bio} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" onChange={handleCharChange}>

                            </textarea>

                            <p className="mt-1 text-dark-grey">{charactersLeft} characters left</p>

                            <p className="my-6 text-dark-grey">
                                Add your social handles below
                            </p>

                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(social_links).map((key, i) => {
                                        let link = social_links[key];

                                        return <InputBox key={i} name={key} type="text" value={link} placeholder="https://" icon={"fi " + (key !== 'website' ? "fi-brands-" + key : "fi-rr-globe") + " text-2xl hover:text-black"} />
                                        
                                    })
                                }
                            </div>

                            <button onClick={handleSubmit} className="btn-dark w-auto px-10" type="submit">
                                Update
                            </button>
                        </div>

                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile;