const LoadMoreData = ({state, fetchDataFunc, additionalParam})=>{

    if(state !== null && state.totalDocs > state.results.length){
        return (
            <button 
                onClick={()=>fetchDataFunc({...additionalParam, page:state.page+1, createNewArray: false})}
                className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
                Load More
            </button>
        )
    }
}

export default LoadMoreData;