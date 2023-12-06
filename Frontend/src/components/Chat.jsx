import "./chat.css"
import mobius from "../images/mobius.png"
import { getAllAssistant } from "../utils/allAssistants";
import { getAllthreads } from "../utils/allAssistants";
import { createThread } from "../utils/allAssistants";
import { thread } from "./thread";
import { useState } from "react";
import { useEffect } from "react";
import uuid from 'react-uuid';
import { messages } from "./messages";
import { run } from "./run";

const Chatbot = () => {
    const [userId,setUserId] = useState("xyz")  //for storing userid
    const [assistants,setAssistants] = useState([]) // to get all assistants
    const [selectedAssistant, setSelectedAssistant] = useState(null); // to set assistant which is selected in dropdown
    const [threadids,setThreadIds] = useState([])   // to get all thread ids for a particular usr and assistant
    const [newThread,setNewThread] = useState(false)  // the state to update when click on new chat
    const [inputValue,setInputValue] = useState("")   // to capture input value
    // const [threadId,setThreadId] = useState("")
    let sendMessage = false
    let threadId
    useEffect(()=>{
      getAllAssistant(userId).then(async (response)=>{
        console.log(response)
            setAssistants([...response])
            console.log("assistant in app",assistants)
          }).catch((e)=>{
            console.log(e)
          })
          
    },[userId])
    useEffect(()=>{
      console.log("-----------*---------- useEffect")
      getAllthreads(userId,selectedAssistant)
      .then(async (response)=>{
        console.log(response)
            setThreadIds([...response])
          }).catch((e)=>{
            console.log(e)
          })
    },[selectedAssistant])
    console.log("threads in app Chat",threadids)  
    const handleAssistantChange = (event) => {
      const selectedAssistantId = event.target.value;
      setSelectedAssistant(selectedAssistantId);
      console.log('Selected Assistant ID:', selectedAssistantId);
    };
    const handleNewSession = () =>{
      if(!selectedAssistant){
        alert("Please select Assistant")
      }else{
        setNewThread(true)
      }
    }
    const handleSendMessage =async ()=>{
      // debugger
      sendMessage = true
      if(!newThread){
        console.log("---------------")
      }
      else if(sendMessage && newThread){
        console.log(sendMessage,newThread)
        const words = inputValue.split(' ');
        // Take the first two to three words
        let id
        const capturedWords = words.slice(0, 3).join(' ');
        console.log('Captured words:', capturedWords);
        await thread().then((response)=>{    // calling thread function to create thread from openai 
          console.log("thread in chatjs",response)
          threadId = response
        })
        
        console.log("in chat.js the thread id",threadId)
        let details = {thread_id:threadId,title:capturedWords}
        await messages(threadId,inputValue).then((response)=>{ // passing input message to message api 
          console.log("in messages")
        })
        await run(threadId,selectedAssistant).then((response)=>{
          console.log("sorted messages in chat js from thread messages",response)
        })
        createThread(userId, selectedAssistant, [details]) // Pass an array of details to the backend to store thread id and title
        .then(() => {
          // Call getAllthreads after creating a new thread
          return getAllthreads(userId, selectedAssistant);
        })
        .then((response) => {
          setThreadIds([...response]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
      
      sendMessage = false
      setInputValue("")
    }
    return (
        <div className="container">
          <div className="left-panel">
            <div className="left-top">
            <img src={mobius} alt="Mobius" />
            <button onClick={handleNewSession}>New Chat</button>
            </div>
            <div className="thread-list">
              {threadids.map((threadId,index) => (
                <div id="sessionBox" key={index}>{threadId.thread_title}</div>
              ))}
            </div>
          </div>
          <div className="right-panel">
            <div className="upper-right">
            <div>
            <label htmlFor="chatDropdown"></label>
            <select id="chatDropdown" onChange={(e)=>{handleAssistantChange(e)}}>
            <option value="" disabled selected>
                Select 
                </option>
              {assistants.map((assistant) => (
                <option key={assistant.assistant_id} value={assistant.assistant_id}>
                  {assistant.assistant_name}
                </option>
              ))}
            </select>
            </div>
            
            </div>
            <div className="lower-right">
                <input type="text" id="query" onChange={(e)=>{setInputValue(e.target.value)}} value={inputValue}/>
                <button className="" onClick={handleSendMessage} value = {inputValue}>Send</button>
            </div>
          </div>
        </div>
      );
}
export default Chatbot