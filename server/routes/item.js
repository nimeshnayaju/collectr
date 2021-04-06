const express = require('express');

const router = express.Router();
const itemController = require('../controllers/item');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, itemController.getItems);
router.get('/public', authenticate, itemController.getPublicItems);
router.get('/:id', authenticate, itemController.getItem);
router.post('/', authenticate, itemController.addItem);
router.put('/:id', authenticate, itemController.updateItem);
router.delete('/:id', authenticate, itemController.deleteItem);

module.exports = router;
