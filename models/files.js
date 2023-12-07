'use stricts'

class Files {
    constructor (db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.collection = this.ref.child('files');
    }

    async create (data, user, ext, filename, originalFileName) {
        const {fileUpload,...file} = {
            filename
        };

        const today = new Date();

        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        
        file.owner = user;
        file.extension = ext;
        file.originalFileName = originalFileName;
        file.date = `${date}/${month}/${year}`;
        const newFile = this.collection.push(file);

        return newFile.key
    }

    async getFiles () {
        const filesList = [];

        const result = await this.collection.get();
        const finalResult = await result.val();
        
        for (const property in finalResult) {
            filesList.push({...finalResult[property],id: property})
        }

        return filesList;
    }

    async getOne (id) {
        const query = await this.collection.child(id).once('value');
        const data = query.val();

        return data;
    }
}

module.exports = Files;