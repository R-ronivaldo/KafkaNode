import express from 'express';
import { Kafka } from 'kafkajs';

import routes from './routes';

const app = express();
app.use(express.json());

//conect
const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'email-group-to-receive'});

// disponibiliza p/ todas as rotas
app.use((req, res, next) => {
    req.producer = producer;

    return next();
});

// cadastra rotas
app.use(routes);

async function run() {
    await producer.connect();
    await consumer.connect();

    await consumer.subscribe({ topic: 'email-response' });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Resposta', String(message.value));
        }
    });

    app.listen(3001, () => {
        console.log("running app!");
    });
}

run().catch(console.error)