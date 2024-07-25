import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_APIKEY,
  authDomain: import.meta.env.VITE_APP_API_AUTHDOMAIN,
  projectId: import.meta.env.VITE_APP_API_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_API_STORAGE,
  messagingSenderId: import.meta.env.VITE_APP_API_MID,
  appId: import.meta.env.VITE_APP_API_APPID
};

const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async() => {
    let user = null;
    try {
        const result = await signInWithPopup(auth, provider);
        user = result.user;
        return user;
    } catch (error) {
        return error;
    }
}