const Item = require('../models/item');
const Catalog = require('../models/catalog');
const StatusCode = require('../helpers/constants');

/**
 * Adds a new Item object (to a Catalog)
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const addItem = async (req, res) => {
  const {
    name, date, manufacturer, catalog,
  } = req.body;

  const item = new Item({
    name, date, manufacturer, catalog,
  });

  try {
    const newItem = await item.save();
    res.status(StatusCode.CREATED).json(newItem);
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
    res.status(StatusCode.OK).json(items);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

/**
 * Gets all items in a specific catalog
 * @param req request object containing information about HTTP request
 * @param res the response object used for sending back the desired HTTP response
 * @returns {Promise<void>} the promise indicating success
 */
const getCatalogItems = async (req, res) => {
  const { id } = req.body;

  try {
    const catalog = await Catalog.findById(id); // get the specified catalog by id
    // eslint-disable-next-line no-underscore-dangle
    const items = await Item.find({catalog: catalog._id }).populate('catalog');

    // get the items by catalog
    res.status(StatusCode.OK).json(items);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = {
  addItem,
  getItems,
  getCatalogItems,
};
