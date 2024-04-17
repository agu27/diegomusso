'use stricts'

class CountableNews {
    constructor (db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.collection = this.ref.child('countableNews');
    }

    async create (data, filename, body) {
        console.log(data);

        const {fileUpload,...article} = {
            filename
        };

        const today = new Date();

        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        
        article.path = `../assets/uploads/${filename}`;
        article.display = true;
        article.pos = 'new1';
        article.title = data.title;
        article.body = data.newBody;
        article.date = `${date}/${month}/${year}`;
        const newArticle = this.collection.push(article);

        return newArticle.key
    }

    async updateInfo (article, posUpdate, fileUpdate, newPath) {
        this.collection.child(article).update({"pos": posUpdate, "filename": fileUpdate, "path": newPath});

        return this.collection.child(article);
    }

    async deleteArticleFromList (id) {
        this.collection.child(id).update({"display": false});

        return this.collection.child(id), console.log (`Article: ${id} deleted successfully`);
    }

    async articleFilename (article) {
        const query = await this.collection.child(article).once('value');
        const data = query.val();
        const filename = Object.values(data)[3];

        return filename;
    }

    async deleteArticle (article) {
        this.collection.child(article).remove();

        return console.log(`Article: ${article} deleted successfully`);
    }

    async getIdWithPos (pos) {
        const query = await this.collection.orderByChild('pos').equalTo(pos).once('value');
        const data = Object.keys(query.val())[0];

        return data;
    }

    async getFiles () {
        const articleList = [];
        
        const result = await this.collection.get();
        const finalResult = await result.val();
        
        for (const property in finalResult) {
            articleList.push({...finalResult[property],id: property})
        }

        return articleList;
    }

    async getOne (id) {
        const query = await this.collection.child(id).once('value');
        const data = query.val();

        return data;
    }
}

module.exports = CountableNews;