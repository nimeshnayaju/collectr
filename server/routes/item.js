const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.post('/', itemController.addItem);
router.get('/', itemController.getItems);
router.get('/', itemController.getCatalogItems);

module.exports = router;
