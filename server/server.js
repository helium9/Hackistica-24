const io = require("socket.io")(8000, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// Store room states (current code and language for each room)
const roomStates = new Map();

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Handle room joining
  socket.on("join-room", (roomID, callback) => {
    socket.join(roomID);
    console.log(`Socket ${socket.id} joined room: ${roomID}`);

    // Send current room state to the joining user
    const roomState = roomStates.get(roomID);
    if (roomState) {
      console.log(`Sending current state to ${socket.id} in room ${roomID}`);
      socket.emit("room-state", roomState);
    }

    // Notify others in the room that someone joined
    socket.to(roomID).emit("user-joined", socket.id);
  });

  // Handle language changes
  socket.on("language-change", (languageIndex, roomID) => {
    console.log(`Language changed to index ${languageIndex} in room ${roomID}`);

    if (roomID && roomID !== "") {
      // Update room state
      const roomState = roomStates.get(roomID) || {};
      roomState.languageIndex = languageIndex;
      roomStates.set(roomID, roomState);

      // Broadcast to others in the room
      socket.to(roomID).emit("language-update", languageIndex);
    } else {
      socket.broadcast.emit("language-update", languageIndex);
    }
  });

  // Handle code changes with room support
  socket.on("code-value", (code_value, roomID, time_stamp) => {
    console.log(
      `Code update in room ${roomID}:`,
      code_value.substring(0, 50) + "..."
    );

    // Update room state with latest code
    if (roomID && roomID !== "") {
      const roomState = roomStates.get(roomID) || {};
      roomState.code = code_value;
      roomState.timestamp = time_stamp;
      roomStates.set(roomID, roomState);

      // Broadcast to room
      socket.to(roomID).emit("text-update", code_value, time_stamp);
    } else {
      // If no room, broadcast to all
      socket.broadcast.emit("text-update", code_value, time_stamp);
    }
  });

  // Request current state from other users in the room
  socket.on("request-room-state", (roomID) => {
    console.log(`${socket.id} requesting state for room ${roomID}`);
    socket.to(roomID).emit("state-request", socket.id);
  });

  // Send current state to a specific user
  socket.on("send-state", (targetSocketId, code, languageIndex, roomID) => {
    console.log(`Sending state from ${socket.id} to ${targetSocketId}`);
    io.to(targetSocketId).emit("room-state", { code, languageIndex });

    // Also update room state
    if (roomID && roomID !== "") {
      roomStates.set(roomID, { code, languageIndex, timestamp: Date.now() });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
