const express = require('express');
const router = express.Router();

// Mock skills database endpoint
const SKILLS = [
  'JavaScript','Python','React','Node.js','Machine Learning',
  'Data Science','Guitar','Piano','Yoga','Photography',
  'Spanish','French','German','Arabic','UI/UX Design',
  'Figma','Blockchain','Solidity','Cooking','Painting',
  'Meditation','Finance','Excel','Public Speaking','Writing'
];

router.get('/', (req, res) => {
  const q = req.query.q?.toLowerCase();
  const results = q ? SKILLS.filter(s => s.toLowerCase().includes(q)) : SKILLS;
  res.json({ skills: results });
});

module.exports = router;
