const Collection = require('../models/collection');
const StatusCode = require('../helpers/constants');

/**
 * Returns all Collection objects
 */
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate('item'); // Find all Collection objects
    res.status(StatusCode.OK).json(collections);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

const addCollection = async (req, res) => {
  const { name, description } = req.body;

  let collection = new Collection({ name, description });

  try {
    const newCollection = await collection.save();
    res.status(StatusCode.CREATED).json(newCollection);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

const getCollection = async (req, res) => {
  const { id } = req.params;

  try {
    const collection = await Collection.findById(id).populate('item');
    res.status(StatusCode.OK).json(collection);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  let collection = new Collection({ _id: id, name: name, description: description });

  try {
    const updatedCollection = await Collection.findByIdAndUpdate(id, collection, { new: true });
    res.status(StatusCode.OK).json(updatedCollection);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

const deleteCollection = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCollection = await Collection.findByIdAndRemove(id);
    res.status(StatusCode.OK).json(deletedCollection);
  } catch (err) {
    res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = {
  getCollections,
  addCollection,
  getCollection,
  updateCollection,
  deleteCollection,
};
