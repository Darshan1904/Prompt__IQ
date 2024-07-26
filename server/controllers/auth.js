import User from "../models/User.model.js";
import { nanoid } from "nanoid";
import admin from "firebase-admin";
import serviceAccountKey from "../firbase.js";
import {getAuth} from "firebase-admin/auth";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

const generateUserName = async (email) => {
    let username = email.split("@")[0];

    let isUsernameTaken = await User.findOne({"personal_info.username": username});

    if(isUsernameTaken) {
        username = username + "_" + nanoid(4);
    }

    return username;
}

const formateDataToSend = async (user) => {
    return {
        profile_img : user.personal_info.profile_img,
        username : user.personal_info.username,
        fullname : user.personal_info.fullname,
        authToken : await user.generateAuthToken(),
    }
}

export const signUp = async (req, res) => {
    let {name, email, password} = req.body;
    
    //validate request
    if(name.length < 3 || password.length < 6) {
        return res.status(403).send({error: "Name must be at least 3 characters and password must be at least 6 characters"});
    }
    
    if(!email.length) {
        return res.status(403).send({error: "Email is required"});
    }

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    if(!emailRegex.test(email)) {
        return res.status(403).send({error: "Email is invalid"});
    }

    if(!passwordRegex.test(password)) {
        return res.status(403).send({error: "Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"});
    }

    let isEmailTaken = await User.findOne({"personal_info.email": email});
    if(isEmailTaken) {
        return res.status(403).send({error: "Email is already taken"});
    }

    let username = await generateUserName(email);

    let user = new User(
        {
            personal_info:{
                fullname: name,
                email,
                password,
                username,
            }
        }
    );

    await user.save();
    const data = await formateDataToSend(user);
    res.status(200).send(data);
}

export const signIn = async (req, res) => {
    let {email, password} = req.body;

    if(!email.length) {
        return res.status(403).send({error: "Email is required"});
    }

    if(!password.length) {
        return res.status(403).send({error: "Password is required"});
    }

    let user = await User.findOne({"personal_info.email": email});

    if(!user) {
       return res.status(403).send({error: "Email is not registered"});
    }

    if(user.google_auth) {
        return res.status(403).send({error: "Account is registered with google. Please use google to login"});
    }

    if(!await user.comparePassword(password)) {
       return res.status(403).send({error: "Password is incorrect"});
    }

    const data = await formateDataToSend(user);
    res.status(200).send(data);
}

export const googleAuth = async (req, res) => {
    let {authToken} = req.body;

    try {
        let decodedToken = await getAuth().verifyIdToken(authToken.toString())
        let {email, name, picture} = decodedToken;
    
        picture = picture.replace("s96-c", "s384-c");
    
        let user = await User.findOne({"personal_info.email": email}).select("personal_info.profile_img personal_info.username personal_info.fullname google_auth")
        .catch((err) => {
            return res.status(500).send({error: "Something went wrong"});
        });
    
        if(!user) {
            let username = await generateUserName(email);
    
            user = new User(
                {
                    personal_info:{
                        fullname: name,
                        email,
                        profile_img: picture,
                        username,
                    },
                    google_auth: true
                }
            );
    
            await user.save().then(async (u) => {
                user = u;
            })
            .catch((err) => {
                return res.status(500).send({error: "Something went wrong"});
            });
        }
        else{
            if(!user.google_auth){
                return res.status(403).send({error: "Email is already registered"});
            }
        }
    
        return res.status(200).send(await formateDataToSend(user));
        
    } catch (error) {
        return res.status(500).send({error: "Authentication failed!! Try using another email"});
    }

}

export const changePassword = async (req, res) => {
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const { currentPassword, newPassword } = req.body;
    const _id = req.user._id;

    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return res.status(403).send({error: "Password must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters."})
    }

    try {

        const user = await User.findOne({_id});

        if(!user){
            return res.status(500).send({error:"User not found"});
        }

        if(user.google_auth){
            return res.status(403).send({error: "Account is registered with google. You can not change password"});
        }

        if(!await user.comparePassword(currentPassword)){
            return res.status(403).send({error: "Current password is incorrect"});
        }

        await user.updatePassword(newPassword);

        return res.status(200).send({message: "Password changed successfully"});
        
    } catch (error) {
        return res.status(500).send({error: "Something went wrong while changing the password."});
    }    
}