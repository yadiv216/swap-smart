/**
 * SMARTSWAP — PAGE RENDERERS
 * Each function renders HTML into the respective page div.
 */
import { store } from "./store.js";
import { dynamicAlgorithmSelector, benchmarkAllSorts, generateTestData, detectSortedness } from "./algorithmSelector.js";

// ─── UTILITY HELPERS ────────────────────────────────────────────────────────
function stars(rating) {
  const r = Math.round(rating * 2) / 2;
  const full = Math.floor(r);
  const half = r - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}
function initials(u) {
  return ((u.firstName||'?')[0] + (u.lastName||'?')[0]).toUpperCase();
}
function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function complexBadge(c) {
  const cls = c.includes('n²')?'red': c.includes('log')?'blue': c.includes('1)')?'green':'yellow';
  return `<span class="complexity-badge ${cls}">${c}</span>`;
}

// ─── DASHBOARD PAGE ─────────────────────────────────────────────────────────
export function renderDashboard() {
  const u = store.currentUser;
  const el = document.getElementById('page-dashboard');
  const meetings = store.getMeetings().filter(m => m.status === 'upcoming');
  const feedback = store.getFeedback(u.id);
  const pct = u.credibilityScore;
  el.innerHTML = `
    <div class="page-header">
      <h2>Welcome back, <span class="gradient-text">${u.firstName}</span> &#x1F44B;</h2>
      <p>Here is your skill-barter overview for today.</p>
    </div>
    <div class="profile-card mb-6">
      <div class="profile-avatar-lg">${initials(u)}</div>
      <div class="profile-details" style="flex:1">
        <div class="profile-name">${u.firstName} ${u.lastName}</div>
        <div class="profile-location">&#x1F4CD; ${u.location}</div>
        <div class="profile-bio">${u.bio || 'No bio yet. Click Edit to add one.'}</div>
      </div>
      <div style="flex-shrink:0;text-align:center">
        <div class="credibility-score-ring" style="--pct:${pct}">
          <span class="credibility-score-val">${pct}</span>
        </div>
        <div class="text-sm text-muted" style="margin-top:8px">Credibility Score</div>
        <button class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="openEditProfile()">Edit Profile</button>
      </div>
    </div>
    <div class="stats-grid mb-6">
      <div class="stat-card"><div class="stat-icon purple">&#x1F4DA;</div><div class="stat-value gradient-text">${u.teach.length}</div><div class="stat-label">Skills to Teach</div></div>
      <div class="stat-card"><div class="stat-icon blue">&#x1F3AF;</div><div class="stat-value" style="color:#60a5fa">${u.learn.length}</div><div class="stat-label">Skills to Learn</div></div>
      <div class="stat-card"><div class="stat-icon green">&#x1F91D;</div><div class="stat-value" style="color:#34d399">${u.sessions}</div><div class="stat-label">Sessions Done</div></div>
      <div class="stat-card"><div class="stat-icon yellow">&#x2B50;</div><div class="stat-value" style="color:#fbbf24">${u.avgRating ? u.avgRating.toFixed(1) : '—'}</div><div class="stat-label">Average Rating</div></div>
      <div class="stat-card"><div class="stat-icon pink">&#x1F4AC;</div><div class="stat-value" style="color:#f472b6">${store.getConversations().length}</div><div class="stat-label">Active Chats</div></div>
    </div>
    <div class="two-col mb-6">
      <div class="content-card">
        <div class="flex justify-between items-center mb-4">
          <h3>&#x1F7E2; Skills I Teach</h3>
          <button class="btn btn-sm btn-secondary" onclick="openAddSkill('teach')">+ Add</button>
        </div>
        <div class="skill-tags-list" id="teach-tags">
          ${u.teach.length ? u.teach.map(s => `<span class="skill-tag teach">${s}<button class="skill-tag remove-btn" onclick="removeSkill('teach','${s.replace(/'/g,"\\'")}')">x</button></span>`).join('') : '<span class="text-muted text-sm">No skills added yet.</span>'}
        </div>
      </div>
      <div class="content-card">
        <div class="flex justify-between items-center mb-4">
          <h3>&#x1F535; Skills I Want to Learn</h3>
          <button class="btn btn-sm btn-secondary" onclick="openAddSkill('learn')">+ Add</button>
        </div>
        <div class="skill-tags-list" id="learn-tags">
          ${u.learn.length ? u.learn.map(s => `<span class="skill-tag learn">${s}<button class="skill-tag remove-btn" onclick="removeSkill('learn','${s.replace(/'/g,"\\'")}')">x</button></span>`).join('') : '<span class="text-muted text-sm">No skills added yet.</span>'}
        </div>
      </div>
    </div>
    <div class="two-col">
      <div class="content-card">
        <h3>&#x1F4C5; Upcoming Sessions</h3>
        ${meetings.length ? meetings.map(m => {
          const other = m.participants.find(p => p !== u.id);
          const ou = other ? store.getUserById(other) : null;
          return `<div class="curriculum-item"><div class="curriculum-step active-step">&#x1F4C5;</div><div style="flex:1"><div class="fw-600 text-sm">${m.skill}</div><div class="text-muted text-sm">${m.date} at ${m.time}${ou?' · with '+ou.firstName:''}</div></div></div>`;
        }).join('') : '<p class="text-muted text-sm">No upcoming sessions.</p>'}
      </div>
      <div class="content-card">
        <h3>&#x2B50; Recent Feedback</h3>
        ${feedback.length ? feedback.slice(-3).reverse().map(f => {
          const fr = store.getUserById(f.from);
          return `<div class="curriculum-item"><div class="curriculum-step done">${f.rating}&#x2605;</div><div style="flex:1"><div class="fw-600 text-sm">${f.skill} · by ${fr?fr.firstName:'Someone'}</div><div class="text-muted text-sm">"${f.comment.slice(0,55)}${f.comment.length>55?'…':''}"</div></div></div>`;
        }).join('') : '<p class="text-muted text-sm">No feedback yet.</p>'}
      </div>
    </div>`;
}

// ─── SEARCH PAGE ─────────────────────────────────────────────────────────────
export function renderSearch(query, filters) {
  query = query || '';
  filters = filters || {};
  const el = document.getElementById('page-search');
  const allUsers = store.getUsers().filter(u => u.id !== store.currentUser.id);
  const dataset = allUsers.map(u => ({
    ...u,
    key: (u.firstName+' '+u.lastName+' '+u.teach.join(' ')+' '+u.location).toLowerCase(),
    sortKey: u.credibilityScore
  }));
  const sortRes = dynamicAlgorithmSelector(dataset, 'sort');
  let results = sortRes.result;
  if (query || Object.keys(filters).some(k => filters[k])) {
    const q = query.toLowerCase();
    results = results.filter(u => {
      const mQ = !q || u.key.includes(q);
      const mR = !filters.minRating || u.avgRating >= parseFloat(filters.minRating);
      const mL = !filters.location || (u.location||'').toLowerCase().includes(filters.location.toLowerCase());
      return mQ && mR && mL;
    });
  }
  const ar = sortRes;
  el.innerHTML = `
    <div class="page-header">
      <h2>Search <span class="gradient-text">Skills and People</span></h2>
      <p>Find your perfect skill-swap partner. Powered by <strong style="color:#22d3ee">Dynamic Algorithm Selector</strong>.</p>
    </div>
    <div class="algo-result-panel mb-6">
      <h4>Algorithm Selector Active</h4>
      <div class="algo-metric-row"><span class="algo-metric-key">Selected Algorithm</span><span class="algo-metric-val">${ar.algorithmUsed}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Dataset Size (n)</span><span class="algo-metric-val">${ar.metrics.n}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Time Complexity</span><span class="algo-metric-val">${ar.complexity ? ar.complexity.time : 'N/A'}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Execution Time</span><span class="algo-metric-val">${ar.executionTime.toFixed(3)} ms</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Sortedness</span><span class="algo-metric-val">${ar.metrics.sortedness}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Reason</span><span class="algo-metric-val" style="font-size:0.75rem;max-width:300px;text-align:right">${ar.reason}</span></div>
    </div>
    <div class="search-bar-wrap" id="search-wrap">
      <span class="search-icon">&#x2315;</span>
      <input class="search-bar" id="main-search-input" type="text" placeholder="Search by skill, name, or location..." value="${escHtml(query)}"
        oninput="handleSearchInput(this.value)" onkeydown="if(event.key==='Enter')doSearch()" />
      <div class="search-suggestions hidden" id="search-suggestions"></div>
    </div>
    <div class="filter-bar">
      <span class="filter-label">Filters:</span>
      <select class="filter-select" id="filter-rating" onchange="applyFilters()">
        <option value="">Any Rating</option>
        <option value="4.5" ${filters.minRating=='4.5'?'selected':''}>4.5+ Stars</option>
        <option value="4"   ${filters.minRating=='4'?'selected':''}>4.0+ Stars</option>
        <option value="3"   ${filters.minRating=='3'?'selected':''}>3.0+ Stars</option>
      </select>
      <input class="filter-select" id="filter-location" type="text" placeholder="City / Location"
        value="${escHtml(filters.location||'')}" onchange="applyFilters()" style="flex:0 1 180px" />
      <button class="btn btn-secondary btn-sm" onclick="clearFilters()">Clear</button>
    </div>
    <div class="mb-4"><span class="text-muted text-sm">${results.length} result${results.length!==1?'s':''} found</span></div>
    <div class="results-grid" id="search-results">
      ${results.length ? results.map(u => `
        <div class="skill-card" onclick="openUserModal('${u.id}')">
          <div class="skill-card-header">
            <div class="skill-card-avatar">${initials(u)}</div>
            <div><div class="skill-card-name">${u.firstName} ${u.lastName}</div><div class="skill-card-location">&#x1F4CD; ${u.location}</div></div>
          </div>
          <div class="skill-tags-list mb-2">${u.teach.slice(0,3).map(s=>`<span class="skill-tag teach">${s}</span>`).join('')}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px">Wants to learn:</div>
          <div class="skill-tags-list">${u.learn.slice(0,2).map(s=>`<span class="skill-tag learn">${s}</span>`).join('')}</div>
          <div class="skill-card-footer">
            <div><span class="rating-stars">${stars(u.avgRating||0)}</span><span class="text-sm text-muted"> (${u.ratingsCount})</span></div>
            <span class="credibility-badge">Score: ${u.credibilityScore}</span>
          </div>
        </div>`).join('')
      : '<div class="content-card text-center" style="grid-column:1/-1"><p class="text-muted">No users found. Try different keywords.</p></div>'}
    </div>`;
  // Init suggestions
  const skills = [...new Set(allUsers.flatMap(u => [...u.teach, ...u.learn]))].sort();
  const inp = document.getElementById('main-search-input');
  const sugg = document.getElementById('search-suggestions');
  if (inp && sugg) {
    inp.addEventListener('input', () => {
      const q = inp.value.trim().toLowerCase();
      if (!q) { sugg.classList.add('hidden'); return; }
      const m = skills.filter(s => s.toLowerCase().includes(q)).slice(0,6);
      if (!m.length) { sugg.classList.add('hidden'); return; }
      sugg.innerHTML = m.map(s => {
        const hi = s.replace(new RegExp('('+q+')','gi'),'<em>$1</em>');
        return `<div class="suggestion-item" onclick="selectSuggestion('${s.replace(/'/g,"\\'")}')">&#x2315; ${hi}</div>`;
      }).join('');
      sugg.classList.remove('hidden');
    });
    document.addEventListener('click', e => { if (!e.target.closest('#search-wrap')) sugg.classList.add('hidden'); });
  }
}

