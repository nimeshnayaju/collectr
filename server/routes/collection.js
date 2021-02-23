const express = require('express');

const router = express.Router();
const collectionController = require('../controllers/collection');

router.get('/', collectionController.getCollections);
router.get('/:id', collectionController.getCollection);
router.post('/', collectionController.addCollection);
router.put('/:id', collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;