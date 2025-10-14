const socket=io("http://localhost:8000");


const btn=document.getElementsByClassName("btn")
const messageInput=document.getElementById("messageInp")
const messageContainer=document.querySelector(".container")
const form=document.getElementById("send-container")

var audio=new Audio("ting.mp3")

let append=(message,position)=>{
    let messageElement=document.createElement("div")
    messageElement.innerText=message
    messageElement.classList.add("message")
    messageElement.classList.add(position)
    messageContainer.append(messageElement)
    if(position=="left"){
        audio.play();
    }
}

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let message=messageInput.value
    append(`You: ${message}`,"right")
    socket.emit("send",message)
    messageInput.value=""
})

const name=prompt("Enter your name")
socket.emit("newUser",name)

socket.on("newUser",(name)=>{
    append(`${name} joined the chat`,"right")
})

socket.on("recieve",(data)=>{
    append(`${data.name}: ${data.message}`,"left")
})

socket.on("offline",(data)=>{
    append(`${data.name} ${data.message}`,"left")
})