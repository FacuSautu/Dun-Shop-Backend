import UserService from "../services/users.service.js";

class UserController {
    constructor(){
        this.userService = new UserService();
    }

    getUsers(){
        return this.userService.getUsers();
    }

    changeRol(id){
        return this.userService.changeRol(id);
    }

    loadDocuments(id, files){
        return this.userService.addDocument(id, files);
    }

    deleteExpiredUsers(){
        return this.userService.deleteExpiredUsers();
    }
}

export default UserController;