// ─── HUB PAGE ───────────────────────────────────────────────────────────────
export function renderHub(activeConvoId) {
  activeConvoId = activeConvoId || null;
  const el = document.getElementById('page-hub');
  const convos = store.getConversations();
  const tab = window._hubTab || 'chat';
  const defConvo = activeConvoId || (convos[0] ? convos[0].user.id : null);

  el.innerHTML = `
    <div class="page-header">
      <h2>Management <span class="gradient-text">Hub</span></h2>
      <p>Messaging, scheduling, and curriculum tracking.</p>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap">
      <button class="btn ${tab==='chat'?'btn-primary':'btn-secondary'}" onclick="switchHubTab('chat')">&#x1F4AC; Messages</button>
      <button class="btn ${tab==='calendar'?'btn-primary':'btn-secondary'}" onclick="switchHubTab('calendar')">&#x1F4C5; Scheduler</button>
      <button class="btn ${tab==='curriculum'?'btn-primary':'btn-secondary'}" onclick="switchHubTab('curriculum')">&#x1F4DA; Curriculum</button>
    </div>
    <div id="hub-tab-chat" style="display:${tab==='chat'?'block':'none'}">
      <div class="hub-layout">
        <div class="conversation-list">
          <div style="padding:14px 16px;border-bottom:1px solid var(--border);font-weight:600;font-size:0.85rem;color:var(--text-secondary)">Conversations</div>
          ${convos.map(c => `
            <div class="conversation-item ${c.user.id===defConvo?'active':''}" onclick="openConvo('${c.user.id}')">
              <div class="convo-avatar">${initials(c.user)}</div>
              <div class="convo-info">
                <div class="convo-name">${c.user.firstName} ${c.user.lastName}</div>
                <div class="convo-preview">${escHtml(c.lastMsg)}</div>
              </div>
            </div>`).join('') || '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:0.85rem">No conversations yet.<br>Find someone on Search!</div>'}
          <div style="padding:12px 16px">
            <button class="btn btn-secondary btn-sm w-full" onclick="navigateTo('search',document.getElementById('nav-search'))">+ New Chat</button>
          </div>
        </div>
        <div class="chat-panel" id="chat-panel">
          ${defConvo ? renderChatPanel(defConvo) : '<div style="display:flex;align-items:center;justify-content:center;flex:1;color:var(--text-muted)">Select a conversation</div>'}
        </div>
      </div>
    </div>
    <div id="hub-tab-calendar" style="display:${tab==='calendar'?'block':'none'}">${renderScheduler()}</div>
    <div id="hub-tab-curriculum" style="display:${tab==='curriculum'?'block':'none'}">${renderCurriculum()}</div>
  `;
  if (defConvo) {
    const msgBox = document.getElementById('chat-messages-'+defConvo);
    if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
  }
}

