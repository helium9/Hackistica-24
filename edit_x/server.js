const express = require("express")
const app = express()
const http = require("http");
const {Server} =require('socket.io')
const server = http.createServer(app);
const cors = require("cors");
const documentModel = require('./models/Document.js');
const connectDB = require("./config/db.js")
const dotenv = require("dotenv");
const morgan = require("morgan");
// const { default: mongoose } = require("mongoose");

dotenv.config({path: ".env"});

connectDB();

app.use(cors());
app.use(express.json({"path" : ".env"}));
app.use(morgan('dev'));

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST","DELETE","PUT"]
    }
});

roomUsers={
    "new-room123":[],
    content: "//some content"
}

io.on("connection",(socket)=>{
    console.log("join-room emit has to be done")
    socket.on('join-room',({username,roomId}) => {

        console.log("socket connection start");
        socket.join(roomId);
        console.log("socket id:" + socket.id + "  roomId:" + roomId ," username:" + username);
        if (typeof roomUsers[roomId] === 'undefined') {
            console.log(`Initializing roomUsers for roomId: ${roomId}`);
            roomUsers[roomId] = [];
        }
        const existingUser = roomUsers[roomId].find(user => user.username === username);
        if (!existingUser) {
            roomUsers[roomId].push({ id: socket.id, username });
            socket.to(roomId).emit('user-joined', { username,roomUsers });
            socket.broadcast.to(roomId).emit('user-joined', username);
            console.log("iser joined "+ username);
          } else {
            console.log(`User ${username} already in room ${roomId}, not re-adding or notifying.`);
          }
          io.in(roomId).emit('connected-users', roomUsers[roomId].map(user => user.username));
          console.log(roomUsers);
          
          
          
    });
    let content;
    socket.on('get_document',(document)=>{
        console.log("Hello")
        console.log(document);
        content = document.document;
        roomUsers["content"] = document.document;
        console.log("Hell asdasd")
        socket.broadcast.to(document.roomId).emit('get_value',content)
      })
      console.log("hey",content);
    console.log("join-room has emitted");
    
    socket.on("disconnect",()=>{
        console.log(`User disconnected: ${socket.id}`)
    })
})

server.listen(8001,()=>{
    console.log("server is running")
})