const Item = require('../models/item');
const StatusCode = require('../helpers/constants');

/**
 * Lists all Item objects in a specific collection
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getItems = async (req, res) => {
  try {
    const records = await Item.find();
    res.status(StatusCode.OK).json(records);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = {
    getItems
}
