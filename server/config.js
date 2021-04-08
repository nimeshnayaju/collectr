require('dotenv').config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    production: process.env.PROD_MONGODB_URI,
    development: process.env.DEV_MONGODB_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    email: process.env.FROM_EMAIL,
    password: process.env.FROM_PASSWORD,
    clientURL: process.env.CLIENT_URL,
    signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
};

module.exports = config;
