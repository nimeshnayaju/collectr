const mongoose = require('mongoose');
const config = require('../config');

class Mongoose {
    constructor() {
        this._connect();
    }

    _connect() {
        const activeURI = config[process.env.ACTIVE_ENV];
        mongoose.connect(activeURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(() => {
            console.log('Successfully connected to Mongoose');
        })
        .catch(() => {
            console.log('Error connecting to Mongoose!');
        });
    }
}

module.exports = new Mongoose();
