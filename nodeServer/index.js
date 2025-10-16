const io=require("socket.io")(8000,{
    cors: {
        // 1. Specify the exact origin the client is connecting from
        //    (The address where your index.html is loaded)
        origin: [
            "http://localhost:5173", 
            "http://127.0.0.1:5173"], 
        
        // 2. Specify the methods you will use (GET, POST, etc.)
        methods: ["GET", "POST"]
    }
})

let users={}

io.on("connection",(socket)=>{

    socket.on("newUser",(name)=>{
        users[socket.id]=name
        socket.broadcast.emit('newUser',name)
        console.log("New User",name)
    })

    socket.on('send',(message)=>{
        socket.broadcast.emit('recieve',{message:message,name:users[socket.id]})
    })

    socket.on("disconnect",()=>{
        socket.broadcast.emit("offline",{message:`went offline`,name:users[socket.id]})
        console.log("Disconnected")
        delete users[socket.id]; 
    })
})