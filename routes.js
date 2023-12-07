'use strict'

const Joi = require('@hapi/joi');
const site = require ('./controllers/site');
const user = require ('./controllers/user');
const file = require('./controllers/file');

module.exports = 
[
({
    method: 'GET',
    path: '/',
    options: {
        cache: {
            expiresIn: 1000 * 30,
            privacy: 'private'
        }
    },
    handler: site.home
}),
({
    method: 'GET',
    path: '/register',
    handler: site.register
}),
({
    method: 'GET',
    path: '/countable',
    handler: site.countable
}),
({
    method: 'GET',
    path: '/clients',
    handler: site.clients
}),
({
    path: '/create-user',
    method: 'POST',
    options: {
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            name: Joi.string().required().min(3),
            password: Joi.string().required().min(6),
            cuil: Joi.string().required(),
            admin: Joi.string().required()
          }),
          failAction: user.failValidation
        }
    },
    handler: user.createUser
}),
({
    method: 'GET',
    path: '/login',
    handler: site.login
}),
({
    method: 'GET',
    path: '/client/{id}',
    handler: site.viewUser
}),
({
    method: 'GET',
    path: '/logout',
    handler: user.logout
}),
({
    path: '/add-file/{id}',
    method: 'POST',
    options: {
        payload: {
            parse: true,
            multipart: true,
        },
        validate: {
          payload: Joi.object({
            fileUpload: Joi.any().required(),
            fileName: Joi.any(),
          }), 
          failAction: user.failValidation
        }
    },
    handler: file.addFile,
}),
({
    path: '/validate-user',
    method: 'POST',
    options: {
        validate: {
          payload: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6)
          }),
          failAction: user.failValidation
        }
    },
    handler: user.validateUser
}),
({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            index: ['index.html']
        }
    }
}),
{
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: site.notFound
}]