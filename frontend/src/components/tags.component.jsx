const Tag = ({tag, index, newPrompt, setNewPrompt}) => {

    let { tags } = newPrompt;

    const deleteTag = (e) => {
        tags = tags.filter(t => t !== tag);

        setNewPrompt({...newPrompt, tags});
    }

    return (
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white hover:bg-opacity-50 pr-8 rounded-full inline-block">
            <p className="outline-none mr-2">{tag}</p>
            <button className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2" onClick={deleteTag}>
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    );
}

export default Tag;