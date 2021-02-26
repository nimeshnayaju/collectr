const Item = require('../models/item');
const StatusCode = require('../helpers/constants');

/**
 * Adds a new Item object (to a Catalog)
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const addItem = async (req, res) => {

    const { name, date, manufacturer, catalog } = req.body;

    let item = new Item({ name, date, manufacturer, catalog });

    try {
        const newItem = await item.save();
        res.status(StatusCode.CREATED).json( newItem );
    } catch (err) {
        res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
    }

};

module.exports = {
    addItem
}

