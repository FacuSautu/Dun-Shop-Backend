import mongoose from 'mongoose';

const messagesCollection = 'messages';

const messagesScheme = mongoose.Schema({
    user: String,
    message: String,
})

export const messagesModel = mongoose.model(messagesCollection, messagesScheme);