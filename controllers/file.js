'use strict'

const { writeFile } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const file = require('../models/index').files;
const { v1: uuid } = require('uuid');
const isBuffer = require('is-buffer')
const write = promisify(writeFile);
const users = require ('../models/index').users;

async function addFile (req, h) {

    if (!req.state.user) {
        return h.redirect('/login');
    }

    console.log(req.payload);
    
    let result, filename, ext, userOwner, originalFileName
    
    try {
        const x = Buffer.from(req.payload.fileUpload);

        if (isBuffer(x)) {

            ext = fileExt (req.payload.fileUpload);

            filename = `${uuid()}.${ext}`;

            const path = join(__dirname,'..', '/public/uploads/',filename);
            await write(path, req.payload.fileUpload,
                (err) => {
                    if (err) {
                        console.log("Error uploading file");
                    }
                });
                console.log("File is uploaded");
        }
        originalFileName = req.payload.fileName;
        userOwner = await users.getUserById(req.params.id);
        console.log(userOwner);
        result = await file.create(req.payload, userOwner, ext, filename, originalFileName);
        req.log('info', `File uploaded with ID ${result}`);
    } catch (error) {
        req.log('error', `Error ocurred ${error}`);

        return h.view('client', {
            error: 'Problems creating question'
        }).code(500).takeover();
    }


    return h.redirect(`/client/${req.params.id}`);
}

function fileExt (buffer) {
    let extFile;

    if (buffer[0] == 37 && buffer[1] == 80 && buffer[2] == 68 && buffer[3] == 70) {
        extFile = 'pdf'
    }

    if (buffer[0] == 255 && buffer[1] == 216 && buffer[2] == 255) {
        extFile = 'jpg'
    } 
    
    else {
        console.log ('Extension not valid')
    }

    return extFile
}

module.exports = {
    addFile,
}