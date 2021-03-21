const express = require('express');

const router = express.Router();
const catalogController = require('../controllers/catalog');
const auth = require('../helpers/auth');

router.get('/', auth.authenticate, catalogController.getCatalogs);
router.get('/:id', auth.authenticate, catalogController.getCatalog);
router.post('/', auth.authenticate, catalogController.addCatalog);
router.put('/:id', auth.authenticate, catalogController.updateCatalog);
router.delete('/:id', auth.authenticate, catalogController.deleteCatalog);

module.exports = router;