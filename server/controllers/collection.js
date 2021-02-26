const Collection = require('../models/collection');
const StatusCode = require('../helpers/constants');


/**
 * Lists all Collection objects
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCollections = async (req, res) => {

    try {
        const collections = await Collection.find(); // Find all Collection objects
        res.status(StatusCode.OK).json( collections );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

};

/**
 * Gets information about the specific Collection object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const addCollection = async (req, res) => {

    const { name, description } = req.body;

    let collection = new Collection({ name, description });

    try {
        const newCollection = await collection.save();
        res.status(StatusCode.CREATED).json( newCollection );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

};

/**
 * Gets a specific Collection object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCollection = async (req, res) => {

    const { id } = req.params;

    try {
        const collection = await Collection.findById(id);
        res.status(StatusCode.OK).json( collection );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

}

/**
 * Updates a pre-existing Collection object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const updateCollection = async (req, res) => {

    const { id } = req.params;
    const { name, description } = req.body;

    let collection = new Collection({ _id: id, name: name, description: description });

    try {
        const updatedCollection = await Collection.findByIdAndUpdate(id, collection, { new: true });
        res.status(StatusCode.OK).json( updatedCollection );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

}

/**
 * Delete a specific Collection object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const deleteCollection = async (req, res) => {

    const { id } = req.params;

    try {
        const deletedCollection = await Collection.findByIdAndRemove(id);
        res.status(StatusCode.OK).json( deletedCollection );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

}

module.exports = {
    getCollections,
    addCollection,
    getCollection,
    updateCollection,
    deleteCollection
}