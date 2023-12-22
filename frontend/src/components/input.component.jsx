import React, { useState } from 'react';

const InputBox = ({ name, type, id, value, placeholder, icon, disable=false }) => {
    const [passwardVisible, setPasswardVisible] = useState(false)
    return (
        <div className="relative w-100 mb-4">
            <input 
                name = {name}
                type = {type=="password" ? passwardVisible ? "text" : "password" : type}
                id = {id}
                defaultValue = {value}
                placeholder = {placeholder}
                disabled = {disable}
                className="input-box"
            />
            {
                icon.includes("twitter") ? 
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>
                :
                <i className={`fi ${icon} input-icon`}></i>
            }

            {
                type == "password" &&
                <i 
                    className={"fi fi-rr-eye" + (passwardVisible ? "" : "-crossed") + " input-icon input-icon left-[auto] right-4 cursor-pointer"}
                    onClick={() => setPasswardVisible(currentVal => !currentVal)}
                >
                </i>
            }
        </div>
    );
}

export default InputBox;