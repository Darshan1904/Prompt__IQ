import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../axios.js"
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component.jsx";
import UserContex from "../context/User/userContext.jsx"
import AboutUser from "../components/about.component.jsx";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import PromptCard from "../components/prompt-post.component.jsx";
import LoadMoreData from "../components/load-more.component.jsx";
import NoData from "../components/nodata.component.jsx";
import PageNotFound from "../pages/404.page.jsx";
import { toast, Toaster } from 'react-hot-toast';

export const profileStructure = {
    personal_info : {
        fullname: "",
        username: "",
        profile_img: "",
        bio: ""
    },
    account_info : {
        total_posts: 0,
        total_reads: 0,
    },
    social_links:{ },
    joindAt: ""
};

const ProfilePage = () => {

    let { id: profileId } = useParams();

    const [profile, setProfile] = useState(profileStructure);
    const [loading, setLoading] = useState(true);
    const [prompts, setPrompts] = useState(null);
    const [profileLoaded, setProfileLoaded] = useState("");

    const { personal_info: { fullname, username: profile_username, profile_img, bio}, account_info:{total_posts, total_reads}, social_links, joinedAt} = profile;

    const { userAuth : { username, authToken } } = useContext(UserContex);

    const fetchUserProfile = async () => {
        try {
          const result = await axios.get('/user/getProfile', {
            params: { username: profileId },
          });
      
          if (result.data !== "") {
            setProfile(result.data);
          }
      
          getPrompts({ user_id: result.data._id });
          setProfileLoaded(profileId);
          setLoading(false);
        } catch (error) {
          toast.error("Something went wrong 😕");
        }
    };

    const getPrompts = async ({page = 1, user_id, createNewArray = true}) => {

        user_id = user_id === undefined ? prompts.user_id : user_id;

        try {
            const result = await axios.post('/prompt/searchPrompts', {author: user_id, page});

            let formatedData = await filterPaginationData({
                createNewArray: createNewArray,
                state: prompts,
                data: result.data.prompts,
                page,
                counteRoute: "prompt/searchPromptsCounte",
                dataToSend: {author:user_id}
            });

            formatedData.user_id = user_id;
            setPrompts(formatedData);

        } catch (error) {
            toast.error("Something went wrong 😕");
        }
    }

    const handlePromptDelete = async (promptId) => {
        try {
            await axios.post("/prompt/deletePrompt", {promptId}, {
                headers: {
                    "authorization": `Bearer ${authToken}`
                }
            });
            
            // filter out the deleted prompt
            setPrompts(prevPrompts => ({
                ...prevPrompts,
                results: prevPrompts.results.filter(prompt => prompt.prompt_id !== promptId)
            }));
            toast.success("Prompt deleted successfully");
        } catch ({response}) {
            toast.error(response.data.error);
        }
    };

    const resetState = ()=>{
        setProfile(profileStructure);
        setLoading(true);
        setProfileLoaded("");
    }

    useEffect(()=>{

        if(profileLoaded !== profileId){
            setPrompts(null);
            resetState();
            fetchUserProfile();
        };

        if(prompts == null){
            resetState();
            fetchUserProfile();
        }

    }, [profileId]);

    return (
        <AnimationWrapper>
            <Toaster/>
            {
                loading ? <Loader/>
                :
                profile_username.length ?
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">

                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:border-grey md:sticky md:top-[100px] md:py-10">

                        <img src={profile_img} className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32" />

                        <h1 className="text-2xl font-medium">@{profile_username}</h1>
                        <p className="text-xl capitalize h-6">{fullname}</p>

                        <p>{total_posts.toLocaleString()} Prompts - {total_reads.toLocaleString()} Reads</p>

                        <div className="flex gap-4 mt-2">
                            {
                                profileId === username && 
                                <Link to="/settings/editProfile" className="btn-light rounded-md">Edit Profile</Link>
                            }
                        </div>

                        <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />

                    </div>

                    <div className="max-md:mt-12 w-full">
                        <InPageNavigation routes={["Prompts", "About"]} defaultHidden={["About"]}>
                            <>
                                {
                                    prompts === null ? <Loader /> : prompts.results.length ? prompts.results.map((prompt, index) => {
                                        return (
                                            <AnimationWrapper transition={{duration:1, delay: index*.1}} key={index}>
                                                <PromptCard key={index} prompt={prompt} route="/user" author={prompt.author.personal_info} onDelete={handlePromptDelete} />
                                            </AnimationWrapper>
                                        )  
                                    })
                                    :
                                    <NoData message="No prompts published" />
                                }
                                <LoadMoreData state={prompts} fetchDataFunc={getPrompts} />
                            </>
                            <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                        </InPageNavigation>
                    </div>
                    
                </section>
                :
                <PageNotFound />
            }
        </AnimationWrapper>
    )
}

export default ProfilePage;