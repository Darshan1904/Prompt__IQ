import React, {useEffect, useState, useRef, useContext} from 'react';
import { useNavigate } from 'react-router';
import Typewriter from 'typewriter-effect';
import UserContext from '../context/User/userContext';
import Loader from "../components/loader.component.jsx";
import toast from 'react-hot-toast';

const TestPrompt = () => {

  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [messages, setMessages] = useState([{
    "role" : "bot",
    "content" : "How can I help you today?"
  }]);

  const { userAuth: { authToken } } = useContext(UserContext);
  useEffect(()=>{
    if(authToken == null){
      navigate('/signin');
    }

    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, finishedTyping]);

  const handleSubmit = async (msg)=>{
    const message = msg.target[0].value;
    msg.target[0].value = '';
    let question = {
      "role" : "user",
      "content" : message
    }
    const newMessages = [...messages, question];
    setMessages(newMessages);

    setFinishedTyping(false);
    const url = import.meta.env.VITE_APP_API_URL;
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': import.meta.env.VITE_APP_API_KEY,
        'X-RapidAPI-Host': import.meta.env.VITE_APP_API_HOST
      },
      body: JSON.stringify({
        messages: [
          ...messages,
          {
            role: 'user',
            content: `${prompt}`
          }
        ],
        system_prompt: "",
        temperature: 0.5,
        top_k: 50,
        top_p: 0.9,
        web_access: false
      })
    };
    
    try {
      setLoading(true);
      const response = await fetch(url, options);
      let result = await response.text();
      result = JSON.parse(result);
      const ans = {
        "role" : "bot",
        "content" : result.result
      }
      setLoading(false);
      setMessages((prevmessages)=>[...prevmessages, ans]);

    } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!");
    }
  }

  return (
    <div className='relative bg-white text-black h-[calc(100vh-100px)]'>
      <h1 className='text-center m-5 font-semibold text-[#22254F] font-mono text-2xl'>Prompt GPT</h1>
      <div className='text-xl mx-auto px-auto w-full h-4/6 overflow-y-scroll overflow-x-auto msgs no-scrollbar' ref={scrollRef}>
        {messages?.map((msg, index)=>{
          return (
            msg.role === "bot" ? 
            <div key={index} className='flex relative gap-4 sm:w-2/3 w-full my-5 mx-2 sm:mx-auto py-3 px-1 rounded-lg'>
              <div className='rounded-full absolute px-3 pt-2 bg-grey'><i className='fi fi-rr-bulb text-3xl'/></div>
              <div className='text-black font-mono sm:text-lg text-xl ml-16'>
                <p className="font-bold text-xl">Prompt GPT</p>
                  <Typewriter
                      options={{
                        delay: 10,
                      }}
                      onInit={(typewriter) => {
                          typewriter
                          .typeString(msg.content)
                          .start()
                      }}
                  />
              </div>
            </div>
            :
            <div key={index} className='flex relative gap-4 sm:w-2/3 w-full mx-2 sm:mx-auto py-3 px-1 rounded-lg'>
              <div className='absolute rounded-full px-3 pt-2 bg-grey'><i className='fi fi-rr-user text-3xl'/></div>
              <div className='text-black font-mono sm:text-lg text-xl ml-16'>
                <p className="font-bold text-xl">You</p>
                <p className='w-full overflow-x-clip'>{msg.content}</p>
              </div>
            </div>
          )
        })}
        {loading &&  <Loader />}
      </div>
      <div className='absolute bottom-5 w-full flex justify-center'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          className="sm:w-2/3 w-full pt-7 mx-2 no-scollbar sm:mx-0 bg-[#FFFFFF] hover:border-purple/90 border-grey border-2 rounded-xl border-slate-100 transition duration-300 shadow-lg hover:shadow-xl flex"
        >
          <textarea
            className="bg-[#FFFFFF] rounded-l-full w-full px-5 py-2 text-xl text-black h-auto outline-none overflow-y-auto no-scrollbar"
            style={{ minHeight: '1rem' }}
            type="text"
            placeholder="Type here..."
          />
          <button className="bg rounded-r-full -mt-4 pr-5" type="submit">
            <i className="fi fi-rr-right rounded-full text-purple/90 text-2xl" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default TestPrompt;