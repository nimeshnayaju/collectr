var jwt = require('jsonwebtoken');
const StatusCode = require('../helpers/constants');
const Config = require('../config');

/**
 * authentication middleware verifies jwt token and attaches payload to request
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @next next passes the modified req to the control method
 * @returns {Promise<void>} the promise indicating success
 */

const authenticate = async (req, res, next) => {

    try {

        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader)
        {
            const authToken = authorizationHeader.split(' ')[1];
            try {
                const payload = jwt.verify(authToken, Config.accessTokenSecret);
                req.user = payload.id;
                next();
            } catch (err) {
                return res.status(StatusCode.FORBIDDEN).json({ message: err.message });
            }
        }
        else {
            res.status(StatusCode.BAD_REQUEST);
        }
    }
    catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

}


module.exports = {
    authenticate
}