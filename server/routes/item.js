const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.get('/', itemController.getItems);

module.exports = router;
