const Item = require('../models/item');
const Catalog = require('../models/catalog');
const StatusCode = require('../helpers/constants');

const addItem = async (req, res) => {
    const { name, date, manufacturer } = req.body;
    const catalogId = req.body.catalog;

    const item = new Item({ name, date, manufacturer });

    try {
        // check if the catalog id sent in the request body is a valid id or not
        let catalog = await Catalog.findById(catalogId);
        if (catalog != null) {
            try {
                const newItem = await item.save();

                catalog.items.push(newItem._id);
                catalog.save();
                
                res.status(StatusCode.CREATED).json( newItem );
            } catch (err) {
                res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
            }
        }
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};

/**
 * Lists all Item objects
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(StatusCode.OK).json( items );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};

/**
 * Updates a pre-existing Item object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const updateItem = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(StatusCode.OK).json( updatedItem );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
}

/**
 * Gets a specific Item object
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
 const getItem = async (req, res) => {
    const { id } = req.params;
  
    try {
        const item = await Item.findById(id);
        res.status(StatusCode.OK).json(item);
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }
};

/**
 * Delete an Item object (from a Catalog)
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByIdAndRemove(id);
        res.status(StatusCode.OK).json(item);
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

};

module.exports = {
    addItem,
    getItems,
    updateItem,
    getItem,
    deleteItem
};
