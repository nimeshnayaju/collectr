const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.get('/', itemController.getItems);
router.get('/fields/:id', itemController.getItemFields);
router.post('/', itemController.addItem);
router.put('/:id', itemController.updateItem);
router.get('/:id', itemController.getItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
