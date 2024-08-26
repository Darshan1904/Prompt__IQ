import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../context/User/userContext";
import { Outlet, Navigate, NavLink } from "react-router-dom";

const SideNav = () => {

    const page = location.pathname.split('/')[2];
    const { userAuth: {authToken, newNotification} } = useContext(UserContext);
    const [ pageState, setPageState ] = useState(page);
    const [ showSideNav, setShowSideNav ] = useState(false);

    const activeTabLine = useRef();
    const sideBarIconTab = useRef();
    const pageStateTab = useRef();

    const changePageState = (e) => {
        const { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if(e.target == sideBarIconTab.current){
            setShowSideNav(true);
        }
        else{
            setShowSideNav(false);
        }
    }

    useEffect(()=>{
        setShowSideNav(false);
        pageStateTab.current?.click();
    }, [pageState])

    return (
        authToken == null ? <Navigate to="/signin" />
        :
        <>
            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
                <div className="sticky top-[80px] z-30">

                    <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                        <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
                            <i className="fi fi-rr-bars-staggered pointer-events-none" />
                        </button>

                        <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                            {pageState}
                        </button>
                        <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
                    </div>

                    <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>
                        <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        {/* <NavLink to="/testPrompt" onClick={(e)=> setPageState(e.target.innerText)}
                            className="sidebar-link"
                        >
                            <i className="fi fi-rr-file" />
                            Test Prompts
                        </NavLink> */}

                        <NavLink to="/dashboard/notifications" onClick={(e)=> setPageState(e.target.innerText)}
                            className="sidebar-link"
                        >
                            <div className="relative">
                                <i className="fi fi-rr-bell" />
                                {newNotification && <span className='bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0'>
                                </span>}
                            </div>
                            Notification
                        </NavLink>

                        <NavLink to="/editor" onClick={(e)=> setPageState(e.target.innerText)}
                            className="sidebar-link"
                        >
                            <i className="fi fi-rr-file-edit" />
                            Write
                        </NavLink>

                        <h1 className="text-xl text-dark-grey mb-3 mt-20">Settings</h1>
                        <hr className="border-grey -ml-6 mb-8 mr-6" />

                        <NavLink to="/settings/editProfile" onClick={(e)=> setPageState(e.target.innerText)}
                            className="sidebar-link"
                        >
                            <i className="fi fi-rr-user" />
                            Edit Profile
                        </NavLink>

                        <NavLink to="/settings/changePassword" onClick={(e)=> setPageState(e.target.innerText)}
                            className="sidebar-link"
                        >
                            <i className="fi fi-rr-lock" />
                            Change Password
                        </NavLink>

                    </div>
                </div>
                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>
            </section>
        </>
    )
}

export default SideNav;