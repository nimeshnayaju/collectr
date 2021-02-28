const Item = require('../models/item');
const StatusCode = require('../helpers/constants');

/**
 * Gets a specific item
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

module.exports = {
	getItem,
};
