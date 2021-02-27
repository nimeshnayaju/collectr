const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.post('/', itemController.addItem);
router.get('/:id', itemController.getItems);
router.get('/catalog/:id', itemController.getCatalogItems);
router.put('/:id', itemController.updateItem);

module.exports = router;
