const express = require('express');
const router = express.Router();
const { dynamicAlgorithmSelector } = require('../services/algorithmSelector');

// POST /api/algorithm/sort
router.post('/sort', (req, res) => {
  try {
    const { data, distribution } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: 'data must be an array' });
    const result = dynamicAlgorithmSelector(data, 'sort');
    res.json({ success: true, ...result });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/algorithm/search
router.post('/search', (req, res) => {
  try {
    const { data, target, isSorted } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: 'data must be an array' });
    const result = dynamicAlgorithmSelector(data, 'search', target, isSorted || false);
    res.json({ success: true, ...result });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/algorithm/benchmark?n=500&dist=random
router.get('/benchmark', (req, res) => {
  try {
    const n    = parseInt(req.query.n) || 100;
    const dist = req.query.dist || 'random';
    let data;
    if (dist === 'sorted')   data = Array.from({length:n},(_,i)=>i);
    else if (dist === 'reverse') data = Array.from({length:n},(_,i)=>n-i);
    else data = Array.from({length:n}, () => Math.floor(Math.random() * n * 10));
    const result = dynamicAlgorithmSelector(data, 'sort');
    res.json({ success: true, n, distribution: dist, ...result });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
