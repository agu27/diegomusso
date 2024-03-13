'use strict'

const { writeFile } = require('fs');
const { rename } = require('fs');
const { stat } = require('fs');
const { promisify } = require('util');
const { join } = require('path');
const articles = require('../models/index').articles;
const { v1: uuid } = require('uuid');
const isBuffer = require('is-buffer')
const write = promisify(writeFile);
const renameFile = promisify(rename);
const statFile = promisify(stat);
const users = require ('../models/index').users;

async function addNew (req, h) {

    if (!req.state.user) {
        return h.redirect('/login');
    }
    
    let result, filename, ext;
    
    try {

        await fileExist (`${__dirname}/../public/uploads/new4.png`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new4.png`,`${__dirname}/../public/uploads/new5.png`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new4.jpg`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new4.jpg`,`${__dirname}/../public/uploads/new5.jpg`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new3.png`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new3.png`,`${__dirname}/../public/uploads/new4.png`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new3.jpg`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new3.jpg`,`${__dirname}/../public/uploads/new4.jpg`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new2.png`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new2.png`,`${__dirname}/../public/uploads/new3.png`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new2.jpg`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new2.jpg`,`${__dirname}/../public/uploads/new3.jpg`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new1.png`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new1.png`,`${__dirname}/../public/uploads/new2.png`);
            } else {
              return
            }
        });

        await fileExist (`${__dirname}/../public/uploads/new1.jpg`, (err, exists) => {
            if(err) {
                req.log('error', `Error ocurred ${err}`);
            }
            if(exists) {
                renameFile(`${__dirname}/../public/uploads/new1.jpg`,`${__dirname}/../public/uploads/new2.jpg`);
            } else {
              return
            }
        });

        let position1 = await articles.getIdWithPos('new1');
        let position2 = await articles.getIdWithPos('new2');
        let position3 = await articles.getIdWithPos('new3');
        let position4 = await articles.getIdWithPos('new4');
        let position5 = await articles.getIdWithPos('new5');
        let filename1 = await articles.articleFilename(position1);
        let filename2 = await articles.articleFilename(position2);
        let filename3 = await articles.articleFilename(position3);
        let filename4 = await articles.articleFilename(position4);
        let newFilename1 = "";
        let newFilename2 = "";
        let newFilename3 = "";
        let newFilename4 = "";
        let newFilenamePath1 = "";
        let newFilenamePath2 = "";
        let newFilenamePath3 = "";
        let newFilenamePath4 = "";

        if (filename4 == "new4.jpg") {
            newFilename4 = "new5.jpg";
            newFilenamePath4 = `../assets/uploads/${newFilename4}`
        }

        if (filename4 == "new4.png") {
            newFilename4 = "new5.png";
            newFilenamePath4 = `../assets/uploads/${newFilename4}`
        }
        if (filename3 == "new3.jpg") {
            newFilename3 = "new4.jpg";
            newFilenamePath3 = `../assets/uploads/${newFilename3}`
        }
        if (filename3 == "new3.png") {
            newFilename3 = "new4.png";
            newFilenamePath3 = `../assets/uploads/${newFilename3}`
        }
        if (filename2 == "new2.jpg") {
            newFilename2 = "new3.jpg";
            newFilenamePath2 = `../assets/uploads/${newFilename2}`
        }
        if (filename2 == "new2.png") {
            newFilename2 = "new3.png";
            newFilenamePath2 = `../assets/uploads/${newFilename2}`
        }
        if (filename1 == "new1.jpg") {
            newFilename1 = "new2.jpg";
            newFilenamePath1 = `../assets/uploads/${newFilename1}`
        }
        if (filename1 == "new1.png") {
            newFilename1 = "new2.png";
            newFilenamePath1 = `../assets/uploads/${newFilename1}`
        }


        await articles.deleteArticle(position5);

        await articles.updateInfo(position4, 'new5', newFilename4, newFilenamePath4);
        await articles.updateInfo(position3, 'new4', newFilename3, newFilenamePath3);
        await articles.updateInfo(position2, 'new3', newFilename2, newFilenamePath2);
        await articles.updateInfo(position1, 'new2', newFilename1, newFilenamePath1);

        const x = Buffer.from(req.payload.fileUpload);

        if (isBuffer(x)) {

            ext = fileExt (req.payload.fileUpload);

            filename = `new1.${ext}`;

            const path = join(__dirname,'..', '/public/uploads/',filename);
            await write(path, req.payload.fileUpload,
                (err) => {
                    if (err) {
                        console.log("Error uploading file");
                    }
                });
                console.log("File is uploaded");
        }
        result = await articles.create(req.payload, filename);
        req.log('info', `New uploaded with ID ${result}`);
    } catch (error) {
        req.log('error', `Error ocurred ${error}`);

        return h.view('client', {
            error: 'Problems creating question'
        }).code(500).takeover();
    }


    return h.redirect(`/countable/news`);
}

function fileExist (file, cb) {
    statFile(file, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return cb(null, false);
          } else {
            return cb(err);
          }
        }
        return cb(null, stats.isFile());
      });
}

function fileExt (buffer) {
    let extFile;

    if (buffer[0] == 37 && buffer[1] == 80 && buffer[2] == 68 && buffer[3] == 70) {
        extFile = 'pdf'
    }

    if (buffer[0] == 255 && buffer[1] == 216 && buffer[2] == 255) {
        extFile = 'jpg'
    } 

    if (buffer[0] == 137 && buffer[1] == 80 && buffer[2] == 78) {
        extFile = 'png'
    } 

    else {
        console.log ('Extension not valid')
    }

    return extFile
}

async function deleteCountableNew (req, h) {
    await articles.deleteArticleFromList (req.params.id)

    return h.redirect(`/countable/news`)
}

module.exports = {
    addNew,
    deleteCountableNew,
}