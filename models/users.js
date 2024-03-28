'use strict'

const bcrypt = require('bcrypt');

class Users {
    

    constructor (db) {
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('users')
    }

    async create (data) {
        const user = {
            ...data
        };
        if  (user.admin === 'Si') {
            user.admin = true
        } else {
            user.admin = false
        }
        user.password = await this.constructor.encrypt (user.password);
        const newUser = this.collection.push(user);

        return newUser.key;
    }

    async validateUser (data) {
        console.log('hola2');
        const userQuery = await this.collection.orderByChild('email').equalTo(data.email).once('value');
        const userFound = userQuery.val();
        if (userFound) {
            const userId = Object.keys(userFound)[0];
            const passwordRight = await bcrypt.compare(data.password, userFound[userId].password);
            const result = (passwordRight) ? userFound[userId] : false;

            return result;
        }

        return false;
    }

    async getUsers () {

        const userList = [];

        const result = await this.collection.get();
        const finalResult = await result.val();
        
        for (const property in finalResult) {
            userList.push({...finalResult[property],id: property})
        }

        return userList;
    }

    async getUserById (id) {
        const query = await this.collection.child(id).once('value');
        const data = query.val();

        return data;
    }

    async getIdWithEmail (email) {
        const query = await this.collection.orderByChild('email').equalTo(email).once('value');
        const data = Object.keys(query.val())[0];

        return data;
    }

    static async encrypt (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    }
}

module.exports = Users;