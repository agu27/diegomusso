'use strict'

const Hapi = require('@hapi/hapi');
const blankie = require('blankie');
const scooter = require('@hapi/scooter');
const handlebars = require('./lib/helpers');
const inert = require('@hapi/inert');
const laabr = require('laabr');
const crumb = require('@hapi/crumb');
const path = require('path');
const routes = require('./routes');
const vision = require('@hapi/vision');
const site = require('./controllers/site');
const functions = require('firebase-functions');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
});

async function init () {
    try {
        await server.register(inert);
        await server.register(vision);
        await server.register({
            plugin: laabr,
            options: {
              formats: { onPostStart: ":time :start :level :message" },
              tokens: { start: () => "[start]" },
              indent: 0,
            },
          });
        await server.register({
            plugin: crumb,
            options: {
                cookieOptions: {
                    isSecure: process.env.NODE_ENV === 'prod'
                }
            },
        });
        await server.register([scooter, {
            plugin: blankie,
            options: {
                defaultSrc: `'self' 'unsafe-inline'`,
                styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com https://unpkg.com/aos@2.3.1/dist/aos.css https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css`,
                fontSrc: `'self' 'unsafe-inline' data:`,
                scriptSrc: `'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://maxcdn.bootstrapcdn.com https://code.jquery.com  https://unpkg.com/aos@2.3.1/dist/aos.js https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js`,
                generateNonces: false
            }
        }]);
        await server.register({
            plugin: require('./lib/api'),
            options: {
                prefix: 'api'
            }
        });

        server.state('user', {
            ttl: 1000*60*60,
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json'
        })

        server.views({
            engines: {
                hbs: handlebars
            },
            relativeTo: __dirname,
            path: 'templates',
        })

        server.ext('onPreResponse', site.fileNotFound);
        server.route(routes);

        await server.start();
    } catch (e) {
        console.error(e);
        process.exit(1);
    };

    server.log ('info', `Server listening on port ${server.info.port}`)
}

process.on('unhandledRejection', error => {
    server.log('UnhandledRejection', error.message, error);
});

process.on('unhandledException', error => {
    server.log('UnhandledException', error.message, error);
});

init()
