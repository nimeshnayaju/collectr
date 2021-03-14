require('dotenv').config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    db: process.env.MONGODB_URI,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
};

module.exports = config;
