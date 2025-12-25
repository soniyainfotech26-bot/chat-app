const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const socketHandler = require("./socket");
require("./redis/streamConsumer");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/rooms", require("./routes/room.route"));

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
app.set("io", io);

socketHandler(io);
connectDB();

server.listen(3000, () => console.log("Server running on port 3000"));
