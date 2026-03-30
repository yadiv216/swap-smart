# SmartSwap - Adaptive Skill Barter Platform

A production-ready web application where users teach and learn skills,
powered by a Greedy Dynamic Algorithm Selector (DAA module).

## Quick Start (No Build Required)

### Option 1: Open Directly in Browser
Just open `index.html` in any modern browser.
- Uses localStorage for data persistence  
- No server or build tools required  
- All algorithms run client-side

### Option 2: Run with Node.js Backend (if Node.js is installed)
```bash
npm install
npm start
# Open http://localhost:3001
```

## Demo Credentials
- Email: demo@smartswap.io
- Password: demo1234

## Features

### UI
- Dashboard with profile, skills, credibility score
- Search with real-time suggestions and filters
- Management Hub: Messaging, Scheduler, Curriculum
- Feedback & Ratings system
- Performance Analytics with live charts

### Algorithm Module (Greedy Strategy)
- **n < 50**: Linear Search, Bubble/Selection Sort O(n2)
- **n in [50, 1000)**: Binary Search, Merge/Insertion Sort O(n log n)
- **n in [1000, 100k)**: Quick Sort / Tim Sort O(n log n)
- **n >= 100,000**: Merge Sort (guaranteed O(n log n))
- **Nearly Sorted (>= 90%)**: Optimized algorithms (Insertion/Bubble with early exit)
- **n >= 10,000 search**: Hash Search O(1) avg

## File Structure
```
index.html          - Main HTML entry
css/style.css       - All styles
js/app.js           - App controller (routing, auth, actions)
js/store.js         - In-memory data store (localStorage)
js/pages.js         - Page renderers (Dashboard, Search, Hub, Analytics, Feedback)
js/algorithmSelector.js  - Dynamic Algorithm Selector (DAA core module)
server/index.js     - Express server (optional)
server/services/    - Backend algorithm service
server/routes/      - API route handlers
```

## Architecture
Frontend (HTML/CSS/JS) -> localStorage (store.js) -> Algorithm Module (algorithmSelector.js)
Optional: Backend (Express) -> REST API (/api/algorithm, /api/skills)

## Tech Stack
- Frontend: Vanilla JS (ES Modules), CSS3
- Charts: Chart.js v4 (CDN)
- Fonts: Inter, Space Grotesk (Google Fonts)
- Backend: Node.js + Express (optional)
- Database: localStorage (client) / Firebase-ready (server)
