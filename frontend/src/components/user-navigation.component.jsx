import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link } from "react-router-dom";
import UserContext from "../context/User/userContext";
import { removeFromSession } from "../common/session";

const UserNavigationPannel = () => {

    const {userAuth, setUserAuth} = useContext(UserContext);

    const signOut = () => {
        removeFromSession("user");
        setUserAuth({acessToke:null});
    }

    return (
        <AnimationWrapper 
            className="absolute right-0 z-50"
            transition={{duration: 0.2}}
        >

            <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                <Link to={`/user/${userAuth.username}`} className="link pl-8 py-4">
                    Profile
                </Link>

                {/* <Link to={`/testPrompt`} className="link pl-8 py-4">
                    Test Prompts
                </Link> */}

                <Link to={`/settings/editProfile`} className="link pl-8 py-4">
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]">
                </span>   

                <button className="text-left p-4 hover:bg-grey w-full pl-8  py-4" onClick={signOut}>
                    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                    <p className="text-dark-grey">@{userAuth.username}</p>
                </button> 
            </div>

        </AnimationWrapper>
    );
}

export default UserNavigationPannel;