import { useContext, useState, useEffect } from "react";
import axios from "../axios.js";
import UserContext from "../context/User/userContext";
import { filterPaginationData } from "../common/filter-pagination-data";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/loader.component.jsx";
import AnimationWrapper from "../common/page-animation.jsx";
import NoData from "../components/nodata.component.jsx";
import NotificationCard from "../components/notification-card.component.jsx";
import LoadMoreData from "../components/load-more.component.jsx";

const Notifications = () =>{

    const { userAuth, setUserAuth, userAuth: {authToken, newNotification} } = useContext(UserContext);

    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState(null);

    const filters = ["all", "like", "comment", "reply"];

    const fetchNotifications = async ({page, deletedDocCount = 0}) => {
        try {
            const results = await axios.post('/user/notifications', {page, filter, deletedDocCount}, {
                headers:{
                    'authorization': `Bearer ${authToken}`
                }
            });

            if(newNotification){
                setUserAuth({...userAuth, newNotification: false});
            }

            const notificationsData = results.data;
            let formatedData = await filterPaginationData({
                state: notifications,
                data: notificationsData,
                page,
                counteRoute: 'user/notificationsCount',
                dataToSend: {
                    filter,
                },
                user:authToken
            });

            setNotifications(formatedData);
            
        } catch (error) {
            toast.error("Error fetching notifications");
        }
    }

    useEffect(()=>{

        if(authToken){
            fetchNotifications({page: 1});
        }

    }, [authToken, filter])

    const handleFilter = (e) =>{
        setFilter(e.target.innerHTML.toLowerCase());
        setNotifications(null);
    }

    return(
        <div>
            <h1 className="max-md:hidden">Recent Notification</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filtername, i) => {
                        return <button key={i} className={"py-2  "+(filter == filtername ? "btn-dark" : "btn-light")}
                        onClick={handleFilter}    
                    >{filtername}</button>
                    })
                }
            </div>

            {
                notifications ? 
                <>
                    {
                        notifications.results.length ?
                            notifications.results.map((notification, i) => {
                                return <AnimationWrapper key={i} transition={
                                    {
                                        delay: i * 0.1,
                                    }
                                }>
                                    <NotificationCard data={notification} index={i} notificationState={{notifications, setNotifications}} />
                                </AnimationWrapper>
                            })
                        :
                        <NoData message="Quiet as a ninja - no new alerts!" />
                    }

                    <LoadMoreData state={notifications} fetchDataFunc={fetchNotifications} additionalParam={{deletedDocCount:notifications.deletedDocCount}} />
                </>
                :
                <Loader />
            }

            <Toaster />
        </div>
    )
}

export default Notifications;