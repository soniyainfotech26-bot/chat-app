const router = require("express").Router();
const Message = require("../models/Message");
const Room = require("../models/Room");

router.get("/:roomId/messages", async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(messages);
});


router.post("/", async (req, res) => {
    const { name } = req.body;
    const room = new Room({ name, users: [] });
    await room.save();
    const io = req.app.get("io");
    io.emit("createroom", room);
    res.status(201).json(room);
});

module.exports = router;