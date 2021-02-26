const Record = require('../models/item');
const StatusCode = require('../helpers/constants');

const getItem = async (req, res) -> {
	const { id } = req.params;
	
	try {
	  const item = await Item.findById(id); // <-- does this need '.populate()? if so, what should be its param?
	  res.status(StatusCode.OK).json(item);
	} catch (err) {
	  res.status(StatusCode.BAD_REQUEST).json({ message: err.message });
	}	
};

