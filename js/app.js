/**
 * SMARTSWAP — MAIN APPLICATION CONTROLLER
 * Handles: Auth, Routing, Global Actions, Modals, Toast
 */
import { store } from "./store.js";
import { renderDashboard, renderSearch, renderHub, renderAnalytics, renderFeedback, runBenchmark, renderChatPanel } from "./pages.js";

// --- STATE -------------------------------------------------------------------
let _currentPage = 'dashboard';
let _searchQuery = '';
let _searchFilters = {};

// --- INIT --------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  if (store.currentUser) {
    showApp();
  }
});

function showApp() {
  const u = store.currentUser;
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('main-app').classList.remove('hidden');
  document.getElementById('sidebar-avatar').textContent = (u.firstName[0]+u.lastName[0]).toUpperCase();
  document.getElementById('sidebar-name').textContent = u.firstName + ' ' + u.lastName;
  navigateTo('dashboard', document.getElementById('nav-dashboard'));
}

function showAuth() {
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('auth-screen').classList.add('active');
}

// --- AUTH --------------------------------------------------------------------
window.switchAuthTab = function(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('auth-error').classList.add('hidden');
};

window.handleLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  try {
    store.login(email, pass);
    showToast('Welcome back!', 'success');
    showApp();
  } catch(err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  }
};

window.handleSignup = function(e) {
  e.preventDefault();
  const fn  = document.getElementById('signup-fname').value.trim();
  const ln  = document.getElementById('signup-lname').value.trim();
  const em  = document.getElementById('signup-email').value.trim();
  const pw  = document.getElementById('signup-password').value;
  const loc = document.getElementById('signup-location').value.trim();
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');
  try {
    store.signup(fn, ln, em, pw, loc);
    showToast('Account created! Welcome to SmartSwap!', 'success');
    showApp();
  } catch(err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  }
};

window.handleLogout = function() {
  store.logout();
  showAuth();
  showToast('Signed out successfully.', 'info');
};

// --- NAVIGATION --------------------------------------------------------------
window.navigateTo = function(page, linkEl) {
  _currentPage = page;
  document.querySelectorAll('.page').forEach(p => { p.classList.add('hidden'); p.classList.remove('active'); });
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) { pageEl.classList.remove('hidden'); pageEl.classList.add('active'); }
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  // Render page content
  switch(page) {
    case 'dashboard': renderDashboard(); break;
    case 'search':    renderSearch(_searchQuery, _searchFilters); break;
    case 'hub':       renderHub(); break;
    case 'analytics': renderAnalytics(); break;
    case 'feedback':  renderFeedback(); break;
  }
};

// --- SEARCH ACTIONS ----------------------------------------------------------
window.handleSearchInput = function(val) {
  _searchQuery = val;
};

window.doSearch = function() {
  renderSearch(_searchQuery, _searchFilters);
};

window.selectSuggestion = function(skill) {
  _searchQuery = skill;
  document.getElementById('main-search-input').value = skill;
  document.getElementById('search-suggestions')?.classList.add('hidden');
  renderSearch(skill, _searchFilters);
};

window.applyFilters = function() {
  _searchFilters = {
    minRating: document.getElementById('filter-rating')?.value || '',
    location:  document.getElementById('filter-location')?.value || '',
  };
  renderSearch(_searchQuery, _searchFilters);
};

window.clearFilters = function() {
  _searchQuery = '';
  _searchFilters = {};
  renderSearch('', {});
};

// --- SKILL MANAGEMENT --------------------------------------------------------
window.openAddSkill = function(type) {
  const label = type === 'teach' ? 'Skill to Teach' : 'Skill to Learn';
  const suggestions = [
    'JavaScript','Python','React','Node.js','Machine Learning','Data Science',
    'Guitar','Piano','Yoga','Photography','Spanish','French','German','Arabic',
    'UI/UX Design','Figma','Blockchain','Solidity','Cooking','Painting',
    'Meditation','Finance','Excel','Public Speaking','Writing','SEO'
  ];
  openModal(`
    <h3 style="margin-bottom:20px;font-family:'Space Grotesk',sans-serif">Add ${label}</h3>
    <div class="form-group">
      <label class="form-label">Skill Name</label>
      <input class="form-input" type="text" id="new-skill-input" placeholder="e.g. JavaScript" list="skill-suggestions-list" />
      <datalist id="skill-suggestions-list">${suggestions.map(s=>`<option value="${s}">`).join('')}</datalist>
    </div>
    <button class="btn btn-primary w-full" style="margin-top:16px" onclick="confirmAddSkill('${type}')">Add Skill</button>
  `);
  setTimeout(() => document.getElementById('new-skill-input')?.focus(), 100);
};

