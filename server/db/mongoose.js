const mongoose = require('mongoose');
const config = require('../config');

class Mongoose {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
      .then(() => {
        console.log('Successfully connected to Mongoose');
      })
      .catch(() => {
        console.log('Error connecting to Mongoose!');
      });
  }
}

module.exports = new Mongoose();
