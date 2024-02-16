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
const { find } = require("./models/Document.js");
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

let roomUsers={
    content_text: "//some content"
}

let Rooms = {
    "new-room#123":{
        users: [],
        content: ""
    }
}

io.on("connection",(socket)=>{
    console.log("join-room emit has to be done");
    console.log(roomUsers.content_text);
    socket.on('join-room',async({username,roomId,document}) => {
        let room =await documentModel.findOne({roomId});
        // console.log(room);
        if(room){
            console.log("room join ",room);
            console.log("------------------------------------------------------");
            console.log(room.content);
            console.log("-----------------------------------------------------")
            room.users.push(username);
            roomUsers.content_text = room.content;
            Rooms[roomId].users = [...Rooms[roomId].users,username];
            Rooms[roomId].content = room.content;
            document = content;
            await room.save();
            console.log(room);
        }else{
            const users = [];
            users.push(username);
            let content = "//some comment";
            room = new documentModel({roomId,users,content});
            console.log(content);
            console.log("Hello",room)
            Rooms[roomId] = {
                users: users,
                content: content
            }
            await room.save();
            document = "//some comment"
        }
        console.log("room ",room);
        console.log("roomUsers ",roomUsers);
        roomUsers.content_text = document;
        console.log("Hello mad",document);
        console.log(roomId);
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
            socket.to(roomId).emit('user-joined',username);
            socket.broadcast.to(roomId).emit('user-joined', username);
            // socket.to(roomId).broadcast.emit('user-joined',username);
            console.log("user joined "+ username);
          } else {
            console.log(`User ${username} already in room ${roomId}, not re-adding or notifying.`);
          }
          io.in(roomId).emit('connected-users', roomUsers[roomId].map(user => user.username));
          console.log(roomUsers);
          console.log("------------------- ",room.content);
          socket.emit('intializing_document',room.content);
          
    });
    let content;
    socket.on('get_document',async(document)=>{
        console.log("Hello")
        console.log("document ",document);
        content = document.document;
        // roomUsers[content_text] = document.document;
        const roomId = document.roomId;
        let room = await documentModel.findOne({roomId});
        console.log(document.document);
        room.content = document.document;
        await room.save();
        console.log("room get_document ",room);
        roomUsers.content_text = document.document;
        
        let location = document.location;
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