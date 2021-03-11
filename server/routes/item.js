const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');

router.get('/', itemController.getItems);
router.post('/', itemController.addItem);
router.put('/:id', itemController.updateItem);
router.get('/:id', itemController.getItem);

module.exports = router;
