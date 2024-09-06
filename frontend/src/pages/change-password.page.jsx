import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { toast, Toaster } from "react-hot-toast";
import axios from "../axios.js";
import UserContext from "../context/User/userContext.jsx";

const ChangePassword = () => {

    const changePasswordForm = useRef();
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/;

    const { userAuth: {authToken} } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(changePasswordForm.current);
        const formData = { }

        for(let [key, value] of form.entries()){
            formData[key] = value.trim();
        }

        const { currentPassword, newPassword } = formData;

        if(!currentPassword.trim().length || !newPassword.trim().length){
            toast.error("Fill all the input");
            return;
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password must contain at least one number, one uppercase and lowercase letter, one special character and at least 8 or more characters and no white space.");
        }

        if (currentPassword === newPassword) {
            toast.error("New password must be different from the current password");
            return;
        }

        e.target.setAttribute("disabled", true);

        const loadingToast = toast.loading("Updating...");

        try {
            const result = await axios.post("/auth/changePassword", formData, {
                headers:{
                    "authorization": `Bearer ${authToken}`
                }
            });

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");

            toast.success("Password Updated!!");
        } catch ({response}) {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");

            toast.error(response.data.error);
        }
    }

    return (
        <AnimationWrapper>
            <Toaster />
            <form ref={changePasswordForm}>
                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox name="currentPassword" type="password" className="profile-edit-input" placeholder="Current Password" icon="fi-rr-unlock" />

                    <InputBox name="newPassword" type="password" className="profile-edit-input" placeholder="New Password" icon="fi-rr-unlock" />

                    <button onClick={handleSubmit} className="btn-dark px-10" type="submit">Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword;