'use strict'

const authBasic = require('@hapi/basic');
const Joi = require('@hapi/joi');
const questions = require('../models/index').questions;
const users = require('../models/index').users;
const Boom = require('@hapi/boom');

module.exports = {
    name: 'api-rest',
    version: '1.0.0',
    async register (server, options) {
        const prefix = options.prefix || 'api';

        function failValidation (req, h, err) {
            return Boom.badRequest('Please use the correct params');
        }

        async function validate (req, username, passwd, h) {
            let user;
            try {
                user = await users.validateUser({email: username, password: passwd });
            } catch (error) {
                server.log('error', error)
            }

            return {
                credentials: user || {},
                isValid: (user !== false)
            }
        }
    }
}