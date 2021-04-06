const express = require('express');

const router = express.Router();
const catalogController = require('../controllers/catalog');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, catalogController.getCatalogs);
router.get('/public', authenticate, catalogController.getPublicCatalogs);
router.get('/:id', authenticate, catalogController.getCatalog);
router.post('/', authenticate, catalogController.addCatalog);
router.put('/:id', authenticate, catalogController.updateCatalog);
router.delete('/:id', authenticate, catalogController.deleteCatalog);

module.exports = router;