function renderChatPanel(userId) {
  const u = store.getUserById(userId);
  if (!u) return '<div style="padding:24px;color:var(--text-muted)">User not found.</div>';
  const messages = store.getMessages(userId);
  const myId = store.currentUser.id;
  return `
    <div class="chat-header">
      <div class="convo-avatar">${initials(u)}</div>
      <div><div class="fw-600">${u.firstName} ${u.lastName}</div><div class="text-sm text-muted">&#x1F4CD; ${u.location}</div></div>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button class="btn btn-secondary btn-sm" onclick="openUserModal('${u.id}')">View Profile</button>
        <button class="btn btn-primary btn-sm" onclick="openScheduleModal('${u.id}')">Schedule</button>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages-${userId}">
      ${messages.map(m => `
        <div class="message ${m.from===myId?'sent':'received'}">
          <div class="message-bubble">${escHtml(m.text)}</div>
          <div class="message-time">${m.time}</div>
        </div>`).join('')}
    </div>
    <div class="chat-input-row">
      <input class="chat-input" id="chat-input-${userId}" placeholder="Type a message..."
        onkeydown="if(event.key==='Enter')sendMsg('${userId}')" />
      <button class="btn btn-primary" onclick="sendMsg('${userId}')">Send</button>
    </div>`;
}

