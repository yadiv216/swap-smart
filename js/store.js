/**
 * SMARTSWAP — IN-MEMORY DATA STORE
 * Simulates a database using localStorage + JS objects.
 * In production this would connect to Firebase Firestore.
 */

// ─── SEED DATA ─────────────────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'u1', email: 'demo@smartswap.io', password: 'demo1234',
    firstName: 'Alex', lastName: 'Johnson', location: 'New York, USA',
    bio: 'Full-stack developer and music enthusiast. Love swapping tech skills for creative ones!',
    teach: ['JavaScript', 'React', 'Node.js', 'System Design'],
    learn: ['Guitar', 'Painting', 'Spanish', 'Photography'],
    credibilityScore: 87, ratingsCount: 23, avgRating: 4.7,
    joinDate: '2024-01-15', sessions: 23,
  },
  {
    id: 'u2', email: 'maya@example.com', password: 'pass1234',
    firstName: 'Maya', lastName: 'Patel', location: 'Austin, TX',
    bio: 'UX designer with a passion for language learning and yoga.',
    teach: ['UI/UX Design', 'Figma', 'Spanish', 'Yoga'],
    learn: ['Python', 'Machine Learning', 'Data Science'],
    credibilityScore: 92, ratingsCount: 31, avgRating: 4.9,
    joinDate: '2024-02-10', sessions: 31,
  },
  {
    id: 'u3', email: 'carlos@example.com', password: 'pass1234',
    firstName: 'Carlos', lastName: 'Rodriguez', location: 'Miami, FL',
    bio: 'Music producer and guitarist. Can teach theory, rhythm, and recording.',
    teach: ['Guitar', 'Music Theory', 'Audio Production', 'Piano'],
    learn: ['Blockchain', 'JavaScript', 'React'],
    credibilityScore: 78, ratingsCount: 15, avgRating: 4.5,
    joinDate: '2024-03-05', sessions: 15,
  },
  {
    id: 'u4', email: 'priya@example.com', password: 'pass1234',
    firstName: 'Priya', lastName: 'Kumar', location: 'San Francisco, CA',
    bio: 'Data scientist specializing in ML and AI. Passionate about photography.',
    teach: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    learn: ['Guitar', 'Yoga', 'French', 'Photography'],
    credibilityScore: 95, ratingsCount: 42, avgRating: 4.8,
    joinDate: '2024-01-28', sessions: 42,
  },
  {
    id: 'u5', email: 'james@example.com', password: 'pass1234',
    firstName: 'James', lastName: 'Chen', location: 'Seattle, WA',
    bio: 'Blockchain engineer and amateur chef. Passionate about decentralized tech.',
    teach: ['Blockchain', 'Solidity', 'Web3', 'Cooking'],
    learn: ['Piano', 'Spanish', 'Photography'],
    credibilityScore: 83, ratingsCount: 18, avgRating: 4.6,
    joinDate: '2024-02-20', sessions: 18,
  },
  {
    id: 'u6', email: 'sarah@example.com', password: 'pass1234',
    firstName: 'Sarah', lastName: 'Kim', location: 'Chicago, IL',
    bio: 'Professional photographer and French teacher. Love traveling.',
    teach: ['Photography', 'French', 'Travel Planning', 'Lightroom'],
    learn: ['React', 'Node.js', 'Machine Learning'],
    credibilityScore: 89, ratingsCount: 27, avgRating: 4.7,
    joinDate: '2024-03-12', sessions: 27,
  },
  {
    id: 'u7', email: 'omar@example.com', password: 'pass1234',
    firstName: 'Omar', lastName: 'Hassan', location: 'London, UK',
    bio: 'Yoga instructor and mindfulness coach. Also into sustainable living.',
    teach: ['Yoga', 'Meditation', 'Nutrition', 'Arabic'],
    learn: ['Data Science', 'Python', 'Financial Planning'],
    credibilityScore: 81, ratingsCount: 19, avgRating: 4.4,
    joinDate: '2024-04-01', sessions: 19,
  },
  {
    id: 'u8', email: 'lena@example.com', password: 'pass1234',
    firstName: 'Lena', lastName: 'Mueller', location: 'Berlin, Germany',
    bio: 'Financial analyst and hobby painter. Enjoys teaching budgeting strategies.',
    teach: ['Financial Planning', 'Excel', 'Painting', 'German'],
    learn: ['UI/UX Design', 'Figma', 'Photography'],
    credibilityScore: 76, ratingsCount: 12, avgRating: 4.3,
    joinDate: '2024-05-15', sessions: 12,
  },
];

