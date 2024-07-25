import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import { useState, useEffect } from "react";
import LoadMoreData from "../components/load-more.component";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import PromptCard from "../components/prompt-post.component";
import NoData from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "../axios.js";
import {toast, Toaster} from "react-hot-toast";
import UserCard from "../components/usercard.component.jsx";

const SearchPage = () => {

    const { query} = useParams();
    const [prompts, setPrompts] = useState(null);
    const [users, setUsers] = useState(null);

    const searchPrompts = async ({page = 1, createNewArray = false}) => {
        try {
            let res = await axios.post("/prompt/searchPrompts", {query, page});
            let formatedData = await filterPaginationData({
                state: prompts,
                createNewArray,
                data: res.data.prompts, 
                page: page,
                counteRoute: "prompt/searchPromptsCounte",
                dataToSend: {query}
            })
            setPrompts(formatedData);
        } catch (error) {
            toast.error("Something went wrong 😕!");
        }
    }

    const searchUsers = async () => {
        try {
          const res = await axios.get('/prompt/searchUsers', {
            params: { query },
          });
          setUsers(res.data.users);
        } catch (error) {
          toast.error("Something went wrong 😕!");
        }
    };
      

    const resetState = () => {
        setPrompts(null);
        setUsers(null);
    }

    useEffect(() => {
        resetState();
        searchPrompts({page:1, createNewArray: true});
        searchUsers();
    }, [query]);

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader/>
                    :
                    users.length ?
                        users.map((user, i)=>{
                            return <AnimationWrapper key={i} transition={{duration:1, delay:i*0.08}}>
                                <UserCard user={user}/>
                            </AnimationWrapper>
                        })
                        :
                        <NoData message="No user found" />
                }
            </>
        )
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <Toaster />
            <div className="w-full">
                <InPageNavigation routes={[`Search results for ${query}`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>

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
                            <LoadMoreData state={prompts} fetchDataFunc={searchPrompts} />
                    </>

                    <UserCardWrapper />
                </InPageNavigation>
            </div>
            
            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 px-3 max-md:hidden">
                    <h1 className="font-medium text-xl mb-8">Users related to Search <i className="fi fi-rr-user mt-1"></i></h1>
                    <UserCardWrapper />
                </div>
        </section>
    );
}

export default SearchPage;