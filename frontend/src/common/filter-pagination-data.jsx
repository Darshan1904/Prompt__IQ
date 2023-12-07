import axios from "../axios.js";

export const filterPaginationData = async ({createNewArray = false, state, data, page, counteRoute, dataToSend}) => {
    let obj;

    if(state!==null && createNewArray===false){
        obj = {...state, results:[...state.results, ...data], page: page};
    }
    else{
        const res = await axios.post(`/${counteRoute}`, dataToSend);
        obj = {results:data, page: 1, totalDocs: res.data.totalDocs};
    }

    return obj;
}