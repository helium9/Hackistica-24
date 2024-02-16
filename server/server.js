const io = require("socket.io")(8000, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

io.on("connection", socket=>{
    console.log(socket.id);
    socket.on("code-value", (code_value)=>{
        console.log(code_value);
        socket.broadcast.emit("text-update", code_value);
    });
});