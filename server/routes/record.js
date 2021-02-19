const express = require('express');

const router = express.Router();
const recordController = require('../controllers/recordController');

router.get('/', recordController.getRecords);
router.post('/add', recordController.addRecord);

module.exports = router;
