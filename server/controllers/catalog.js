const Catalog = require('../models/catalog');
const StatusCode = require('../helpers/constants');

/**
 * Lists all Catalog objects specific to user
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCatalogs = async (req, res) => {
    try {
        const catalogs = await Catalog.find( {user: req.user} );
        // Find all Catalog objects that belong to user
        res.status(StatusCode.OK).json( catalogs );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};


/**
 * Lists all Catalog objects that are public
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getPublicCatalogs = async (req, res) => {
    try {
        const catalogs = await Catalog.find( {isPrivate: false} );
        // Find all Catalog objects set to public
        res.status(StatusCode.OK).json( catalogs );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Adds a new Catalog object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const addCatalog = async (req, res) => {
    const { name, description, isPrivate } = req.body;
    const user = req.user;

    const catalog = new Catalog({ name, description, isPrivate, user});

    try {
        const newCatalog = await catalog.save();
        res.status(StatusCode.CREATED).json( newCatalog );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Gets a specific Catalog object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCatalog = async (req, res) => {
    const { id } = req.params;

    try {
        const catalog = await Catalog.findById(id).populate('items');

        if(catalog.isPrivate)
        {
            if(req.user == catalog.user)
            {
                res.status(StatusCode.OK).json( catalog );
            }
            else
            {
                res.status(StatusCode.FORBIDDEN);
            }
        }
        else
        {
            res.status(StatusCode.OK).json( catalog );
        }

    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Gets a specific Catalog object filtered by public information
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getPublicCatalog = async (req, res) => {
    const { id } = req.params;

    try {
        const catalog = await Catalog.findById(id)
            .populate({
                path: 'items',
                match: { isPrivate : false }
                });

        if(catalog.isPrivate)
        {

            res.status(StatusCode.FORBIDDEN);
        }
        else
        {
            res.status(StatusCode.OK).json( catalog );
        }

    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


/**
 * Updates a pre-existing Catalog object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const updateCatalog = async (req, res) => {
    const { id } = req.params;

    try {
        const catalog = await Catalog.findById(id);
        if(req.user == catalog.user)
        {
            const updatedCatalog = await Catalog.findByIdAndUpdate(id, {$set: req.body}, {new: true}).populate('items');
            res.status(StatusCode.OK).json(updatedCatalog);
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
 * Delete a specific Catalog object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const deleteCatalog = async (req, res) => {
    const { id } = req.params;


    try {
        const catalog = await Catalog.findById(id);
        if(req.user == catalog.user)
        {
            const deletedCatalog = await Catalog.findByIdAndRemove(id);
            res.status(StatusCode.OK).json( deletedCatalog );
        }
        else
        {
            res.status(StatusCode.FORBIDDEN);
        }
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};


module.exports = {
    getCatalogs,
    getPublicCatalogs,
    getPublicCatalog,
    addCatalog,
    getCatalog,
    updateCatalog,
    deleteCatalog
};
