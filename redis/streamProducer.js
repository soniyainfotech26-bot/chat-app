const redis = require("../config/redis");

module.exports = async (message) => {
  await redis.xAdd("chat-stream", "*", {
    roomId: message.roomId,
    senderId: message?.senderId,
    text: message.text
  });
};
