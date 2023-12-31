import React, {useEffect, useState, useRef, useContext} from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../context/User/userContext';
import Loader from "../components/loader.component.jsx";
import toast from 'react-hot-toast';
import { Doughnut, Radar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';

const TestPrompt = () => {

  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartContainerHeight, setChartContainerHeight] = useState('400px');

  const { userAuth: { authToken } } = useContext(UserContext);
  useEffect(()=>{
    if(authToken == null){
      navigate('/signin');
    }
  }, []);

  useEffect(() => {
    const updateChartContainerHeight = () => {
      const newHeight = window.innerWidth >= 768 ? '400px' : '200px';
      setChartContainerHeight(newHeight);
    };
    updateChartContainerHeight();

    window.addEventListener('resize', updateChartContainerHeight);

    return () => {
      window.removeEventListener('resize', updateChartContainerHeight);
    };
  }, []);

  const handleSubmit = async (msg)=>{
    msg.target[0].value = '';

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
          {
            role: 'user',
            content: `Prompt: ${prompt}`
          }
        ],
        system_prompt: `
          Hey act as a professional prompt tester who is expert in his field also has more than 3 years of experince in it i will give you one task or question your job is to complete that task or answer the question as the personality provided would answer or does the task, use exact mindset, thinking methods and tone the perosnality would use.

          Task: I will provide you Prompt your task is to score that prompt based on below features provided. Also provide a response of what if i have feed that prompt to chatGPT.
          
          Prompt should be tested on below sections in prompt if they are present prompt will be given +2 marks otherwise 0.
          sections:
          assign a role/ask to simulate a professional
          define the task
          define the goal
          set constraints
          set expectations
          
          give final score and which section is missing also provide a improved prompt and sample response if prompt was feeded to chatGPT. Finally provide response strictly in json formate no other text.
          Result should only contain below formate
          {
            "assign_a_role_or_ask_to_simulate_a_professional": 0,
            "define_the_task": 0,
            "define_the_goal": 0,
            "set_constraints": 0,
            "set_expectations": 0,
            "final_score": 0,
            "missing_section": "assign_a_role_or_ask_to_simulate_a_professional",
            "improved_prompt": "",
            "sample_response_of_chatGPT": ""
          }

          strictly provide imporved_prompt and  sample_response_of_chatGPT in the json object only alog with other values

          I am giving you the Strict instruction to only give back json object in response you will type no other text.
          not any other extra text or anything
        `,
        temperature: 0.5,
        top_k: 50,
        top_p: 0.9,
        web_access: false
      })
    };
    
    try {
      setLoading(true);
      const response = await fetch(url, options);
      console.log(response)
      setLoading(false);

    } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!");
        console.error({error});
    }
  }

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Reference to the chart instance

  useEffect(() => {
    const getRandomValue = () => Math.floor(Math.random() * 10) + 1;

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Destroy the previous chart instance before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Define Role', 'Define task', 'Define goal', 'Set constrains', 'Set expectations'],
          datasets: [
            {
              label: 'Data',
              data: [
                getRandomValue(),
                getRandomValue(),
                getRandomValue(),
                getRandomValue(),
                getRandomValue(),
              ],
              backgroundColor: [
                'rgb(35, 100, 229)',
                'rgb(35, 100, 229)',
                'rgb(35, 100, 229)',
                'rgb(35, 100, 229)',
                'rgb(35, 100, 229)',
              ],
              borderColor: [
                'rgb(181, 213, 255)',
                'rgb(181, 213, 255)',
                'rgb(181, 213, 255)',
                'rgb(181, 213, 255)',
                'rgb(181, 213, 255)',
              ],
              borderWidth: 1,
              borderRadius: 20,
              borderSkipped: false,
              borderPercentage: 0.15,
              categoryPercentage: 0.2
            },
          ],
        },
        options: {
          scales: {
            x: {
              grid: {
                display: false,
                color: 'rgba(102, 102, 102, 0.2)'
              },
            },
            y: {
              grid: {
                drawBorder: false,
                drawTicks: false,
                color: (context) => {
                  if (context.index == 0 || context.index & 1) {
                    return 'rgba(0,0,0,0)';
                  }
                  return 'rgba(102, 102, 102, 0.2)';
                }
              },    
            }
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, []);

  const getRandomResult = () => Math.floor(Math.random() * 10) + 1;

  const data = {
    datasets: [
      {
        data: [getRandomResult(), 10 - getRandomResult()],
        backgroundColor: ['#2364E5', '#B5D5FF']
      },
    ],
  };

  // Chart.js options
  const options = {
    cutout:'90%',
    borderRadius:[20, -50],
    aspectRatio: 0.75,
    plugins: {
      legend: false,
      tooltip: false,
    }
  };

  return (
    <div className='relative bg-[#F5F6FA] text-black -mb-16'>
      <h1 className='text-center mx-5 mb-5 pt-5 font-semibold text-[#22254F] font-mono text-2xl'>Prompt GPT</h1>
      <div className="w-11/12 mx-auto flex gap-6 max-md:flex-wrap">
        <div className="bg-white md:h-[400px] overflow-hidden h-max rounded-md w-full md:w-3/5 shadow-md">
          <h1 className="text-xl font-bold my-3 ml-8">Overview</h1>
          <div className="chart-container mx-8 mt-5 md:-mb-10 w-full max-md:flex max-md:justify-center max-md:items-center" style={{ height: chartContainerHeight, width: '90%' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
        <div className="text-center bg-white h-max w-full md:h-[400px] md:overflow-hidden rounded-md md:w-2/5 shadow-md">
          <h1 className="text-xl font-bold my-2">Final Score</h1>
          <div className='flex justify-around items-center mt-5'>
             <div className="flex">
                  <div className='w-3 h-3 m-1 rounded-full bg-[#2364E5]'></div>
                  <p className="title-font font-medium">Scored</p>
             </div>
             <div className="flex">
                  <div className='w-3 h-3 m-1 rounded-full bg-[#B5D5FF]'></div>
                  <p className="title-font font-medium">Remaining</p>
             </div>
          </div>
          <div className="mx-auto relative w-full -mt-8">
            <Doughnut data={data} options={options} className='mx-auto' />
            <div className='absolute left-[44%] top-[44%] font-md text-3xl'>8/10</div>
          </div>
        </div>
      </div>
      <div className="w-11/12 flex max-md:flex-wrap mx-auto gap-6 mt-6 mb-3 pb-52">
        <div className="bg-white md:h-auto h-max rounded-md shadow-xl w-full md:w-1/3">
            <h1 className="text-xl font-bold my-5 ml-8 max-md:text-center">Missing Sections</h1>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
            <div className="p-2 w-full max-lg:ml-6">
              <div className="bg-gray-100 rounded flex gap-4 p-1 items-center">
                  <div className='border border-[#97c4fe] rounded-full'>
                    <div className='w-3 h-3 m-1 rounded-full bg-[#2364E5]'></div>
                  </div>
                  <p className="title-font font-medium">Authentic Cliche Forage</p>
              </div>
              <div className="bg-gray-100 rounded flex gap-4 p-1 items-center">
                  <div className='border border-[#97c4fe] rounded-full'>
                    <div className='w-3 h-3 m-1 rounded-full bg-[#2364E5]'></div>
                  </div>
                  <p className="title-font font-medium">Authentic Cliche Forage</p>
              </div>
              <div className="bg-gray-100 rounded flex gap-4 p-1 items-center">
                  <div className='border border-[#97c4fe] rounded-full'>
                    <div className='w-3 h-3 m-1 rounded-full bg-[#2364E5]'></div>
                  </div>
                  <p className="title-font font-medium">Authentic Cliche Forage</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white md:h-auto h-max rounded-md shadow-xl w-full md:w-2/3">
            <h1 className="text-xl font-bold my-5 ml-8">Improved Prompt</h1>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
            <div className="p-2 w-full">
              <div className="bg-gray-100 rounded flex max-lg:ml-5 p-4 gap-4 h-full items-center">
                  <p className="title-font font-medium text-justify">As a developer, I would like you to build a website for me. The website should include a home page, about page, and contact page. The goal of the website is to provide information about my business and allow customers to get in touch with me. The website should be mobile-friendly and have a clean, professional design. Please let me know if you need any additional information to get started.</p>
              </div>
            </div>
          </div>
        </div>
      </div>  
      <div className='absolute bottom-16 w-full flex justify-center'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          className="sm:w-2/3 w-full pt-7 mx-2 no-scollbar sm:mx-0 bg-[#FFFFFF] hover:border-[#2364E5] border-grey border-2 rounded-xl border-slate-100 transition duration-300 shadow-lg hover:shadow-xl flex"
        >
          <textarea
            className="bg-[#FFFFFF] rounded-l-full w-full px-5 text-xl text-black h-auto outline-none overflow-y-auto no-scrollbar"
            style={{ minHeight: '1rem' }}
            type="text"
            placeholder="Test here..."
          />
          <button className="bg rounded-r-full -mt-4 pr-5" type="submit">
            <i className="fi fi-rr-right rounded-full text-[#2364E5] text-2xl" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default TestPrompt;