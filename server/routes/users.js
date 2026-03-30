const express = require('express');
const router = express.Router();
router.get('/count', (req, res) => { res.json({ count: 8, message: 'Users from client-side store' }); });
module.exports = router;
