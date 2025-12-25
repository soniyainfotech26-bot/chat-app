const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'chat-app',
  brokers: ['127.0.0.1:9092']
});

const producer = kafka.producer(); // WILL work now
