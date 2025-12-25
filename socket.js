const produceMessage = require("./redis/streamProducer");
const jwt = require('jsonwebtoken');
const Message = require("./models/Message");
const Room = require("./models/Room");




module.exports = (io) => {
  io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Unauthorized"));
  jwt.verify(token, "SECRET", (err, decoded) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = decoded;
    next();
  });
});

  io.on("connection", (socket) => {
    socket.on("joinRoom", async (roomId) => {
      console.log("roomId",roomId)
      socket.join(roomId);
       const history = await Message.find({"roomId":roomId}).sort({ createdAt: 1 });
       socket.emit("chatHistory", history);
    });

    socket.on("roomHistory", async () => {
       const history = await Room.find({}).sort({ createdAt: 1 });
       socket.emit("roomHistoryList", history);
    });

    socket.on("sendMessage", async (data) => {
     io.to(data.roomId).emit("message", {
       senderId: socket.user.username || socket.user.email || data.senderId,
       text: data.text
      });
      await produceMessage(data);
    });
  });
};
