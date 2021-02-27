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
    const catalogs = await Catalog.find(); // Find all Catalog objects
    res.status(StatusCode.OK).json(catalogs);
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
    const { name, description } = req.body;

    const catalog = new Catalog({ name, description });

    try {
        const newCatalog = await catalog.save();
        res.status(StatusCode.CREATED).json(newCatalog);
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
        const catalog = await Catalog.findById(id);
        res.status(StatusCode.OK).json(catalog);
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
    const { name, description } = req.body;

    const catalog = new Catalog({ _id: id, name, description });

    try {
        const updatedCatalog = await Catalog.findByIdAndUpdate(id, catalog, { new: true });
        res.status(StatusCode.OK).json(updatedCatalog);
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
        const deletedCatalog = await Catalog.findByIdAndRemove(id);
        res.status(StatusCode.OK).json(deletedCatalog);
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};

module.exports = {
    getCatalogs,
    addCatalog,
    getCatalog,
    updateCatalog,
    deleteCatalog,
};
