const kafka = require("../config/Kafka");
const Message = require("../models/Message");

const consumer = kafka.consumer({ groupId: "chat-group" });

const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "chat-messages" });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value.toString());
      await Message.create(data);
      console.log("Message saved:", data.text);
    }
  });
};

module.exports = startConsumer;
