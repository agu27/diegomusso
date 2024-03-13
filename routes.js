'use strict'

const Joi = require('@hapi/joi');
const site = require ('./controllers/site');
const user = require ('./controllers/user');
const file = require('./controllers/file');
const article = require ('./controllers/countablenew');

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
    path: '/insurance',
    handler: site.insurance
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
    path: '/countable/news',
    handler: site.countableNews
}),
({
    method: 'GET',
    path: '/news/delete/{id}',
    handler: article.deleteCountableNew
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
    path: '/add-new',
    method: 'POST',
    options: {
        payload: {
            parse: true,
            multipart: true,
        },
        validate: {
          payload: Joi.object({
            title: Joi.any().required(),
            newBody: Joi.any().required(),
            fileUpload: Joi.any().required(),
          }), 
          failAction: user.failValidation
        }
    },
    handler: article.addNew,
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