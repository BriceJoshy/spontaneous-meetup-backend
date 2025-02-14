const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "meetupApp",
  brokers: ["localhost:9092"], // Change if using a cloud-based Kafka service
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "meetupGroup" });

const initKafka = async () => {
  await producer.connect();
  await consumer.connect();
  console.log("✅ Kafka Connected");
};

module.exports = { producer, consumer, initKafka };
