'use stricts'

class LastNew {
    constructor (db) {
        this.db = db;
        this.ref = this.db.ref('/');
        this.collection = this.ref.child('lastNew');
    }

    async getLast () {
        const query = await this.collection.child('lastNew').once('value');
        const data = query.val();

        return data;
    }

    async updateInfo (newPos) {
        await this.collection.update({"lastNew": newPos});

        return this.collection.child(console.log(`Updated correctly. New last position: ${newPos}`));
    }
}

module.exports = LastNew;