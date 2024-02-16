const io = require("socket.io")(8000, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

io.on("connection", socket=>{
    console.log(socket.id);
    socket.on("code-value", (code_value, time_stamp)=>{
        console.log(code_value, time_stamp);
        socket.broadcast.emit("text-update", code_value, time_stamp);
    });
});