window.confirmAddSkill = function(type) {
  const val = document.getElementById('new-skill-input')?.value.trim();
  if (!val) return showToast('Please enter a skill name.', 'error');
  store.addSkill(type, val);
  closeModal();
  renderDashboard();
  showToast(`"${val}" added to your ${type === 'teach' ? 'teaching' : 'learning'} list!`, 'success');
};

window.removeSkill = function(type, skill) {
  store.removeSkill(type, skill);
  renderDashboard();
  showToast(`"${skill}" removed.`, 'info');
};

// --- PROFILE EDIT ------------------------------------------------------------
window.openEditProfile = function() {
  const u = store.currentUser;
  openModal(`
    <h3 style="margin-bottom:20px;font-family:'Space Grotesk',sans-serif">Edit Profile</h3>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">First Name</label>
        <input class="form-input" type="text" id="edit-fname" value="${u.firstName}" />
      </div>
      <div class="form-group">
        <label class="form-label">Last Name</label>
        <input class="form-input" type="text" id="edit-lname" value="${u.lastName}" />
      </div>
    </div>
    <div class="form-group" style="margin-top:14px">
      <label class="form-label">Location</label>
      <input class="form-input" type="text" id="edit-location" value="${u.location}" />
    </div>
    <div class="form-group" style="margin-top:14px">
      <label class="form-label">Bio</label>
      <textarea class="form-input" id="edit-bio" rows="3" style="resize:vertical">${u.bio || ''}</textarea>
    </div>
    <button class="btn btn-primary w-full" style="margin-top:16px" onclick="saveProfile()">Save Changes</button>
  `);
};

window.saveProfile = function() {
  const fn  = document.getElementById('edit-fname')?.value.trim();
  const ln  = document.getElementById('edit-lname')?.value.trim();
  const loc = document.getElementById('edit-location')?.value.trim();
  const bio = document.getElementById('edit-bio')?.value.trim();
  if (!fn || !ln) return showToast('Name cannot be empty.', 'error');
  store.updateCurrentUser({ firstName: fn, lastName: ln, location: loc, bio });
  closeModal();
  renderDashboard();
  document.getElementById('sidebar-name').textContent = fn + ' ' + ln;
  document.getElementById('sidebar-avatar').textContent = (fn[0] + ln[0]).toUpperCase();
  showToast('Profile updated!', 'success');
};

