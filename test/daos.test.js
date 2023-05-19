import chai from 'chai';
import mongoose from 'mongoose';

import config from '../src/config/config.js'
import { generateUser } from '../src/tests/mocks/users.mock.js';
import UserDao from '../src/daos/user.db.dao.js';
import userModel from '../src/daos/models/user.model.js';

const expect = chai.expect;

mongoose.connect(config.mongo_url, (error)=>{
    if(error){
        console.log("Cannot connect to database: "+error);
        process.exit();
    }
})

export const DaoTests = describe('Test de DAOs', function(){

    describe('User DB Dao', ()=>{
        before(function(){
            this.timeout(5000);
            this.userDao = new UserDao();
            
            this.userTest = generateUser();
            this.userOnDB;
        })
        beforeEach(function(){
            this.timeout(5000);
        })
    
        it('Se debe poder agregar un usuario nuevo', async function(){
            this.userOnDB = await this.userDao.addUser(this.userTest);
    
            expect(this.userOnDB._id).to.be.deep.ok;
        })
    
        it('Se debe poder obtener un usuario por ID', async function(){
            const user = await this.userDao.getUserById(this.userOnDB._id);
    
            expect(user._id).to.be.deep.ok;
        })
    
        it('Se debe poder obtener un usuario por E-Mail', async function(){
            const user = await this.userDao.getUserByEmail(this.userOnDB.email);
    
            expect(user._id).to.be.deep.ok;
        })
    
        it('Se debe poder actualizar la contraseña de un usuario', async function(){
            const user = await this.userDao.updateUserPassword(this.userOnDB._id, 'nuevapasswordtest');
    
            expect(user.password).to.not.be.equal(this.userOnDB.password);
        })
    
        it('Se debe poder cambiar el rol del usuario', async function(){
            const new_rol = this.userOnDB.rol === 'user' ? 'premium' : 'user';
            const user = await this.userDao.updateUserRol(this.userOnDB._id, new_rol);
    
            expect(user.rol).to.not.be.equal(this.userOnDB.rol);
        })
    
        after(async function(){
            await userModel.deleteOne({_id:this.userOnDB._id});
        })
    })
})