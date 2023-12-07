import { useEffect, useRef, useState } from "react";

export let activeTabRef;
export let activeTab;

const InPageNavigation = ({routes, defaultActiveIndex = 0, defaultHidden = [], children}) => {
    const [activeRouteIndex, setActiveRouteIndex] = useState(defaultActiveIndex);
    activeTabRef = useRef();
    activeTab = useRef();

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabRef.current.style.width = `${offsetWidth}px`;
        activeTabRef.current.style.left = `${offsetLeft}px`;

        setActiveRouteIndex(i);
    }

    useEffect(() => {
        changePageState(activeTab.current, defaultActiveIndex);
    }, []);

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, index) => {
                        return (
                            <button key={index} className={"p-4 px-5 capitalize " + (activeRouteIndex === index ? "text-black " : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden " : "")}

                                onClick={(e) => {
                                    changePageState(e.target, index);
                                }}

                                ref = {activeRouteIndex === index ? activeTab : null}
                            >
                                {route}
                            </button>
                        )
                    })
                }

                <hr ref={activeTabRef} className="absolute bottom-0 duration-300" />
            </div>

            {Array.isArray(children) ? children[activeRouteIndex] : children}
        </>
    );
};

export default InPageNavigation;