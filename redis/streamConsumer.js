const redis = require("../config/redis");
const Message = require("../models/Message");
require("../config/db");


(async () => {
  const streamKey = "chat-stream";
  const groupName = "chat-group";

  try {
   await redis.xGroupCreate(
  streamKey,
  groupName,
  '$',
  { MKSTREAM: true }
);
    console.log("Consumer group created");
  } catch (err) {
    if (err.message.includes("BUSYGROUP")) {
      console.log("Consumer group already exists, skipping creation");
    } else {
      throw err;
    }
  }

  while (true) {
    const response = await redis.xReadGroup(
      groupName,
      "consumer-1",
      [{ key: streamKey, id: ">" }],
      { COUNT: 10, BLOCK: 5000 }
    );

    if (!response) continue;

    for (const stream of response) {
      for (const msg of stream.messages) {
        const data = msg.message;
        console.log("Received:", data);
         await Message.create({
          roomId: data.roomId,
          senderId: data.senderId,
          text: data.text
        });
        // Save to DB here
        await redis.xAck(streamKey, groupName, msg.id);
      }
    }
  }
})();
