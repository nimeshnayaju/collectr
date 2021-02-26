const express = require('express');

const router = express.Router();
const catalogController = require('../controllers/catalog');

router.get('/', catalogController.getCatalogs);
router.get('/:id', catalogController.getCatalogs);
router.post('/', catalogController.addCatalog);
router.put('/:id', catalogController.updateCatalog);
router.delete('/:id', catalogController.deleteCatalog);

module.exports = router;