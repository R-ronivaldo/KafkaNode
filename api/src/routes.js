import express from 'express';
import { CompressionTypes } from 'kafkajs';

const routes = express.Router();

routes.post("/users", async (req, res) => {
    const { name, email } = req.body;

    // create user on dabase

    const message = {
        user: { name: name, email: email},
    }

    await req.producer.send({
        topic: 'issue-email',
        compression: CompressionTypes.GZIP,
        messages: [
            { value: JSON.stringify(message) },
        ],
    })
    
    return res.json({ ok: true });
});

export default routes;