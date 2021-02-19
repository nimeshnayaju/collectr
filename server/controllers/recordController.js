const Record = require('../models/record');

/**
 * Returns the information about all Record objects
 */
const getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.json({ records });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addRecord = async (req, res) => {
  const record = new Record({
    name: req.body.name,
    date: Date.now(),
    manufacturer: req.body.manufacturer,
  });
  try {
    const newRecord = await record.save();
    res.status(201).json({ newRecord });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getRecords,
  addRecord,
};
