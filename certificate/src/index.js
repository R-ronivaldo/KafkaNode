require('dotenv/config');
import { Kafka } from 'kafkajs';
import Mail from './lib/Mail';

const kafka = new Kafka({
    brokers: ['localhost:9092'],
    clientId: 'email',
});

const topic = 'issue-email';
const consumer = kafka.consumer({ groupId: 'email-group'});
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

            await Mail.sendMail({
                from: 'Fila Teste <fila@filateste.com.br>',
                to: `${payload.user.name} <${payload.user.email}>`,
                subject: 'Cadastro de Usuário',
                html: `Olá, ${payload.user.name}, cadastro realizado com sucesso!`
            });

            await producer.send({
                topic: 'email-response',
                messages: [
                    { value: `Email enviado para o usuário ${payload.user.name}!`}
                ]
            })
        },
    });
}

run().catch(console.error);