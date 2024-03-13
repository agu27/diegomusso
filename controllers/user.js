'use strict'

const users = require ('../models/index').users;
const boom = require('@hapi/boom');

async function createUser (req, h) {
    let result;
    try {
        result = await users.create(req.payload);
    } catch (error) {
        console.error(error);
        return h.view('register', {
            title: 'Register',
            error: 'Error creando usuario'
        })
    }

    return h.view('register', {
        title: 'Register',
        success: 'Usuario creado correctamente'
    })
}

async function validateUser (req, h) {
    let result;
    try {
        result = await users.validateUser(req.payload);
        if (!result) {
            return h.view('login', {
                title: 'LogIn',
                error: 'Incorrect email or password'
            })
        }
    } catch (error) {
        console.error(error);
        return h.view('login', {
            title: 'LogIn',
            error: 'Validation user problem'
        })
    }

    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email,
        admin: result.admin,
    })
}

function logout (req, h) {
    return h.redirect ('/login').unstate('user');
}

function failValidation (req, h, err) {
    const templates = {
        '/create-user': 'register',
        '/validate-user': 'login',
        '/create-question': 'ask',
        '/add-file/{id}': 'index',
        '/add-new': 'index',
    }

    return h.view(templates[req.path], {
        title: 'Validation error',
        error: 'Por favor llene los campos requeridos'
    }).code(400).takeover();
}

module.exports = {
    createUser,
    validateUser,
    logout,
    failValidation
}