import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: 'user'
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
    }
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;