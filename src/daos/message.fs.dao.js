import fs from 'fs';

class MessageFsDAO{
    
    constructor(path){
        this.fs = fs.promises;
        this.path = path;
        this.messages = [];
        
        if(!fs.existsSync(this.path)){
            fs.writeFileSync(this.path, "[]");
        }

        this.loadMessages();
    }

    async getMessages(){
        return await this.readMessages();
    }

    async addMessage(messageToAdd){
        let messages = await this.readMessages();
        
        messages.append(messageToAdd);

        this.messages = messages;
        await this.writeMessages();

        return messageToAdd;
    }

    async readMessages(){
        return JSON.parse(await this.fs.readFile(this.path, 'utf-8'));
    }

    async writeMessages(){
        await this.fs.writeFile(this.path, JSON.stringify(this.messages, null, "\t"));
    }

    async loadMessages(){
        this.messagres = await this.readMessages();
    }
}

export default MessageFsDAO;