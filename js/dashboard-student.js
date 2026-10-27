/**
 * dashboard-student.js — Student Dashboard Logic
 * Smart EPN Workshop Management Dashboard
 */

const user = requireAuth('student');
if (!user) throw new Error('Not authenticated');

let currentSection = 'overview';
let isBM = localStorage.getItem(KEYS.LANG) === 'bm';

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLang();
  document.getElementById('user-name').textContent = user.name.split(' ')[0];
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
  renderOverview();
});

// ── Theme & Lang ───────────────────────────────────────────────────────────────
function applyTheme() {
  const theme = localStorage.getItem(KEYS.THEME) || 'light';
  document.body.setAttribute('data-theme', theme);
  document.getElementById('theme-btn').textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}
function toggleTheme() {
  const c = localStorage.getItem(KEYS.THEME) || 'light';
  localStorage.setItem(KEYS.THEME, c === 'dark' ? 'light' : 'dark');
  applyTheme();
}
function applyLang() {
  isBM = localStorage.getItem(KEYS.LANG) === 'bm';
  document.getElementById('lang-btn').textContent = isBM ? '🌐 EN' : '🌐 BM';
}
function toggleLang() {
  isBM = !isBM;
  localStorage.setItem(KEYS.LANG, isBM ? 'bm' : 'en');
  applyLang();
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

// ── Section Nav ────────────────────────────────────────────────────────────────
function showSection(name, linkEl) {
  document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById('section-' + name);
  if (sec) sec.style.display = 'block';
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  currentSection = name;
  const titles = { overview: 'Dashboard Overview', borrow: 'Borrow Tools', transactions: 'My Transactions', profile: 'My Profile' };
  const titlesBM = { overview: 'Ringkasan', borrow: 'Pinjam Alatan', transactions: 'Transaksi Saya', profile: 'Profil Saya' };
  document.getElementById('page-title').textContent = (isBM ? titlesBM : titles)[name] || name;
  closeSidebar();
  renderSection(name);
}

function renderSection(name) {
  switch (name) {
    case 'overview':     renderOverview(); break;
    case 'borrow':       renderBorrowSection(); break;
    case 'transactions': renderAllTransactions(); break;
    case 'profile':      renderProfile(); break;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function myTransactions() {
  return getTransactions().filter(t =>
    t.studentId === user.id || t.studentName === user.name
  );
}

function hasOverdue() {
  return myTransactions().some(t => t.status === 'Overdue');
}

function badge(status) {
  const map = {
    'Borrowed':'badge-borrowed','Returned':'badge-returned','Overdue':'badge-overdue',
    'Damaged':'badge-damaged','Missing':'badge-missing','Requested':'badge-requested',
    'Pending':'badge-pending','Safe':'badge-safe',
  };
  return `<span class="badge ${map[status]||'badge-pending'}">${status}</span>`;
}

// ── Overview ───────────────────────────────────────────────────────────────────
function renderOverview() {
  const txns = myTransactions();

  const overdueBanner = document.getElementById('overdue-banner');
  if (hasOverdue()) {
    overdueBanner.style.display = 'flex';
  } else {
    overdueBanner.style.display = 'none';
  }

  const borrowed  = txns.filter(t => t.status === 'Borrowed').length;
  const overdue   = txns.filter(t => t.status === 'Overdue').length;
  const requested = txns.filter(t => t.status === 'Requested').length;

  const cards = [
    { icon: '🔧', label: isBM ? 'Alatan Dipinjam' : 'Tools I Currently Have',  value: borrowed,  accent: '#3b82d4', sub: isBM ? 'sedang dalam pinjaman' : 'currently on loan' },
    { icon: '⚠️', label: isBM ? 'Item Tertunggak' : 'My Overdue Items',       value: overdue,   accent: '#dc2626', sub: isBM ? 'perlu dipulangkan segera' : 'must be returned immediately', alert: overdue > 0 },
    { icon: '⏳', label: isBM ? 'Permohonan Belum Diluluskan' : 'My Pending Requests', value: requested, accent: '#d97706', sub: isBM ? 'menunggu kelulusan' : 'awaiting lecturer approval' },
  ];

  document.getElementById('stu-cards').innerHTML = cards.map(c => `
    <div class="summary-card ${c.alert ? 'card-alert' : ''}" style="--card-accent:${c.accent}">
      <div class="card-icon-lg">${c.icon}</div>
      <div class="card-label">${c.label}</div>
      <div class="card-value">${c.value}</div>
      <div class="card-sub">${c.sub}</div>
    </div>`).join('');

  // Recent transactions
  const tbody = document.getElementById('stu-recent-tbody');
  const recent = txns.slice(0, 5);
  tbody.innerHTML = recent.length ? recent.map(t => `<tr class="${['Overdue'].includes(t.status)?'row-overdue':''}">
    <td>${t.id}</td><td>${t.toolName}</td><td>${t.qty}</td>
    <td>${t.borrowDate}</td><td>${t.expectedReturn}</td>
    <td>${badge(t.status)}</td>
  </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:1rem">No transactions yet.</td></tr>';
}

// ── Borrow Section ─────────────────────────────────────────────────────────────
function renderBorrowSection() {
  const blockedDiv = document.getElementById('overdue-block');
  const submitBtn  = document.getElementById('borrow-submit-btn');

  if (hasOverdue()) {
    blockedDiv.style.display = 'flex';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
  } else {
    blockedDiv.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
  }

  // Populate tool dropdown (available only)
  const toolSel = document.getElementById('s-tool');
  const available = getTools().filter(t => t.availableQty > 0);
  toolSel.innerHTML = available.length
    ? available.map(t => `<option value="${t.id}">${t.name} (Available: ${t.availableQty})</option>`).join('')
    : '<option value="">No tools available</option>';

  // Populate lecturer dropdown
  const lecSel = document.getElementById('s-lecturer');
  const lecturers = getData(KEYS.USERS).filter(u => u.role === 'lecturer');
  lecSel.innerHTML = lecturers.map(l => `<option value="${l.id}">${l.name}</option>`).join('');

  // Available tools table
  const tbody = document.getElementById('stu-avail-tools');
  tbody.innerHTML = available.map(t => `<tr>
    <td>${t.assetId}</td><td>${t.name}</td><td>${t.category}</td>
    <td><strong>${t.availableQty}</strong></td><td>${t.condition}</td>
  </tr>`).join('');
}

function submitBorrowReq() {
  if (hasOverdue()) { return; }

  const toolId  = document.getElementById('s-tool').value;
  const qty     = parseInt(document.getElementById('s-qty').value) || 1;
  const date    = document.getElementById('s-date').value.trim();
  const retdate = document.getElementById('s-retdate').value.trim();
  const time    = document.getElementById('s-time').value.trim();
  const rettime = document.getElementById('s-rettime').value.trim();
  const lecId   = document.getElementById('s-lecturer').value;
  const remarks = document.getElementById('s-remarks').value.trim();

  const msg = document.getElementById('borrow-msg');

  if (!toolId || !date) {
    msg.textContent = 'Please select a tool and enter the borrow date.';
    msg.className = 'global-msg show error'; return;
  }

  const tool = getTools().find(t => t.id === toolId);
  if (!tool || tool.availableQty < qty) {
    msg.textContent = 'Requested quantity exceeds available stock.';
    msg.className = 'global-msg show error'; return;
  }

  const lecturers = getData(KEYS.USERS).filter(u => u.role === 'lecturer');
  const lecturer  = lecturers.find(l => l.id === lecId) || { name: 'Lecturer', id: lecId };

  const txn = {
    id: generateId('TXN'), studentId: user.id, studentName: user.name,
    studentRegNo: user.staffStudentId || '', class: '', course: '',
    lecturerId: lecturer.id, lecturerName: lecturer.name,
    toolId, toolName: tool.name, assetId: tool.assetId,
    qty, borrowDate: date, borrowTime: time,
    expectedReturn: retdate, expectedReturnTime: rettime,
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Requested', remarks
  };

  addTransaction(txn);
  logActivity(user.id, user.name, user.role, 'Borrow Request Submitted', `${txn.id} — ${tool.name} x${qty}`);

  msg.textContent = `Request submitted successfully! Status: Requested (pending lecturer approval). Txn ID: ${txn.id}`;
  msg.className = 'global-msg show success';
  setTimeout(() => msg.className = 'global-msg', 4000);

  // Reset form
  document.getElementById('s-qty').value = 1;
  document.getElementById('s-date').value = '';
  document.getElementById('s-retdate').value = '';
  document.getElementById('s-time').value = '';
  document.getElementById('s-rettime').value = '';
  document.getElementById('s-remarks').value = '';

  renderBorrowSection();
}

// ── All Transactions ───────────────────────────────────────────────────────────
function renderAllTransactions(txns) {
  txns = txns || myTransactions();
  const tbody = document.getElementById('stu-txn-tbody');
  tbody.innerHTML = txns.length ? txns.map(t => `<tr class="${['Overdue','Damaged','Missing'].includes(t.status)?'row-overdue':''}">
    <td>${t.id}</td><td>${t.toolName}</td><td>${t.qty}</td>
    <td>${t.borrowDate} ${t.borrowTime}</td>
    <td>${t.expectedReturn} ${t.expectedReturnTime}</td>
    <td>${t.actualReturn || '—'}</td>
    <td>${t.conditionBefore}</td>
    <td>${badge(t.status)}</td>
    <td>${t.remarks || '—'}</td>
  </tr>`).join('') : '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:1rem">No transactions yet.</td></tr>';
}

function filterStuTxns() {
  const q = document.getElementById('stu-txn-search').value.toLowerCase();
  renderAllTransactions(myTransactions().filter(t => t.toolName.toLowerCase().includes(q)));
}

// ── Profile ────────────────────────────────────────────────────────────────────
function renderProfile() {
  document.getElementById('profile-info').innerHTML = `
    <div style="display:grid;grid-template-columns:max-content 1fr;gap:0.4rem 1.5rem;font-size:0.9rem;margin-bottom:0.5rem">
      <span style="color:var(--muted);font-weight:600">Name</span>         <span>${user.name}</span>
      <span style="color:var(--muted);font-weight:600">Email</span>        <span>${user.email}</span>
      <span style="color:var(--muted);font-weight:600">Student ID</span>   <span>${user.staffStudentId || '—'}</span>
      <span style="color:var(--muted);font-weight:600">Role</span>         <span><span class="badge badge-student">Student</span></span>
    </div>`;
}

function changePassword() {
  const current = document.getElementById('pwd-current').value;
  const newPwd  = document.getElementById('pwd-new').value;
  const confirm = document.getElementById('pwd-confirm').value;
  const msg     = document.getElementById('pwd-msg');

  if (!current || !newPwd || !confirm) {
    msg.textContent = 'Please fill in all password fields.';
    msg.className = 'global-msg show error'; return;
  }
  if (newPwd.length < 8) {
    msg.textContent = 'New password must be at least 8 characters.';
    msg.className = 'global-msg show error'; return;
  }
  if (newPwd !== confirm) {
    msg.textContent = 'New passwords do not match.';
    msg.className = 'global-msg show error'; return;
  }

  const users = getData(KEYS.USERS);
  const idx   = users.findIndex(u => u.id === user.id);
  if (idx === -1 || users[idx].password !== current) {
    msg.textContent = 'Current password is incorrect.';
    msg.className = 'global-msg show error'; return;
  }

  users[idx].password = newPwd;
  setData(KEYS.USERS, users);
  logActivity(user.id, user.name, user.role, 'Password Changed', 'User updated their password');
  msg.textContent = 'Password updated successfully!';
  msg.className = 'global-msg show success';
  document.getElementById('pwd-current').value = '';
  document.getElementById('pwd-new').value = '';
  document.getElementById('pwd-confirm').value = '';
  setTimeout(() => msg.className = 'global-msg', 3000);
}
