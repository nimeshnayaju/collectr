require('dotenv').config();

const config = {
    ENV : process.env.NODE_ENV || 'development',
    PORT : process.env.PORT,
    DB : process.env.MONGODB_URI
}

module.exports = config;