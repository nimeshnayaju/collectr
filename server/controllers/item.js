const Record = require('../models/item');
const StatusCode = require('../helpers/constants');

/**
 * Returns all Collection objects
 */
const getItems = async (req, res) => {
  try {
    const records = await Record.find().populate('item'); // Find all Collection objects
    res.status(StatusCode.OK).json(records);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};
