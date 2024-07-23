import axios from "../axios.js";

export const filterPaginationData = async ({createNewArray = false, state, data, page, counteRoute, dataToSend, user}) => {
    let obj;

    let headers = {};
    
    if(user){
        headers.headers = {
            'authorization': `Bearer ${user}`
        }
    }

    if(state!==null && createNewArray===false){
        obj = {...state, results:[...state.results, ...data], page: page};
    }
    else if(counteRoute == 'prompt/promptsCounte'){
        const res = await axios.get(`/${counteRoute}`, { params : {dataToSend} });
        obj = {results:data, page: 1, totalDocs: res.data.totalDocs};
    }
    else{
        const res = await axios.post(`/${counteRoute}`, dataToSend, headers);
        obj = {results:data, page: 1, totalDocs: res.data.totalDocs};
    }

    return obj;
}