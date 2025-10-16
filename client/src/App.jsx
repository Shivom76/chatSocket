import '/public/css/style.css'
import {useState,useEffect,useCallback,useRef} from "react";
import React from "react"
import { io } from "socket.io-client"; // Note the package name 'socket.io-client'
import {v4 as uuidv4} from 'uuid';

// Then, use it to create the connection
const socket = io("http://localhost:8000"); 

function App() {
  const [text,setText]=useState("")
  const [messages,setMessages]=useState([])

  const [name,setName]=useState(null)
  const hasPrompted = useRef(false); 
    // ()=>{
    // let userName=prompt("Enter your name:")
    // return userName
  // }) 
  // const users={}
  // const name=prompt("Enter your name:")

  let inpData=(e)=>{
    setText(e.target.value)
  }

  let handleSubmit=(e)=>{
    e.preventDefault()
    console.log(text)
    let message=text
    socket.emit("send",message)
    addMessage(`You: ${message}`, 'right');

    setText("")
  }

  const addMessage=useCallback((message,position)=>{
    const newMessage={
      id:uuidv4(),
      message:message,
      position:position
    }

    setMessages(prevMessages=>[...prevMessages,newMessage])
  },[])

  useEffect(()=>{
    if (name === null && !hasPrompted.current) {
      hasPrompted.current = true; // Set the flag immediately
      let userName = prompt("Enter your name:");
      
      if (userName) {
          setName(userName);
      }
    }
  }, [name])

  useEffect(()=>{

    if (name) {
      socket.emit('newUser', name);
    }

    const handleNewUser = (joinName) => {
      addMessage(`${joinName} joined the chat`, 'right');
    };

  const handleReceive = (data) => {
      addMessage(`${data.name}: ${data.message}`, 'left');
    };

    socket.on('newUser',handleNewUser)

    socket.on('recieve',handleReceive)

    return () => {
      socket.off('newUser', handleNewUser);
      socket.off('recieve', handleReceive);
    };


  }, [name, addMessage])


function MessageList({ messages }) {


  return (
      // The messages array is mapped to create a <div> for each item
      <> 
          {messages.map(msg => (
              <div 
                  key={msg.id} // IMPORTANT: Uses the unique ID generated in addMessage
                  className={`message ${msg.position}`}
              >
                  {msg.message}
              </div>
          ))}
      </>
  );
}

  return (
    <>
          <h2>Chat box</h2>
    
          <div className="container">
              {/* <div className="message right">Hello I am right</div>
              <div className="message left">Hello I am left</div> */}
              
              <MessageList messages={messages}></MessageList>

          </div>

          <div className="send">
              <form action="#" id="send-container" onSubmit={handleSubmit}>
                  <input type="text" name="messageInp" id="messageInp" onChange={inpData} value={text}></input> 
                  <button type="submit" className="btn">Send</button>
              </form>
          </div>
    </>
  )
}

export default App
