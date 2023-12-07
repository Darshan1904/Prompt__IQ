import React, { useState } from 'react';

const InputBox = ({ name, type, id, value, placeholder, icon }) => {
    const [passwardVisible, setPasswardVisible] = useState(false)
    return (
        <div className="relative w-100 mb-4">
            <input 
                name = {name}
                type = {type=="password" ? passwardVisible ? "text" : "password" : type}
                id = {id}
                defaultValue = {value}
                placeholder = {placeholder}
                className="input-box"
            />
            <i className={`fi ${icon} input-icon`}></i>

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