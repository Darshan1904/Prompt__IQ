import React, { useState, useEffect } from "react";
import UserContext from "./userContext";
import { getFromSession } from "../../common/session.jsx";

const UserState = (props) => {

    const [userAuth, setUserAuth] = useState({});
    useEffect(() => {
        let userInSession = getFromSession("user");

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({authToken: null});

    }, []);

    return (
        <UserContext.Provider value={{userAuth, setUserAuth}}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserState;