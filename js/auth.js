/**
 * auth.js — Authentication: login, register, session, role redirect
 * Smart EPN Workshop Management Dashboard
 */

// ── Constants ──────────────────────────────────────────────────────────────────
const USERS_KEY = 'epn_users';
const SESSION_KEY = 'epn_current_user';
const SEEDED_KEY = 'epn_seeded';

const ROLE_MAP = {
  supervisor: 'dashboard-supervisor.html',
  lecturer:   'dashboard-lecturer.html',
  student:    'dashboard-student.html',
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Seed demo accounts if not already done
function ensureDemoAccounts() {
  if (localStorage.getItem(SEEDED_KEY) === 'true') return;
  const demo = [
    { id: 'USR-001', name: 'Ahmad Zulkifli bin Hassan',   staffStudentId: 'PK-SUP-001', email: 'supervisor@epn.edu.my', password: 'Supervisor@2026', role: 'supervisor', createdAt: '01/01/2026' },
    { id: 'USR-002', name: 'Siti Rahimah binti Sahari',   staffStudentId: 'PK-LEC-001', email: 'lecturer@epn.edu.my',   password: 'Lecturer@2026',   role: 'lecturer',   createdAt: '01/01/2026' },
    { id: 'USR-003', name: 'Muhammad Hafiz bin Rosli',     staffStudentId: '23DET-001',  email: 'student@epn.edu.my',    password: 'Student@2026',    role: 'student',    createdAt: '01/01/2026' },
    { id: 'USR-004', name: 'Nurul Ain binti Samsudin',    staffStudentId: 'PK-LEC-002', email: 'lecturer2@epn.edu.my',  password: 'Lecturer@2026',   role: 'lecturer',   createdAt: '01/01/2026' },
    { id: 'USR-005', name: 'Farah Nabilah binti Azman',   staffStudentId: '23DET-002',  email: 'student2@epn.edu.my',   password: 'Student@2026',    role: 'student',    createdAt: '01/01/2026' },
  ];
  saveUsers(demo);
  // data.js will set SEEDED after loading all other seed data
}

// ── Tab Toggle ─────────────────────────────────────────────────────────────────
function showTab(tab) {
  document.getElementById('form-login').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('form-register').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  clearMessages();
}

function clearMessages() {
  document.querySelectorAll('.global-msg').forEach(el => { el.className = 'global-msg'; el.textContent = ''; });
  document.querySelectorAll('.form-error').forEach(el => el.classList.remove('show'));
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'global-msg show ' + type;
}

function showFieldError(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
}

// ── Login ──────────────────────────────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  clearMessages();

  const email    = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  let valid = true;
  if (!email)    { showFieldError('login-email-err', 'Email is required.'); valid = false; }
  if (!password) { showFieldError('login-password-err', 'Password is required.'); valid = false; }
  if (!valid) return;

  const users = getUsers();
  const user  = users.find(u => u.email.toLowerCase() === email && u.password === password);

  if (!user) {
    showMsg('login-msg', 'Invalid email or password. Please check your credentials.', 'error');
    return;
  }

  saveSession({ id: user.id, name: user.name, email: user.email, role: user.role, staffStudentId: user.staffStudentId });
  window.location.href = ROLE_MAP[user.role] || 'index.html';
}

// ── Register ───────────────────────────────────────────────────────────────────
function handleRegister(e) {
  e.preventDefault();
  clearMessages();

  const name     = document.getElementById('reg-name').value.trim();
  const idNo     = document.getElementById('reg-id').value.trim();
  const email    = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;
  const confirm  = document.getElementById('reg-confirm').value;
  const role     = document.getElementById('reg-role').value;

  let valid = true;
  if (!name)    { showFieldError('reg-name-err', 'Full name is required.'); valid = false; }
  if (!idNo)    { showFieldError('reg-id-err', 'Staff / Student ID is required.'); valid = false; }
  if (!email)   { showFieldError('reg-email-err', 'Email is required.'); valid = false; }
  if (password.length < 8) { showFieldError('reg-password-err', 'Password must be at least 8 characters.'); valid = false; }
  if (password !== confirm) { showFieldError('reg-confirm-err', 'Passwords do not match.'); valid = false; }
  if (!role)    { showFieldError('reg-role-err', 'Please select a role.'); valid = false; }
  if (!valid) return;

  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email)) {
    showMsg('reg-msg', 'An account with this email already exists.', 'error');
    return;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');

  const newUser = {
    id: 'USR-' + Date.now(),
    name, staffStudentId: idNo, email, password, role,
    createdAt: dateStr
  };
  users.push(newUser);
  saveUsers(users);

  showMsg('reg-msg', 'Account created successfully! You can now log in.', 'success');
  document.getElementById('form-register').reset();
  setTimeout(() => showTab('login'), 1500);
}

// ── Logout ─────────────────────────────────────────────────────────────────────
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

// ── Fill Demo Credentials ──────────────────────────────────────────────────────
function fillDemo(role) {
  const creds = {
    supervisor: { email: 'supervisor@epn.edu.my', password: 'Supervisor@2026' },
    lecturer:   { email: 'lecturer@epn.edu.my',   password: 'Lecturer@2026'   },
    student:    { email: 'student@epn.edu.my',     password: 'Student@2026'    },
  };
  const c = creds[role];
  if (!c) return;
  document.getElementById('login-email').value    = c.email;
  document.getElementById('login-password').value = c.password;
  showTab('login');
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ensureDemoAccounts();

  // If already logged in, redirect
  const session = getSession();
  if (session && ROLE_MAP[session.role]) {
    window.location.href = ROLE_MAP[session.role];
    return;
  }

  // Tab buttons
  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  // Forms
  const loginForm = document.getElementById('form-login');
  const regForm   = document.getElementById('form-register');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (regForm)   regForm.addEventListener('submit', handleRegister);

  // Show login tab by default
  showTab('login');
});