const SEED_MESSAGES = {
  'u1-u2': [
    { from: 'u2', text: 'Hi Alex! I saw you can teach React. I\'d love to swap for Spanish lessons!', time: '10:03 AM' },
    { from: 'u1', text: 'Hey Maya! That sounds like a great swap! When are you free this week?', time: '10:15 AM' },
    { from: 'u2', text: 'How about Wednesday evening, 7 PM?', time: '10:18 AM' },
    { from: 'u1', text: 'Perfect! I\'ll set up a Google Meet link. 👍', time: '10:21 AM' },
  ],
  'u1-u3': [
    { from: 'u1', text: 'Carlos! Your guitar sessions look amazing. I can offer React coaching.', time: '2:00 PM' },
    { from: 'u3', text: 'Awesome! I\'ve always wanted to learn React. Let\'s do this!', time: '2:12 PM' },
  ],
  'u1-u4': [
    { from: 'u4', text: 'Hello! I\'m looking to learn JavaScript. You free for a intro session?', time: '9:05 AM' },
    { from: 'u1', text: 'Sure! I can teach you JS fundamentals. In exchange for Python basics?', time: '9:30 AM' },
    { from: 'u4', text: 'Deal! I love that idea.', time: '9:33 AM' },
  ],
};

const SEED_MEETINGS = [
  { id: 'm1', participants: ['u1','u2'], skill: 'React / Spanish', date: '2026-04-04', time: '7:00 PM', status: 'upcoming', notes: 'Virtual via Google Meet' },
  { id: 'm2', participants: ['u1','u3'], skill: 'React / Guitar', date: '2026-04-07', time: '5:00 PM', status: 'upcoming', notes: 'First session — intro to guitar chords' },
  { id: 'm3', participants: ['u1','u4'], skill: 'JavaScript / Python', date: '2026-03-25', time: '9:00 AM', status: 'completed', notes: 'Session went great!' },
];

const SEED_FEEDBACK = [
  { id: 'f1', from: 'u2', to: 'u1', skill: 'React', rating: 5, comment: 'Alex is an amazing teacher! Very patient and clear explanations.', date: '2026-03-26' },
  { id: 'f2', from: 'u4', to: 'u1', skill: 'JavaScript', rating: 4, comment: 'Great session. Learned a lot about closures and async/await.', date: '2026-03-26' },
  { id: 'f3', from: 'u1', to: 'u2', skill: 'Spanish', rating: 5, comment: 'Maya made Spanish fun! Can\'t wait for the next lesson.', date: '2026-03-26' },
  { id: 'f4', from: 'u1', to: 'u4', skill: 'Python', rating: 5, comment: 'Priya is incredibly knowledgeable. Perfect swap!', date: '2026-03-26' },
];

