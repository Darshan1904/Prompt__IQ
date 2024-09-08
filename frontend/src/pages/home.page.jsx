import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import toast, {Toaster} from "react-hot-toast";
import axios from "../axios.js";
import PromptCard from "../components/prompt-post.component.jsx";
import MinimalPromptPost from "../components/nobanner-prompt-post.component.jsx";
import { activeTab } from "../components/inpage-navigation.component";
import NoData from "../components/nodata.component.jsx";
import { filterPaginationData } from "../common/filter-pagination-data.jsx";
import LoadMoreData from "../components/load-more.component.jsx";
import { Link } from "react-router-dom";

const HomePage = () => {

    const [prompts, setPrompts] = useState(null);
    const [trendingPrompts, setTrendingPrompts] = useState(null);
    const [pageState, setPageState] = useState("home");

    let categories = ["programming", "chatgpt", "gemini", "tech", "story writing", "education", "music", "content creation",  "marketing", "investing", "fitness", "art"]

    const fetchLatestPrompts = async ({ page = 1 }) => {
        try {
          let res = await axios.get('/prompt/latestPrompts', {
            params: { page },
          });
          
          let formatedData = await filterPaginationData({
            state: prompts,
            createNewArray: prompts === null ? true : false,
            data: res.data.prompts,
            page: page,
            counteRoute: "prompt/promptsCounte",
          });
          
          setPrompts(formatedData);
        } catch (error) {
          toast.error("Something went wrong 😕!");
        }
    };      

    const fetchTrendingPrompts = async () => {
        try {
            let res = await axios.get("/prompt/trendingPrompts");
            setTrendingPrompts(res.data.prompts);
        } catch (error) {
            toast.error("Something went wrong 😕!");
        }
    }

    const filterPrompts = async (e) => {
        let category = e.target.innerText.toLowerCase();
        setPrompts(null);

        if(pageState === category){
            setPageState("home");
            return;
        }
            
        setPageState(category);
    }

    const fetchPromptsByCategory = async ({page=1}) => {
        try {
            let res = await axios.post("/prompt/searchPrompts", {tag: pageState, page});
            let formatedData = await filterPaginationData({
                state: prompts,
                data: res.data.prompts, 
                page: page,
                counteRoute: "prompt/searchPromptsCounte",
                dataToSend: {tag: pageState}
            })
            setPrompts(formatedData);
        } catch (error) {
            toast.error("Something went wrong 😕!");
        }
    }

    useEffect(() => {

        activeTab.current.click();

        if(pageState === "home"){
            fetchLatestPrompts({page:1});
        }
        else{
            fetchPromptsByCategory({page:1});
        }

        if(trendingPrompts === null){
            fetchTrendingPrompts();
        }

    }, [pageState]);

    return (
        <AnimationWrapper>
            <section className="flex justify-center h-cover gap-10">
                {/* latest blogs */}
                <Toaster />
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending prompts"]} defaultHidden={["trending prompts"]}>
                        <>
                            {
                                prompts === null ? <Loader /> : prompts.results.length ? prompts.results.map((prompt, index) => {
                                    return (
                                        <AnimationWrapper transition={{duration:1, delay: index*.1}} key={index}>
                                            <PromptCard key={index} prompt={prompt} author={prompt.author.personal_info} />
                                        </AnimationWrapper>
                                    )  
                                })
                                :
                                <NoData message="No prompts published" />
                            }
                            <LoadMoreData state={prompts} fetchDataFunc={(pageState === "home" ? fetchLatestPrompts : fetchPromptsByCategory)} />
                        </>
                        <>
                            {
                                trendingPrompts === null ? <Loader /> : trendingPrompts.map((prompt, index) => {
                                    return (
                                        <AnimationWrapper transition={{duration:1, delay: index*.1}} key={index}>
                                            <MinimalPromptPost prompt={prompt} index={index} />
                                        </AnimationWrapper>
                                    )
                                })
                            }
                        </>
                    </InPageNavigation>
                </div>
                {/* filters and trending prompts */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Prompts from all interests</h1>
                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, index) => {
                                        return (
                                            <button onClick={filterPrompts} key={index} className={"tag " + (pageState === category ? " bg-black text-white" : " ")}>{category}</button>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    
                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
                            {
                                    trendingPrompts === null ? <Loader /> : trendingPrompts.map((prompt, index) => {
                                        return (
                                            <AnimationWrapper transition={{duration:1, delay: index*.1}} key={index}>
                                                <MinimalPromptPost prompt={prompt} index={index} />
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                        </div>
                        
                        <Link to="https://www.producthunt.com/posts/prompt-iq?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-prompt-iq" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=487158&theme=neutral"
                                alt="Prompt IQ - A platform to share and explore creative writing prompts | Product Hunt"
                                style={{ width: '250px', height: '54px' }}
                                width="250"
                                height="54"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default HomePage;