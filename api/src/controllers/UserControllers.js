import User from '../models/User';
import { CompressionTypes } from 'kafkajs';

module.exports = {
    
    async index(req, res) {
        const users = await User.findAll();
        return res.json(users);
    },

    async store(req, res){
        const { name, email } = req.body;
        
        const user = await User.create({ name, email });
        
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
            
        return res.json(user);
    } 
};