// ─── STORE ─────────────────────────────────────────────────────────────────
class Store {
  constructor() {
    this._users = [];
    this._messages = {};
    this._meetings = [];
    this._feedback = [];
    this._currentUser = null;
    this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem('smartswap_store');
      if (saved) {
        const data = JSON.parse(saved);
        this._users    = data.users    || SEED_USERS;
        this._messages = data.messages || SEED_MESSAGES;
        this._meetings = data.meetings || SEED_MEETINGS;
        this._feedback = data.feedback || SEED_FEEDBACK;
      } else {
        this._users    = [...SEED_USERS];
        this._messages = { ...SEED_MESSAGES };
        this._meetings = [...SEED_MEETINGS];
        this._feedback = [...SEED_FEEDBACK];
      }
      const uid = localStorage.getItem('smartswap_uid');
      if (uid) this._currentUser = this._users.find(u => u.id === uid) || null;
    } catch { this._resetToSeed(); }
  }

  _resetToSeed() {
    this._users    = [...SEED_USERS];
    this._messages = { ...SEED_MESSAGES };
    this._meetings = [...SEED_MEETINGS];
    this._feedback = [...SEED_FEEDBACK];
  }

  _save() {
    localStorage.setItem('smartswap_store', JSON.stringify({
      users: this._users,
      messages: this._messages,
      meetings: this._meetings,
      feedback: this._feedback,
    }));
  }

  // ── AUTH ──
  login(email, password) {
    const user = this._users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    this._currentUser = user;
    localStorage.setItem('smartswap_uid', user.id);
    return { ...user, password: undefined };
  }

  signup(firstName, lastName, email, password, location) {
    if (this._users.find(u => u.email === email)) throw new Error('Email already registered');
    const id = 'u' + Date.now();
    const newUser = {
      id, email, password, firstName, lastName,
      location: location || 'Unknown',
      bio: '',
      teach: [], learn: [],
      credibilityScore: 50, ratingsCount: 0, avgRating: 0,
      joinDate: new Date().toISOString().split('T')[0],
      sessions: 0,
    };
    this._users.push(newUser);
    this._currentUser = newUser;
    localStorage.setItem('smartswap_uid', id);
    this._save();
    return { ...newUser, password: undefined };
  }

  logout() {
    this._currentUser = null;
    localStorage.removeItem('smartswap_uid');
  }

  get currentUser() { return this._currentUser; }

  // ── USERS ──
  getUsers() { return this._users.map(u => ({ ...u, password: undefined })); }
  getUserById(id) {
    const u = this._users.find(u => u.id === id);
    return u ? { ...u, password: undefined } : null;
  }
  updateCurrentUser(fields) {
    const idx = this._users.findIndex(u => u.id === this._currentUser.id);
    if (idx < 0) throw new Error('User not found');
    this._users[idx] = { ...this._users[idx], ...fields };
    this._currentUser = this._users[idx];
    this._save();
    return { ...this._currentUser, password: undefined };
  }

  addSkill(type, skill) {
    const idx = this._users.findIndex(u => u.id === this._currentUser.id);
    if (idx < 0) return;
    const list = [...this._users[idx][type]];
    if (!list.includes(skill)) {
      list.push(skill);
      this._users[idx][type] = list;
      this._currentUser = this._users[idx];
      this._save();
    }
  }
  removeSkill(type, skill) {
    const idx = this._users.findIndex(u => u.id === this._currentUser.id);
    if (idx < 0) return;
    this._users[idx][type] = this._users[idx][type].filter(s => s !== skill);
    this._currentUser = this._users[idx];
    this._save();
  }

  // ── SEARCH ──
  searchSkills(query, filters = {}) {
    return this._users
      .filter(u => u.id !== (this._currentUser?.id))
      .filter(u => {
        const q = query.toLowerCase();
        const matchQuery = !q
          || u.teach.some(s => s.toLowerCase().includes(q))
          || u.learn.some(s => s.toLowerCase().includes(q))
          || `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
          || (u.location || '').toLowerCase().includes(q);
        const matchRating = !filters.minRating || u.avgRating >= parseFloat(filters.minRating);
        const matchLocation = !filters.location || (u.location||'').toLowerCase().includes(filters.location.toLowerCase());
        return matchQuery && matchRating && matchLocation;
      })
      .map(u => ({ ...u, password: undefined }));
  }

  // ── MESSAGES ──
  getConvoKey(a, b) {
    return [a, b].sort().join('-');
  }
  getMessages(otherId) {
    const key = this.getConvoKey(this._currentUser.id, otherId);
    return this._messages[key] || [];
  }
  sendMessage(toId, text) {
    const key = this.getConvoKey(this._currentUser.id, toId);
    if (!this._messages[key]) this._messages[key] = [];
    const msg = {
      from: this._currentUser.id,
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    this._messages[key].push(msg);
    this._save();
    return msg;
  }
  getConversations() {
    const myId = this._currentUser?.id;
    const convos = [];
    for (const key of Object.keys(this._messages)) {
      const [a, b] = key.split('-');
      const other = a === myId ? b : b === myId ? a : null;
      if (!other) continue;
      const user = this.getUserById(other);
      if (!user) continue;
      const msgs = this._messages[key];
      convos.push({ user, lastMsg: msgs[msgs.length - 1]?.text || '', key });
    }
    return convos;
  }

  // ── MEETINGS ──
  getMeetings() {
    const uid = this._currentUser?.id;
    return this._meetings.filter(m => m.participants.includes(uid));
  }
  addMeeting(meeting) {
    const m = { id: 'm' + Date.now(), ...meeting };
    this._meetings.push(m);
    this._save();
    return m;
  }

  // ── FEEDBACK ──
  getFeedback(userId) {
    return this._feedback.filter(f => f.to === userId);
  }
  addFeedback(toId, skill, rating, comment) {
    const f = {
      id: 'f' + Date.now(),
      from: this._currentUser.id,
      to: toId,
      skill, rating, comment,
      date: new Date().toISOString().split('T')[0],
    };
    this._feedback.push(f);
    // Update target user's credibility score
    const idx = this._users.findIndex(u => u.id === toId);
    if (idx >= 0) {
      const u = this._users[idx];
      const newCount = u.ratingsCount + 1;
      const newAvg = ((u.avgRating * u.ratingsCount) + rating) / newCount;
      const newCred = Math.min(100, Math.round((newAvg / 5) * 100 * 0.7 + (Math.min(newCount, 50) / 50) * 30));
      this._users[idx] = { ...u, ratingsCount: newCount, avgRating: newAvg, credibilityScore: newCred };
    }
    this._save();
    return f;
  }
}

export const store = new Store();
