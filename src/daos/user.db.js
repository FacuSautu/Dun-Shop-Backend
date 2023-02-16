import userModel from './models/user.model.js';
import cartModel from './models/cart.model.js';

class UserDB{

    constructor(){}

    async addUser(userToAdd){
        let cart = await cartModel.create({});

        userToAdd.cart = cart["_id"];

        return userModel.create(userToAdd);
    }

    getUserByCredentials(email, pass){
        return userModel.find({email, password:pass});
    }

}

export default UserDB;