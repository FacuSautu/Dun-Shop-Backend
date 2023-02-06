import mongoose from 'mongoose';
import messageModel from './models/message.model.js';

class MessageDB{

    constructor(){}

    getMessages(){
        return messageModel.find();
    }

    async addMessage(messageToAdd){

        return messageModel.create(messageToAdd);
    }
}

export default MessageDB;