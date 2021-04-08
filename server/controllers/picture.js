const Picture = require('../models/picture');
const StatusCode = require('../helpers/constants');


/**
 * Adds a new Picture object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const addPicture = async (req, res) => {
    const { image } = req.body;
    const user = req.user;

    const picture = new Picture({ image, user });

    try {
        const newPicture = await picture.save();
        res.status(StatusCode.CREATED).json( newPicture );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};



/**
 * Gets a specific Picture object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getPicture = async (req, res) => {
    const { id } = req.params;

    try {
        const picture = await Picture.findById( id );

        if(picture.user == req.user)
        {
            res.status(StatusCode.ok).json( picture );
        }
        else
        {
            res.status(StatusCode.FORBIDDEN);
        }
    }
    catch (err)
    {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};



/**
 * Updates a pre-existing Picture object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const updatePicture = async (req, res) => {
    const { id } = req.params;

    try {
        const picture = await Picture.findById(id);
        if(req.user == picture.user)
        {
            const updatedPicture = await Picture.findByIdAndUpdate(id, {$set: req.body}, {new: true});
            res.status(StatusCode.OK).json(updatedPicture);
        }
        else
        {
            res.status(StatusCode.FORBIDDEN);
        }
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Delete a specific Picture object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const deleteCatalog = async (req, res) => {
    const { id } = req.params;


    try {
        const picture = await Picture.findById(id);
        if(req.user == picture.user)
        {
            const deletedPicture = await Picture.findByIdAndRemove(id);
            res.status(StatusCode.OK).json( deletedPicture );
        }
        else
        {
            res.status(StatusCode.FORBIDDEN);
        }
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};