// --- USER PROFILE MODAL ------------------------------------------------------
window.openUserModal = function(userId) {
  const u = store.getUserById(userId);
  if (!u) return;
  const av = (u.firstName[0]+u.lastName[0]).toUpperCase();
  openModal(`
    <div style="text-align:center;margin-bottom:20px">
      <div class="profile-avatar-lg" style="margin:0 auto 12px">${av}</div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:1.3rem;font-weight:700">${u.firstName} ${u.lastName}</div>
      <div style="color:var(--text-muted);font-size:0.85rem">&#x1F4CD; ${u.location}</div>
      <div class="rating-stars" style="margin-top:6px">${'?'.repeat(Math.round(u.avgRating||0))}${'?'.repeat(5-Math.round(u.avgRating||0))}</div>
      <div style="font-size:0.82rem;color:var(--text-muted)">${u.avgRating?u.avgRating.toFixed(1):'N/A'} avg (${u.ratingsCount} ratings)</div>
    </div>
    <div style="display:flex;gap:16px;margin-bottom:16px">
      <div style="flex:1">
        <div style="font-size:0.78rem;font-weight:600;color:var(--text-muted);margin-bottom:8px">TEACHES</div>
        <div class="skill-tags-list">${u.teach.map(s=>`<span class="skill-tag teach">${s}</span>`).join('')}</div>
      </div>
      <div style="flex:1">
        <div style="font-size:0.78rem;font-weight:600;color:var(--text-muted);margin-bottom:8px">LEARNS</div>
        <div class="skill-tags-list">${u.learn.map(s=>`<span class="skill-tag learn">${s}</span>`).join('')}</div>
      </div>
    </div>
    ${u.bio ? `<p style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:20px">${u.bio}</p>` : ''}
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" style="flex:1" onclick="startChat('${u.id}')">&#x1F4AC; Message</button>
      <button class="btn btn-secondary" style="flex:1" onclick="openScheduleModal('${u.id}')">&#x1F4C5; Schedule</button>
    </div>
  `);
};

window.startChat = function(userId) {
  closeModal();
  window._hubTab = 'chat';
  navigateTo('hub', document.getElementById('nav-hub'));
  setTimeout(() => {
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) chatPanel.innerHTML = renderChatPanel(userId);
    document.querySelectorAll('.conversation-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('onclick')?.includes(userId));
    });
    const msgs = document.getElementById('chat-messages-' + userId);
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 100);
};

// --- MESSAGING ---------------------------------------------------------------
window.openConvo = function(userId) {
  const chatPanel = document.getElementById('chat-panel');
  if (chatPanel) chatPanel.innerHTML = renderChatPanel(userId);
  document.querySelectorAll('.conversation-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick') === "openConvo('"+userId+"')");
  });
  setTimeout(() => {
    const msgs = document.getElementById('chat-messages-'+userId);
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
};

window.sendMsg = function(toId) {
  const inp = document.getElementById('chat-input-'+toId);
  const text = inp?.value.trim();
  if (!text) return;
  store.sendMessage(toId, text);
  inp.value = '';
  // Re-append message to chat
  const msgs = document.getElementById('chat-messages-'+toId);
  if (msgs) {
    const myId = store.currentUser.id;
    const div = document.createElement('div');
    div.className = 'message sent';
    div.innerHTML = `<div class="message-bubble">${text}</div><div class="message-time">${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
};

// --- SCHEDULER ---------------------------------------------------------------
window.openScheduleModal = function(userId) {
  closeModal();
  const u = store.currentUser;
  const others = store.getUsers().filter(x => x.id !== u.id);
  const today = new Date().toISOString().split('T')[0];
  openModal(`
    <h3 style="margin-bottom:20px;font-family:'Space Grotesk',sans-serif">Schedule a Session</h3>
    <div class="form-group">
      <label class="form-label">Partner</label>
      <select class="filter-select w-full" id="sched-partner" style="padding:12px 16px">
        <option value="">Select partner...</option>
        ${others.map(x=>`<option value="${x.id}" ${x.id===userId?'selected':''}>${x.firstName} ${x.lastName}</option>`).join('')}
      </select>
    </div>
    <div class="form-group" style="margin-top:14px">
      <label class="form-label">Skill / Topic</label>
      <input class="form-input" type="text" id="sched-skill" placeholder="e.g. React Hooks" />
    </div>
    <div class="form-row" style="margin-top:14px">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-input" type="date" id="sched-date" min="${today}" value="${today}" />
      </div>
      <div class="form-group">
        <label class="form-label">Time</label>
        <input class="form-input" type="time" id="sched-time" value="18:00" />
      </div>
    </div>
    <div class="form-group" style="margin-top:14px">
      <label class="form-label">Notes (optional)</label>
      <input class="form-input" type="text" id="sched-notes" placeholder="Virtual call, video link..." />
    </div>
    <button class="btn btn-primary w-full" style="margin-top:16px" onclick="confirmSchedule()">Confirm Session</button>
  `);
};

window.confirmSchedule = function() {
  const partnerId = document.getElementById('sched-partner')?.value;
  const skill     = document.getElementById('sched-skill')?.value.trim();
  const date      = document.getElementById('sched-date')?.value;
  const timeVal   = document.getElementById('sched-time')?.value;
  const notes     = document.getElementById('sched-notes')?.value.trim();
  if (!partnerId || !skill || !date || !timeVal) return showToast('Please fill all required fields.', 'error');
  store.addMeeting({
    participants: [store.currentUser.id, partnerId],
    skill, date,
    time: timeVal,
    notes: notes || '',
    status: 'upcoming'
  });
  closeModal();
  showToast('Session scheduled!', 'success');
};

// --- HUB TABS ----------------------------------------------------------------
window.switchHubTab = function(tab) {
  window._hubTab = tab;
  navigateTo('hub', document.getElementById('nav-hub'));
};

// --- FEEDBACK ----------------------------------------------------------------
window.setRating = function(n) {
  window._currentRating = n;
  for (let i=1;i<=5;i++) {
    const s = document.getElementById('star-'+i);
    if (s) s.classList.toggle('active', i<=n);
  }
};

window.submitFeedback = function() {
  const toId   = document.getElementById('rate-user')?.value;
  const skill  = document.getElementById('rate-skill')?.value.trim();
  const rating = window._currentRating || 0;
  const comment= document.getElementById('rate-comment')?.value.trim();
  if (!toId)    return showToast('Please select a partner.', 'error');
  if (!skill)   return showToast('Please enter the skill.', 'error');
  if (!rating)  return showToast('Please select a rating.', 'error');
  if (!comment) return showToast('Please write a review.', 'error');
  store.addFeedback(toId, skill, rating, comment);
  showToast('Feedback submitted! Credibility updated.', 'success');
  renderFeedback();
};

// --- BENCHMARK ---------------------------------------------------------------
window.runBenchmark = runBenchmark;

// --- MODAL -------------------------------------------------------------------
window.openModal = function(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.remove('hidden');
};

window.closeModal = function() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-body').innerHTML = '';
};

// --- TOAST -------------------------------------------------------------------
window.showToast = function(msg, type) {
  type = type || 'info';
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(30px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 310); }, 3200);
};

// â”€â”€â”€ THEME TOGGLE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.toggleTheme = function() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
};

function updateThemeIcon(isLight) {
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isLight ? 'â˜¾' : 'â˜¼';
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isLight = saved === 'light' || (!saved && prefersLight);
  if (isLight) {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
  }
}
initTheme();
