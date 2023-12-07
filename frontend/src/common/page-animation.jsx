import {AnimatePresence , motion} from "framer-motion";

const AnimationWrapper = ({ children, keyValue, classname, initial = { opacity : 0}, animate = { opacity : 1}, transition = { duration : 1}}) => {
    return(
        <AnimatePresence>
             <motion.div
                key = {keyValue}
                initial= {initial}
                animate= {animate}
                transition={transition}
                className={classname}
            >
                    {children}
            </motion.div>
        </AnimatePresence>
    )
};

export default AnimationWrapper;