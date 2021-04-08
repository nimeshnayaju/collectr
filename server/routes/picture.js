const express = require('express');

const router = express.Router();
const picController = require('../controllers/picture');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, picController.addPicture);
router.get('/:id', authenticate, picController.getPicture);
router.put('/:id', authenticate, picController.updatePicture);
router.delete('/:id', authenticate, picController.deletePicture);

module.exports = router;