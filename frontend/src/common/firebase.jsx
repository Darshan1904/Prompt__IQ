import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCXVKy2e0S7hnNk0XNXB_NTVdHdtesBD0",
  authDomain: "promptiq-59efc.firebaseapp.com",
  projectId: "promptiq-59efc",
  storageBucket: "promptiq-59efc.appspot.com",
  messagingSenderId: "546733260944",
  appId: "1:546733260944:web:9c7c0b561531ac017bd815"
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
        console.log(error);
    }
}