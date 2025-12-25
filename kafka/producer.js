const kafka = require("../config/Kafka");

const producer = kafka.producer();

const sendMessage = async (message) => {
  await producer.connect();
  await producer.send({
    topic: "chat-messages",
    messages: [{ value: JSON.stringify(message) }]
  });
};

module.exports = sendMessage;
