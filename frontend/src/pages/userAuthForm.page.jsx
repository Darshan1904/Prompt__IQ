import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { toast, Toaster } from 'react-hot-toast';
import axios from "../axios.js";
import { storeInSession } from "../common/session.jsx";
import { useContext, useState } from "react";
import UserContext from "../context/User/userContext.jsx";
import { authWithGoogle } from "../common/firebase.jsx";
import Loader from "../components/loader.component.jsx";

const userAuthForm = ({type}) => {

    let serverRoute = type == "Sign In" ? "/signin" : "/signup";
    const [isClicked, setClicked] = useState(false)
    let {userAuth: {authToken}, setUserAuth} = useContext(UserContext);

    const sendData = async (serverRoute, formData) => {
        try {
            const response = await axios.post("/auth" + serverRoute, formData);
            toast.success(`${type} successful`);
            storeInSession("user", JSON.stringify(response.data));
            setUserAuth(response.data);
        } catch (error) {
            toast.error(error.response.data.error);
        }
    }

    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        try {
            const user = await authWithGoogle();
            let severroute = "/googleAuth";

            let formData = {
                authToken: user.accessToken
            }

            await sendData(severroute, formData);

        } catch (error) {
            toast.error("Trouble login through google");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setClicked(true);

        let form = new FormData(formElement);

        let formData = {}

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let {name, email, password} = formData;

        if(type!=="Sign In" && (!name ||  name.length < 3)){
            setClicked(false);
            return toast.error("Name must be at least 3 characters");
        }

        if(!email.length) {
            setClicked(false);
            return toast.error("Email is required");
        }

        if(password.length < 8) {
            setClicked(false);
            return toast.error("Password must be at least 8 characters");
        }
        

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/ // regex for password

        if(!emailRegex.test(email)) {
            setClicked(false);
            return toast.error("Email is invalid");
        }

        if(!passwordRegex.test(password)) {
            setClicked(false);
            return toast.error("Password must contain at least one number, one uppercase and lowercase letter, one special character and at least 8 or more characters and no white space.");
        }

        await sendData(serverRoute, formData);
        setClicked(false);
    }

    return (
    authToken ?
    <Navigate to="/" />
    :    
    <AnimationWrapper keyValue={type}>
        <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form className="w-[80%] max-w-[400px]" id="formElement">
                <h1 className="text-4xl font-gelasio capitalize text-center mb-16">
                    {type == "Sign In" ? "Welcome back!" : "Join us today"}
                </h1>

                {
                    type != "Sign In" && 
                    <InputBox 
                        name="name" 
                        type="text" 
                        placeholder="Full Name" 
                        icon="fi-rr-user" 
                    />
                }


                <InputBox 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    icon="fi-rr-envelope" 
                />

                <InputBox 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    icon="fi-rr-key" 
                />

                <button className={`btn-dark center mt-14 ${
                    isClicked 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-opacity-80'
                }`}  type="submit" disabled={isClicked} onClick={handleSubmit}>
                    {isClicked ?
                        <>Loading...</>
                        :
                        type
                    }
                </button>

                <div className="relative w-full flex gap-2 my-10 uppercase opacity-10 text-black font-bold items-center">
                    <hr className="w-1/2 border-black" />
                    <p>or</p>
                    <hr className="w-1/2 border-black" />
                </div>

                <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
                    <img src={googleIcon} className="w-5" />
                    Continue with Google
                </button>

                {
                    type == "Sign In" ?
                    <p className="text-dark-grey text-xl text-center mt-6">
                        Don't have an account? <Link to="/signup" className="underline text-black text-xl ml-1">Join Us</Link>
                    </p>
                    :
                    <p className="text-dark-grey text-xl text-center mt-6">
                        Already have an account? <Link to="/signin" className="underline text-black text-xl ml-1">Sign In here</Link>
                    </p>
                }

            </form>
        </section>
    </AnimationWrapper>
    );
}

export default userAuthForm;