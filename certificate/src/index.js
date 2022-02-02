import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'certificate',
});

const topic = 'issue-certificate';
const consumer = kafka.consumer({ groupId: 'certificate-group'});
const producer = kafka.producer();

async function run() {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const prefix = `${topic}[${partition} | ${message.offset} / ${message.timestamp}]`;
            console.log(`- ${prefix} ${message.key}#${message.value}`);

            const payload = JSON.parse(message.value);

            await producer.send({
                topic: 'certificate-response',
                messages: [
                    { value: `Certificado gerado para o usuário ${payload.user.name}!`}
                ]
            })
        },
    });
}

run().catch(console.error);