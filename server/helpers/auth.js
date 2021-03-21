var jwt = require('jsonwebtoken');
const StatusCode = require('../helpers/constants');

const accessTokenSecret = 'supersecretshh';
// access token key should eventually be migrated to .env file and accessed through config

/**
 * authentication middleware verifies jwt token and attaches payload to request
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @next next passes the modified req to the control method
 * @returns {Promise<void>} the promise indicating success
 */

const authenticate = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader)
    {
        const authToken = authorizationHeader.split(' ')[1];

        jwt.verify(authToken, accessTokenSecret, (err, payload) => {
            if (err)
            {
                return res.sendStatus(StatusCode.FORBIDDEN);
            }
            else {
                req.userId = payload.id;
                next();
            }
        });
    }
    else {
        res.sendStatus(StatusCode.BAD_REQUEST)
    }
}


module.exports = {
    authenticate
}