import {Link, Outlet } from 'react-router-dom';
import logo from "../imgs/logo.png";
import { useState, useContext, useEffect } from 'react';
import UserContext from '../context/User/userContext';
import UserNavigationPannel from './user-navigation.component';
import { useNavigate } from 'react-router-dom';
import axios from '../axios.js';
import {toast} from 'react-hot-toast';

const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [navState, setNavState] = useState(false); 
    const {userAuth, userAuth:{newNotification}, setUserAuth} = useContext(UserContext);
    const Navigate = useNavigate();

    const handleSearch = (e) => {

        const query = e.target.value;

        if(e.keyCode === 13 && query.length) {
            Navigate(`/search/${query}`)
        }
    }

    useEffect(()=>{

        if(userAuth.authToken){
            axios.get('/user/newNotification', {
                headers: {
                    'authorization': `Bearer ${userAuth.authToken}`
                }
            })
            .then(({data})=>{
                setUserAuth({...userAuth, ...data})
            })
            .catch(err=>{
                toast.error("Error getting notifications");
            })
        }

    }, [userAuth.authToken])

    return (
        <>
            <nav className="navbar z-50">

                <Link to="/" className="flex-none w-10">
                    <img src={logo} className="w-full" />
                </Link>

                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " + (searchBoxVisibility ? "show" : "hide")}>
                    <input
                        type="text" 
                        placeholder="Search"
                        className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12" 
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                    onClick={() => {setSearchBoxVisibility(currentVal => !currentVal);}} >
                        <i className="fi fi-rr-search text-x1"></i>
                    </button>

                    <Link to="/editor" className='hidden md:flex gap-2 link'>
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {
                        userAuth.authToken ?
                        <>
                            <Link to="/dashboard/notifications">
                                <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                    <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                                    {newNotification && <span className='bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2'>
                                    </span>}
                                </button>
                            </Link>

                            <div className='relative' onClick={() => setNavState(!navState)}
                                onBlur = {() => {
                                    setTimeout(() => {
                                        setNavState(false);
                                    }, 1000);
                                }}
                            >
                                <button className='w-12 h-12 mt-1'>
                                    <img src={userAuth.profile_img} className='w-full h-full object-cover rounded-full' />
                                </button>

                                {navState && <UserNavigationPannel />}
                            </div>
                        </>
                        :
                        <>
                            <Link to="/signin" className="btn-dark py-2">
                                Sign In
                            </Link>

                            <Link to="/signup" className="btn-light py-2 hidden md:block">
                                Sign Up
                            </Link>
                        </>
                    }

                </div>
            </nav>

            <Outlet />
        </>
    );
}

export default Navbar;