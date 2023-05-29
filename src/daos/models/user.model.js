import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique:true
    },
    age: Number,
    password: String,
    rol: {
        type: String,
        default: 'user'
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
    documents:{
        type:[{
            name: String,
            reference: String
        }]
    },
    last_connection: Date
})

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;