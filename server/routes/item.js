const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.post('/', itemController.addItem);
router.get('/:id', itemController.getItems);
router.get('/items/catalog', itemController.getCatalogItems);

module.exports = router;
