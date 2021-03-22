const Catalog = require('../models/catalog');
const StatusCode = require('../helpers/constants');

/**
 * Lists all Catalog objects
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCatalogs = async (req, res) => {
    try {
        const catalogs = await Catalog.find( {$or:[{isPrivate: true, userId: req.userId}, {isPrivate: false}]} );
        // Find all Catalog objects that are public or private and belonging to user
        res.status(StatusCode.OK).json( catalogs );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};


/**
 * Lists all Catalog objects belonging to user
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCatalogsByUser = async (req, res) => {
    try {
        const catalogs = await Catalog.find( {userId: req.userId} );
        // Find all Catalog objects that belong to user
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
    const userId = req.userId;

    const catalog = new Catalog({ name, description, isPrivate, userId});

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
            if(req.userId === catalog.userId)
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
 * Updates a pre-existing Catalog object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const updateCatalog = async (req, res) => {
    const { id } = req.params;

    try {
        const catalog = await Catalog.findById(id);
        if(req.userId === catalog.userId)
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
        if(req.userId === catalog.userId)
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
    getCatalogsByUser,
    addCatalog,
    getCatalog,
    updateCatalog,
    deleteCatalog
};
