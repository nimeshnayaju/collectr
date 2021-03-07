const express = require('express');
const router = express.Router();

/* GET Home Page */
router.get('/', (req, res) => {
    res.json({ message: 'Collectr' });
});

module.exports = router;
