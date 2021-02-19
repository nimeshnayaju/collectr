const mongoose = require('mongoose');
const config = require('../config');

class Mongoose {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log(`Mongoose connection open at: ${config.DB}`);
      })
      .catch(() => {
        console.log('Error connecting to Mongoose...');
      });
  }
}

module.exports = new Mongoose();
