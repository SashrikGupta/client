import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {marked} from 'marked';

function App() {
  const [count, setCount] = useState(0)
  const [state, setState] = useState(0);
  const [load, setLoad] = useState(false);
  const [trans, setTrans] = useState('');
  const [full , set_full] = useState('hi ') ; 
  const [chat, setChat] = useState([{ cont: "hello ", ai: false }]);
  const [userInput, setUserInput] = useState('');
  const [loady , setloady] = useState(false) ; 
  
  const chat_handler = async () => {
    if (userInput.trim() === '') return;

    const newChat = [...chat, { cont: userInput, ai: false }];
    setChat(newChat);
    setUserInput('');

    const prompt = full + "\nUser: " + userInput + "\nAI:";
    setloady(true);

    try {
        const response = await fetch('http://localhost:5000/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query: prompt })
        });

        const data = await response.json();
        const aiResponse = data.response;

        setChat([...newChat, { cont: aiResponse, ai: true }]);
    } catch (error) {
        console.error("Error fetching AI response:", error);
    } finally {
        setloady(false);
    }
};

  



  return (
    <>
          <div>
         
            <h1>A.I chat bot </h1> 
    
            <div className='flex justify-center items-center h-[70vh] w-[90vw] rounded-xl backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
              {chat[0] ? (
                <div>
                  <div className='w-[76vw] h-[60vh] overflow-y-scroll text-left' style={{ scrollbarColor: 'white', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
                    {chat.map((el, index) => (
                      <div key={index}>
                        {el.ai ? (
                          <div style={{background: "linear-gradient(45deg, green, white, green)"}} className='w-[60vw] pl-2 m-2 rounded-md' dangerouslySetInnerHTML={{ __html: marked(el.cont)}}>
                            
                          </div>
                        ) : (
                          <div className='w-[74vw] flex-col items-end'>
                            <div className='flex w-[74vw]'>
                            <div className='w-[60vw]'></div>
                            <div className='w-[20vw] pl-2 m-2 rounded-md bg-black/10'>
                              {el.cont}
                            </div>
                            </div>
                            {
                          (loady && index==chat.length-1) ? (<>
                          <div className='loader'> </div>
                          </>) : <></>
                        }
                          </div>
                          
                        )}

                      </div>
                      
                    ))}
                  </div>
                  <div className='flex'>
                    <input 
                      id="ok" 
                      className='w-[65vw] mt-3 h-[4vh] bg-white/50 rounded-md'
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                    <div>
                      <button 
                        onClick={chat_handler} 
                        style={{background: "linear-gradient(45deg, green , white, green)"}} 
                        className='flex text-[4vh] justify-center items-center w-[10vw] mt-3 ml-[1vw] h-[4vh] rounded-lg'
                      >
                        send
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {load && <div className='loader mr-2'/>}
                </>
              )}
            </div>       
          </div>
        
    </>
  )
}

export default App