function renderScheduler() {
  const meetings = store.getMeetings();
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const monthName = now.toLocaleString('default',{month:'long'});
  const daysInMonth = new Date(year,month+1,0).getDate();
  const startDay = new Date(year,month,1).getDay();
  const today = now.getDate();
  const meetDays = new Set(meetings.map(m => new Date(m.date+'T12:00').getDate()));
  let cells = '';
  for (let i=0;i<startDay;i++) cells += '<div class="cal-day empty"></div>';
  for (let d=1;d<=daysInMonth;d++) {
    const isToday=d===today, hasEv=meetDays.has(d);
    cells += `<div class="cal-day ${isToday?'today':''} ${hasEv&&!isToday?'has-event':''}">${d}</div>`;
  }
  const myId = store.currentUser.id;
  return `
    <div class="two-col">
      <div class="content-card">
        <div class="flex justify-between items-center mb-4">
          <h3>&#x1F4C5; ${monthName} ${year}</h3>
          <button class="btn btn-primary btn-sm" onclick="openScheduleModal(null)">+ Schedule</button>
        </div>
        <div class="calendar-grid">
          ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="cal-day-header">${d}</div>`).join('')}
          ${cells}
        </div>
      </div>
      <div class="content-card">
        <h3>&#x1F4CB; Your Sessions</h3>
        ${meetings.length ? meetings.map(m => {
          const other = m.participants.find(p=>p!==myId);
          const ou = other ? store.getUserById(other) : null;
          return `<div class="curriculum-item">
            <div class="curriculum-step ${m.status==='completed'?'done':'active-step'}">${m.status==='completed'?'V':'C'}</div>
            <div style="flex:1">
              <div class="fw-600 text-sm">${m.skill}</div>
              <div class="text-muted text-sm">${m.date} - ${m.time}${ou?' - '+ou.firstName:''}</div>
              ${m.notes?`<div class="text-muted text-sm">${m.notes}</div>`:''}
            </div>
            <span class="credibility-badge">${m.status}</span>
          </div>`;
        }).join('') : '<p class="text-muted text-sm">No sessions scheduled yet.</p>'}
      </div>
    </div>`;
}

function renderCurriculum() {
  const u = store.currentUser;
  const topics = [
    {title:(u.teach[0]||'Skill')+' Foundations', status:'done', progress:100},
    {title:(u.teach[1]||'Skill')+' Advanced', status:'done', progress:100},
    {title:(u.learn[0]||'Learning')+' Basics', status:'active-step', progress:65},
    {title:(u.learn[1]||'Learning')+' Practice', status:'pending', progress:0},
    {title:(u.learn[2]||'Subject')+' Advanced', status:'pending', progress:0},
  ];
  return `
    <div class="two-col">
      <div class="content-card">
        <h3>&#x1F4DA; My Learning Path</h3>
        ${topics.map((t,i) => `
          <div class="curriculum-item">
            <div class="curriculum-step ${t.status}">${t.status==='done'?'V':t.status==='active-step'?i+1:'o'}</div>
            <div style="flex:1">
              <div class="fw-600 text-sm" style="margin-bottom:6px">${t.title}</div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${t.progress}%"></div></div>
              <div class="text-muted text-sm" style="margin-top:4px">${t.progress}% complete</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="content-card">
        <h3>&#x1F3AF; Swap Goals</h3>
        ${[{teach:u.teach[0]||'Skill',learn:u.learn[0]||'Learning',p:65},{teach:u.teach[1]||'Skill',learn:u.learn[1]||'Learning',p:30}].map(g=>`
          <div class="curriculum-item">
            <div class="curriculum-step active-step">S</div>
            <div style="flex:1">
              <div class="fw-600 text-sm">${g.teach} with ${g.learn}</div>
              <div class="progress-bar-wrap" style="margin-top:6px"><div class="progress-bar-fill" style="width:${g.p}%;background:linear-gradient(135deg,#ec4899,#f59e0b)"></div></div>
              <div class="text-muted text-sm" style="margin-top:4px">${g.p}% of goal</div>
            </div>
          </div>`).join('')}
        <div style="margin-top:20px;padding:16px;background:rgba(124,58,237,0.06);border-radius:12px;border:1px solid rgba(124,58,237,0.15)">
          <div class="text-sm fw-600" style="margin-bottom:4px">Streak</div>
          <div class="stat-value gradient-text">7 days</div>
          <div class="text-muted text-sm">Keep swapping skills weekly!</div>
        </div>
      </div>
    </div>`;
}

export { renderChatPanel };

// ─── ANALYTICS PAGE ──────────────────────────────────────────────────────────
let _charts = {};

export function renderAnalytics() {
  const el = document.getElementById('page-analytics');
  el.innerHTML = `
    <div class="page-header">
      <h2>Performance <span class="gradient-text">Analytics</span></h2>
      <p>Real-time algorithm benchmarking and visualization.</p>
    </div>
    <div class="content-card mb-6">
      <h3>Greedy Algorithm Benchmark Runner</h3>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:16px;align-items:flex-end">
        <div class="form-group" style="flex:0 1 auto">
          <label class="form-label">Dataset Size (n)</label>
          <select class="filter-select" id="bench-n">
            <option value="20">n = 20 (Small)</option>
            <option value="100" selected>n = 100</option>
            <option value="500">n = 500</option>
            <option value="2000">n = 2,000</option>
            <option value="10000">n = 10,000</option>
          </select>
        </div>
        <div class="form-group" style="flex:0 1 auto">
          <label class="form-label">Distribution</label>
          <select class="filter-select" id="bench-dist">
            <option value="random">Random</option>
            <option value="nearly-sorted">Nearly Sorted (90%+)</option>
            <option value="sorted">Already Sorted</option>
            <option value="reverse">Reverse Sorted</option>
          </select>
        </div>
        <button class="btn btn-primary" onclick="runBenchmark()">Run Benchmark</button>
      </div>
      <div id="bench-result"></div>
    </div>
    <div class="two-col mb-6">
      <div class="content-card"><h3>Time vs Dataset Size</h3><div class="chart-wrap"><canvas id="chart-time-n"></canvas></div></div>
      <div class="content-card"><h3>Algorithm Benchmark Comparison</h3><div class="chart-wrap"><canvas id="chart-bench"></canvas></div></div>
    </div>
    <div class="two-col mb-6">
      <div class="content-card">
        <h3>Decision Tree: Sort</h3>
        <div class="dtree-wrap">
<span class="dtree-node">Sort Algorithm Selection (Greedy)</span>
n &lt; 50?
  YES + nearly sorted: <span class="dtree-sort-leaf">Bubble Sort</span> O(n)
  YES + not sorted:    <span class="dtree-sort-leaf">Selection Sort</span> O(n2)
  NO, n &lt; 1000?
    YES + nearly sorted: <span class="dtree-sort-leaf">Insertion Sort</span> O(n)
    YES + not sorted:    <span class="dtree-sort-leaf">Merge Sort</span> O(n log n)
    NO, n &lt; 100000?
      YES + nearly sorted: <span class="dtree-sort-leaf">Tim Sort</span> O(n log n)
      YES + not sorted:    <span class="dtree-sort-leaf">Quick Sort</span> O(n log n)
      NO: <span class="dtree-sort-leaf">Merge Sort</span> O(n log n)
        </div>
      </div>
      <div class="content-card">
        <h3>Decision Tree: Search</h3>
        <div class="dtree-wrap">
<span class="dtree-node">Search Algorithm Selection (Greedy)</span>
n &lt; 50?
  YES: <span class="dtree-leaf">Linear Search</span> O(n)
n in [50, 10000)?
  Sorted/Nearly sorted: <span class="dtree-leaf">Binary Search</span> O(log n)
  Unsorted:             <span class="dtree-leaf">Linear Search</span> O(n)
n >= 10000?
  <span class="dtree-leaf">Hash Search</span> O(1) average
        </div>
      </div>
    </div>
    <div class="content-card mb-6">
      <h3>Algorithm Complexity Reference</h3>
      <table class="algo-table">
        <thead><tr><th>Algorithm</th><th>Type</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Used When</th></tr></thead>
        <tbody>
          ${[
            ['Bubble Sort',    'Sort',   'O(n)',       'O(n2)',      'O(n2)',       'O(1)',    'n<50, nearly sorted'],
            ['Selection Sort', 'Sort',   'O(n2)',      'O(n2)',      'O(n2)',       'O(1)',    'n<50, min swaps'],
            ['Insertion Sort', 'Sort',   'O(n)',       'O(n2)',      'O(n2)',       'O(1)',    'n<1000, nearly sorted'],
            ['Merge Sort',     'Sort',   'O(n log n)', 'O(n log n)','O(n log n)', 'O(n)',    'n>=50, stable order'],
            ['Quick Sort',     'Sort',   'O(n log n)', 'O(n log n)','O(n2)',       'O(log n)','n>=1000, random data'],
            ['Tim Sort',       'Sort',   'O(n)',       'O(n log n)','O(n log n)', 'O(n)',    'n>=1000, nearly sorted'],
            ['Linear Search',  'Search', 'O(1)',       'O(n)',       'O(n)',        'O(1)',    'n<50 or unsorted'],
            ['Binary Search',  'Search', 'O(1)',       'O(log n)',  'O(log n)',   'O(1)',    'n>=50, sorted data'],
            ['Hash Search',    'Search', 'O(1)',       'O(1)',       'O(n)',        'O(n)',    'n>=10000, frequent queries'],
          ].map(r => {
            const tc = c => { const cls=c.includes('n2')?'red':c.includes('log')?'blue':c.includes('1)')?'green':'yellow'; return `<span class="complexity-badge ${cls}">${c}</span>`; };
            return `<tr><td class="fw-600">${r[0]}</td><td><span class="algo-badge" style="padding:2px 8px;font-size:0.7rem">${r[1]}</span></td><td>${tc(r[2])}</td><td>${tc(r[3])}</td><td>${tc(r[4])}</td><td>${tc(r[5])}</td><td class="text-muted text-sm">${r[6]}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div class="content-card">
      <h3>Limitations and NP-Hard Discussion</h3>
      <div class="two-col" style="margin-top:12px">
        <div>
          <div class="fw-600 text-sm" style="color:#f59e0b;margin-bottom:8px">Known Limitations</div>
          <ul style="list-style:disc;padding-left:20px;display:flex;flex-direction:column;gap:8px">
            <li class="text-sm text-secondary">Greedy heuristics are locally optimal but not always globally optimal</li>
            <li class="text-sm text-secondary">Nearly-sorted detection requires O(n) scan (overhead for hot paths)</li>
            <li class="text-sm text-secondary">Merge Sort and Hash Search require O(n) auxiliary space</li>
            <li class="text-sm text-secondary">Quick Sort degrades to O(n2) on adversarial inputs</li>
            <li class="text-sm text-secondary">Hash collisions can degrade Hash Search to O(n) worst case</li>
          </ul>
        </div>
        <div>
          <div class="fw-600 text-sm" style="color:#f87171;margin-bottom:8px">NP-Hard Context</div>
          <p class="text-sm text-secondary" style="line-height:1.7">
            Optimal global skill-barter pairing across a user graph is equivalent to
            <strong style="color:#f87171">Maximum Weighted Bipartite Matching</strong> (solvable in O(n3) via
            Hungarian Algorithm). Multi-hop skill chains reduce to <strong>3-Dimensional Matching</strong>,
            which is NP-Hard. SmartSwap uses a greedy O(n log n) approximation
            (sort by credibility + overlap scoring) providing a practical 2-approximation.
          </p>
        </div>
      </div>
    </div>
  `;
  setTimeout(drawTimeVsNChart, 120);
}

function drawTimeVsNChart() {
  const ctx = document.getElementById('chart-time-n');
  if (!ctx) return;
  if (_charts['tn']) _charts['tn'].destroy();
  const ns = [10,50,100,500,1000,5000];
  _charts['tn'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ns.map(n=>'n='+n),
      datasets: [
        {label:'Bubble O(n2)',    data:ns.map(n=>n<=1000?(n*n)/600000:null), borderColor:'#f87171',backgroundColor:'rgba(248,113,113,0.08)',tension:0.4,pointRadius:4},
        {label:'Merge O(n log n)',data:ns.map(n=>(n*Math.log2(n))/120000),  borderColor:'#60a5fa',backgroundColor:'rgba(96,165,250,0.08)',tension:0.4,pointRadius:4},
        {label:'Quick O(n log n)',data:ns.map(n=>(n*Math.log2(n))/100000),  borderColor:'#a78bfa',backgroundColor:'rgba(167,139,250,0.08)',tension:0.4,pointRadius:4},
        {label:'Linear O(n)',     data:ns.map(n=>n/12000),                  borderColor:'#fbbf24',backgroundColor:'rgba(251,191,36,0.08)',tension:0.4,pointRadius:4},
        {label:'Binary O(log n)', data:ns.map(n=>Math.log2(n)/1200),        borderColor:'#34d399',backgroundColor:'rgba(52,211,153,0.08)',tension:0.4,pointRadius:4},
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      scales:{
        x:{ticks:{color:'#94a3b8'},grid:{color:'rgba(255,255,255,0.05)'}},
        y:{ticks:{color:'#94a3b8'},grid:{color:'rgba(255,255,255,0.05)'},title:{display:true,text:'Relative Time',color:'#64748b'}}
      },
      plugins:{legend:{labels:{color:'#94a3b8',font:{family:'Inter'}}}}
    }
  });
}

export function runBenchmark() {
  const n    = parseInt(document.getElementById('bench-n')?.value||'100');
  const dist = document.getElementById('bench-dist')?.value||'random';
  const data = generateTestData(n, dist);
  const sortedness = detectSortedness(data);
  const greedyResult = dynamicAlgorithmSelector(data, 'sort');
  const allResults = benchmarkAllSorts(data);

  document.getElementById('bench-result').innerHTML = `
    <div class="algo-result-panel" style="margin-bottom:16px">
      <h4>Greedy Selection Result</h4>
      <div class="algo-metric-row"><span class="algo-metric-key">Selected</span><span class="algo-metric-val">${greedyResult.algorithmUsed}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">n</span><span class="algo-metric-val">${n}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Distribution</span><span class="algo-metric-val">${dist}</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Sortedness</span><span class="algo-metric-val">${(sortedness*100).toFixed(1)}%</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Exec Time</span><span class="algo-metric-val">${greedyResult.executionTime.toFixed(4)} ms</span></div>
      <div class="algo-metric-row"><span class="algo-metric-key">Decision Path</span><span class="algo-metric-val" style="font-size:0.73rem">${greedyResult.decisionPath.join(' > ')}</span></div>
    </div>`;

  const ctx = document.getElementById('chart-bench');
  if (ctx) {
    if (_charts['bench']) _charts['bench'].destroy();
    const app = allResults.filter(r=>!r.skipped);
    _charts['bench'] = new Chart(ctx, {
      type:'bar',
      data:{
        labels:app.map(r=>r.name),
        datasets:[{
          label:'Exec Time (ms)',
          data:app.map(r=>parseFloat(r.time.toFixed(4))),
          backgroundColor:['rgba(248,113,113,0.7)','rgba(251,191,36,0.7)','rgba(34,211,238,0.7)','rgba(96,165,250,0.7)','rgba(167,139,250,0.7)','rgba(52,211,153,0.7)'],
          borderRadius:6
        }]
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        scales:{
          x:{ticks:{color:'#94a3b8'},grid:{color:'rgba(255,255,255,0.05)'}},
          y:{ticks:{color:'#94a3b8'},grid:{color:'rgba(255,255,255,0.05)'},title:{display:true,text:'Time (ms)',color:'#64748b'}}
        },
        plugins:{legend:{display:false}}
      }
    });
  }
}

// ─── FEEDBACK PAGE ────────────────────────────────────────────────────────────
export function renderFeedback() {
  const el = document.getElementById('page-feedback');
  const u = store.currentUser;
  const received = store.getFeedback(u.id);
  const all = store.getUsers().filter(x => x.id !== u.id);
  const pct = u.credibilityScore;
  el.innerHTML = `
    <div class="page-header">
      <h2>Feedback and <span class="gradient-text">Ratings</span></h2>
      <p>Rate sessions and manage your credibility score.</p>
    </div>
    <div class="two-col mb-6">
      <div class="content-card text-center">
        <h3 style="margin-bottom:20px">Your Credibility Score</h3>
        <div class="credibility-score-ring" style="--pct:${pct};width:140px;height:140px;margin-bottom:16px">
          <span class="credibility-score-val" style="font-size:2rem">${pct}</span>
        </div>
        <div class="rating-stars" style="font-size:1.4rem;margin-bottom:4px">${stars(u.avgRating||0)}</div>
        <div class="text-secondary text-sm">${u.avgRating ? u.avgRating.toFixed(2) : '0.00'} avg - ${u.ratingsCount} ratings</div>
        <div style="margin-top:16px;padding:12px;background:rgba(16,185,129,0.06);border-radius:10px;border:1px solid rgba(16,185,129,0.15)">
          <div class="text-sm text-secondary">Score = 70% avg rating + 30% session volume</div>
        </div>
      </div>
      <div class="content-card">
        <h3 style="margin-bottom:16px">Rate a Session</h3>
        <div class="form-group">
          <label class="form-label">Select Partner</label>
          <select class="filter-select w-full" id="rate-user" style="padding:12px 16px">
            <option value="">Choose a user...</option>
            ${all.map(x => `<option value="${x.id}">${x.firstName} ${x.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group" style="margin-top:14px">
          <label class="form-label">Skill</label>
          <input class="form-input" type="text" id="rate-skill" placeholder="e.g. JavaScript, Guitar" />
        </div>
        <div style="margin-top:14px">
          <div class="form-label" style="margin-bottom:8px">Rating</div>
          <div class="star-picker" id="star-picker">
            ${[1,2,3,4,5].map(n => `<button class="star-btn" id="star-${n}" onclick="setRating(${n})">&#x2605;</button>`).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-top:14px">
          <label class="form-label">Review</label>
          <textarea class="form-input" id="rate-comment" rows="3" placeholder="Share your experience..." style="resize:vertical"></textarea>
        </div>
        <button class="btn btn-primary w-full" style="margin-top:16px" onclick="submitFeedback()">Submit Feedback</button>
      </div>
    </div>
    <div class="content-card">
      <h3 style="margin-bottom:20px">Feedback Received (${received.length})</h3>
      ${received.length ? received.slice().reverse().map(f => {
        const fr = store.getUserById(f.from);
        return `<div class="feedback-card">
          <div class="feedback-header">
            <div class="user-avatar">${fr?initials(fr):'?'}</div>
            <div style="flex:1"><div class="fw-600">${fr?fr.firstName+' '+fr.lastName:'Unknown'}</div><div class="text-muted text-sm">${f.skill} - ${f.date}</div></div>
            <div class="rating-stars">${stars(f.rating)}</div>
          </div>
          <p class="text-secondary text-sm">"${escHtml(f.comment)}"</p>
        </div>`;
      }).join('') : '<p class="text-muted text-sm">No feedback received yet.</p>'}
    </div>`;
  window._currentRating = 0;
}
