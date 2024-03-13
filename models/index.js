'use strict'

const firebase = require('firebase-admin');
const serviceAccount = require('../config/firebase.json');

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://nodejs-hapi-aff79-default-rtdb.firebaseio.com/',
});

const db = firebase.database();

const Users = require('./users');
const Files = require('./files');
const CountableNews = require('./countablenews');

module.exports = {
    users: new Users(db),
    files: new Files(db),
    articles: new CountableNews(db),
}