/**
 * SMARTSWAP — EXPRESS BACKEND SERVER
 * Run: node server/index.js
 * Requires: npm install express cors body-parser
 */
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

// Route handlers
const algorithmRoutes = require('./routes/algorithm');
const skillRoutes     = require('./routes/skills');
const userRoutes      = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/algorithm', algorithmRoutes);
app.use('/api/skills',    skillRoutes);
app.use('/api/users',     userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartSwap API running', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Catch-all: serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SmartSwap API running at http://localhost:${PORT}`);
});

module.exports = app;
