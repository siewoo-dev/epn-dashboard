/**
 * dashboard-supervisor.js — Supervisor Dashboard Logic
 * Smart EPN Workshop Management Dashboard
 */

// ── Session Guard ──────────────────────────────────────────────────────────────
const user = requireAuth('supervisor');
if (!user) throw new Error('Not authenticated');

// ── State ──────────────────────────────────────────────────────────────────────
let currentSection = 'overview';
let isBM = localStorage.getItem(KEYS.LANG) === 'bm';

// ── BM / EN Labels ─────────────────────────────────────────────────────────────
const T = {
  en: {
    overview: 'Dashboard Overview', tools: 'Tool Borrowing', materials: 'Materials',
    bookings: 'Workshop Bookings', usage: 'Workshop Usage',
    maintenance: 'Maintenance', safety: 'Safety Inspections',
    reports: 'Reports', actlog: 'Activity Log', users: 'Users',
    totalTools: 'Total Tools', toolsBorrowed: 'Tools Borrowed',
    toolsAlert: 'Overdue / Damaged / Missing', matTypes: 'Material Types',
    matLow: 'Low Stock Items', sessions: 'Sessions This Month',
    maintPending: 'Maintenance Pending', inspDue: 'Inspections Due',
  },
  bm: {
    overview: 'Ringkasan Dashboard', tools: 'Pinjaman Alatan', materials: 'Bahan',
    bookings: 'Tempahan Bengkel', usage: 'Penggunaan Bengkel',
    maintenance: 'Penyelenggaraan', safety: 'Pemeriksaan Keselamatan',
    reports: 'Laporan', actlog: 'Log Aktiviti', users: 'Pengguna',
    totalTools: 'Jumlah Alatan', toolsBorrowed: 'Alatan Dipinjam',
    toolsAlert: 'Tertunggak / Rosak / Hilang', matTypes: 'Jenis Bahan',
    matLow: 'Stok Rendah', sessions: 'Sesi Bulan Ini',
    maintPending: 'Penyelenggaraan Tertunggak', inspDue: 'Pemeriksaan Perlu',
  }
};

function t(key) { return (isBM ? T.bm : T.en)[key] || key; }

// ── Init ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyLang();
  renderUserChip();
  updateNotifBadge();
  renderOverview();
});

// ── User Chip ──────────────────────────────────────────────────────────────────
function renderUserChip() {
  document.getElementById('user-name').textContent = user.name.split(' ')[0];
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
}

// ── Theme ──────────────────────────────────────────────────────────────────────
function applyTheme() {
  const theme = localStorage.getItem(KEYS.THEME) || 'light';
  document.body.setAttribute('data-theme', theme);
  document.getElementById('theme-btn').textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function toggleTheme() {
  const current = localStorage.getItem(KEYS.THEME) || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(KEYS.THEME, next);
  applyTheme();
}

// ── Language ───────────────────────────────────────────────────────────────────
function applyLang() {
  isBM = localStorage.getItem(KEYS.LANG) === 'bm';
  document.getElementById('lang-btn').textContent = isBM ? '🌐 EN' : '🌐 BM';
  document.getElementById('page-title').textContent = t(currentSection);
}

function toggleLang() {
  isBM = !isBM;
  localStorage.setItem(KEYS.LANG, isBM ? 'bm' : 'en');
  applyLang();
  renderCurrentSection();
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

// ── Section Navigation ─────────────────────────────────────────────────────────
function showSection(name, linkEl) {
  document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById('section-' + name);
  if (sec) sec.style.display = 'block';

  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');

  currentSection = name;
  document.getElementById('page-title').textContent = t(name);
  closeSidebar();
  renderCurrentSection();
}

function renderCurrentSection() {
  switch (currentSection) {
    case 'overview':    renderOverview(); break;
    case 'tools':       renderToolsSection(); break;
    case 'materials':   renderMaterialsSection(); break;
    case 'bookings':    renderBookingsSection(); break;
    case 'usage':       renderUsageSection(); break;
    case 'maintenance': renderMaintenanceSection(); break;
    case 'safety':      renderSafetySection(); break;
    case 'actlog':      renderActlogSection(); break;
    case 'users':       renderUsersSection(); break;
  }
}

// ── Notification Badge ─────────────────────────────────────────────────────────
function updateNotifBadge() {
  const stats = getDashboardStats();
  const count = stats.toolsOverdueDamagedMissing + stats.materialsLowStock + stats.inspectionsDue;
  document.getElementById('notif-count').textContent = count;
}

// ── Status Badge HTML ──────────────────────────────────────────────────────────
function badge(status) {
  const map = {
    'Borrowed':           'badge-borrowed',
    'Returned':           'badge-returned',
    'Overdue':            'badge-overdue',
    'Damaged':            'badge-damaged',
    'Missing':            'badge-missing',
    'Requested':          'badge-requested',
    'Partially Returned': 'badge-requested',
    'Pending':            'badge-pending',
    'Safe':               'badge-safe',
    'Attention Required': 'badge-attention',
    'Repair Required':    'badge-repair',
    'Inspection Due':     'badge-insp-due',
    'Confirmed':          'badge-confirmed',
    'Completed':          'badge-completed',
    'In Progress':        'badge-progress',
    'supervisor':         'badge-supervisor',
    'lecturer':           'badge-lecturer',
    'student':            'badge-student',
  };
  return `<span class="badge ${map[status] || 'badge-pending'}">${status}</span>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
let chartUtil = null, chartMat = null, chartBorrow = null;

function renderOverview() {
  const stats = getDashboardStats();

  // Alert banners
  const overdueCount = stats.toolsOverdueDamagedMissing;
  const lowStockCount = stats.materialsLowStock;
  const overdueBanner = document.getElementById('alert-overdue');
  const lowBanner = document.getElementById('alert-lowstock');

  if (overdueCount > 0) {
    overdueBanner.style.display = 'flex';
    document.getElementById('alert-overdue-text').textContent =
      `${overdueCount} tool transaction(s) are Overdue, Damaged or Missing. Please review the Tool Borrowing section.`;
  } else { overdueBanner.style.display = 'none'; }

  if (lowStockCount > 0) {
    lowBanner.style.display = 'flex';
    const items = checkLowStock().map(m => m.name).join(', ');
    document.getElementById('alert-lowstock-text').textContent =
      `${lowStockCount} material(s) below minimum stock level: ${items}`;
  } else { lowBanner.style.display = 'none'; }

  // Summary cards
  const cards = [
    { icon: '🔧', label: t('totalTools'),    value: stats.totalTools,                   accent: '#3b82d4', sub: 'reusable tools & equipment' },
    { icon: '📤', label: t('toolsBorrowed'), value: stats.toolsBorrowed,                accent: '#0891b2', sub: 'currently out on loan' },
    { icon: '⚠️', label: t('toolsAlert'),   value: stats.toolsOverdueDamagedMissing,   accent: '#dc2626', sub: 'require immediate attention', alert: stats.toolsOverdueDamagedMissing > 0 },
    { icon: '📦', label: t('matTypes'),      value: stats.totalMaterialTypes,            accent: '#7c3aed', sub: 'consumable material types' },
    { icon: '🔴', label: t('matLow'),        value: stats.materialsLowStock,             accent: '#ea580c', sub: 'below minimum level', warn: stats.materialsLowStock > 0 },
    { icon: '📅', label: t('sessions'),      value: stats.sessionsThisMonth,             accent: '#16a34a', sub: 'workshop sessions this month' },
    { icon: '🔨', label: t('maintPending'),  value: stats.maintenancePending,            accent: '#d97706', sub: 'pending or in progress' },
    { icon: '🛡️', label: t('inspDue'),      value: stats.inspectionsDue,               accent: '#6d28d9', sub: 'inspections required' },
  ];

  const grid = document.getElementById('summary-cards');
  grid.innerHTML = cards.map(c => `
    <div class="summary-card ${c.alert ? 'card-alert' : c.warn ? 'card-warn' : ''}" style="--card-accent:${c.accent}">
      <div class="card-icon-lg">${c.icon}</div>
      <div class="card-label">${c.label}</div>
      <div class="card-value">${c.value}</div>
      <div class="card-sub">${c.sub}</div>
    </div>
  `).join('');

  // Render charts
  renderCharts();
}

function renderCharts() {
  const isDark = localStorage.getItem(KEYS.THEME) === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#57606a';

  Chart.defaults.color = textColor;

  // Utilisation Bar Chart
  const ctxUtil = document.getElementById('chart-utilisation');
  if (chartUtil) chartUtil.destroy();
  chartUtil = new Chart(ctxUtil, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Sessions',
        data: [8, 10, 12, 9, 11, 14],
        backgroundColor: '#3b82d4cc',
        borderRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });

  // Materials Doughnut
  const ctxMat = document.getElementById('chart-materials');
  if (chartMat) chartMat.destroy();
  chartMat = new Chart(ctxMat, {
    type: 'doughnut',
    data: {
      labels: ['Electrical Cable', 'Wiring Accessory', 'Conduit & Fitting', 'Connector', 'Consumable'],
      datasets: [{
        data: [38, 25, 15, 14, 8],
        backgroundColor: ['#3b82d4','#16a34a','#d97706','#7c3aed','#0891b2'],
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 }, color: textColor } } }
    }
  });

  // Borrowing Trend Line Chart
  const ctxBorrow = document.getElementById('chart-borrowing');
  if (chartBorrow) chartBorrow.destroy();
  chartBorrow = new Chart(ctxBorrow, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Borrows',
        data: [5, 8, 7, 10, 9, 12],
        borderColor: '#3b82d4',
        backgroundColor: '#3b82d420',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#3b82d4',
      }, {
        label: 'Returns',
        data: [4, 7, 7, 8, 9, 10],
        borderColor: '#16a34a',
        backgroundColor: '#16a34a10',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#16a34a',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { boxWidth: 12, color: textColor } } },
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
        x: { grid: { display: false }, ticks: { color: textColor } }
      }
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS
// ─────────────────────────────────────────────────────────────────────────────
function renderToolsSection() {
  renderToolsTable(getTransactions());
  renderInventoryTable(getTools());
}

function renderToolsTable(txns) {
  const tbody = document.getElementById('tools-tbody');
  if (!txns.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:1.5rem">No transactions found.</td></tr>'; return; }
  tbody.innerHTML = txns.map(t => {
    const isAlert = ['Overdue','Damaged','Missing'].includes(t.status);
    return `<tr class="${isAlert ? 'row-overdue' : ''}">
      <td>${t.id}</td>
      <td>${t.studentName}<br><small style="color:var(--muted)">${t.studentRegNo} — ${t.class}</small></td>
      <td>${t.toolName}<br><small style="color:var(--muted)">${t.assetId}</small></td>
      <td>${t.qty}</td>
      <td>${t.borrowDate} ${t.borrowTime}</td>
      <td>${t.expectedReturn} ${t.expectedReturnTime}</td>
      <td>${badge(t.status)}</td>
      <td>
        ${t.status === 'Borrowed' || t.status === 'Overdue' ? `<button class="btn btn-success btn-sm" onclick="markReturned('${t.id}')">✓ Return</button> ` : ''}
        ${t.status === 'Borrowed' ? `<button class="btn btn-warning btn-sm" onclick="markDamaged('${t.id}')">⚠ Damaged</button>` : ''}
        ${t.status === 'Requested' ? `<button class="btn btn-primary btn-sm" onclick="approveRequest('${t.id}')">✓ Approve</button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function renderInventoryTable(tools) {
  const tbody = document.getElementById('inv-tbody');
  tbody.innerHTML = tools.map(t => `<tr>
    <td>${t.assetId}</td><td>${t.name}</td><td>${t.category}</td>
    <td>${t.totalQty}</td>
    <td><strong>${t.availableQty}</strong></td>
    <td>${t.condition}</td><td>${t.location}</td>
  </tr>`).join('');
}

function filterTools() {
  const q = document.getElementById('tool-search').value.toLowerCase();
  const filtered = getTransactions().filter(t =>
    t.studentName.toLowerCase().includes(q) || t.toolName.toLowerCase().includes(q)
  );
  renderToolsTable(filtered);
}

function filterInventory() {
  const q = document.getElementById('inv-search').value.toLowerCase();
  renderInventoryTable(getTools().filter(t => t.name.toLowerCase().includes(q)));
}

function markReturned(id) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB');
  const timeStr = today.toTimeString().slice(0,5);
  updateTransaction(id, { status: 'Returned', actualReturn: dateStr, actualReturnTime: timeStr, conditionAfter: 'Good' });
  // Restore available qty
  const txn = getTransactions().find(t => t.id === id);
  if (txn) { const tool = getTools().find(t => t.id === txn.toolId); if (tool) updateTool(tool.id, { availableQty: tool.availableQty + txn.qty }); }
  logActivity(user.id, user.name, user.role, 'Tool Returned', `${id} — ${txn ? txn.toolName : ''} returned`);
  updateNotifBadge();
  renderToolsSection();
}

function markDamaged(id) {
  updateTransaction(id, { status: 'Damaged', conditionAfter: 'Damaged' });
  const txn = getTransactions().find(t => t.id === id);
  logActivity(user.id, user.name, user.role, 'Tool Marked Damaged', `${id} — ${txn ? txn.toolName : ''}`);
  updateNotifBadge();
  renderToolsSection();
}

function approveRequest(id) {
  const txn = getTransactions().find(t => t.id === id);
  if (!txn) return;
  const tool = getTools().find(t => t.id === txn.toolId);
  if (!tool || tool.availableQty < txn.qty) { alert('Insufficient available quantity!'); return; }
  updateTransaction(id, { status: 'Borrowed' });
  updateTool(tool.id, { availableQty: tool.availableQty - txn.qty });
  logActivity(user.id, user.name, user.role, 'Borrow Request Approved', `${id} — ${txn.toolName}`);
  renderToolsSection();
}

// ─────────────────────────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────────────────────────
function renderMaterialsSection() {
  const lowStock = checkLowStock();
  const banner = document.getElementById('lowstock-banner');
  if (lowStock.length > 0) {
    banner.style.display = 'flex';
    document.getElementById('lowstock-text').textContent =
      `${lowStock.length} item(s) below minimum: ${lowStock.map(m => m.name).join(', ')}`;
  } else { banner.style.display = 'none'; }

  renderMaterialsTable(getMaterials());
  renderMatTxnTable(getMaterialTransactions());
}

function renderMaterialsTable(mats) {
  const tbody = document.getElementById('mat-tbody');
  tbody.innerHTML = mats.map(m => {
    const isLow = m.currentStock <= m.minStockLevel;
    return `<tr class="${isLow ? 'row-lowstock' : ''}">
      <td>${m.id}</td><td>${m.name}</td><td>${m.category}</td><td>${m.unit}</td>
      <td><strong>${m.currentStock}</strong></td>
      <td>${m.minStockLevel}</td>
      <td>${badge(isLow ? 'Attention Required' : 'Safe')}</td>
    </tr>`;
  }).join('');
}

function renderMatTxnTable(txns) {
  const tbody = document.getElementById('mattxn-tbody');
  tbody.innerHTML = txns.map(t => `<tr>
    <td>${t.id}</td><td>${t.materialName}</td>
    <td>${badge(t.type === 'Issue' ? 'Borrowed' : t.type === 'Receipt' ? 'Returned' : 'Pending')}<br><small>${t.type}</small></td>
    <td>${t.qty}</td>
    <td>${t.studentName || '—'}<br><small>${t.class || ''}</small></td>
    <td>${t.lecturerName || '—'}</td>
    <td>${t.date}</td>
    <td>${t.remarks || '—'}</td>
  </tr>`).join('');
}

function filterMaterials() {
  const q = document.getElementById('mat-search').value.toLowerCase();
  renderMaterialsTable(getMaterials().filter(m => m.name.toLowerCase().includes(q)));
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────────────────────────────────────
function renderBookingsSection() {
  const tbody = document.getElementById('booking-tbody');
  const bks = getBookings();
  tbody.innerHTML = bks.map(b => `<tr>
    <td>${b.id}</td><td>${b.lecturerName}</td><td>${b.date}</td>
    <td>${b.startTime} – ${b.endTime}</td>
    <td>${b.courseCode}<br><small>${b.courseName}</small></td>
    <td>${b.class}</td>
    <td>${b.purpose}</td>
    <td>${badge(b.status)}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// USAGE
// ─────────────────────────────────────────────────────────────────────────────
function renderUsageSection() {
  const tbody = document.getElementById('usage-tbody');
  const recs = getUsageRecords();
  tbody.innerHTML = recs.map(r => `<tr>
    <td>${r.id}</td><td>${r.lecturerName}</td><td>${r.date}</td>
    <td>${r.duration}</td>
    <td>${r.courseCode}<br><small>${r.courseName}</small></td>
    <td>${r.class}</td><td>${r.studentCount}</td>
    <td>${r.safetyBriefing ? badge('Safe') : badge('Attention Required')}</td>
    <td>${r.conditionAfter}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// MAINTENANCE
// ─────────────────────────────────────────────────────────────────────────────
function renderMaintenanceSection() {
  const tbody = document.getElementById('maint-tbody');
  const recs = getMaintenanceRecords();
  tbody.innerHTML = recs.map(r => `<tr class="${r.status === 'Pending' ? 'row-overdue' : ''}">
    <td>${r.id}</td>
    <td>${r.toolName}<br><small style="color:var(--muted)">${r.assetId || ''}</small></td>
    <td style="max-width:200px;white-space:normal">${r.issue}</td>
    <td>${r.reportedByName}</td><td>${r.reportedDate}</td><td>${r.dueDate}</td>
    <td>${r.assignedTo}</td>
    <td>${badge(r.status)}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// SAFETY
// ─────────────────────────────────────────────────────────────────────────────
function renderSafetySection() {
  const tbody = document.getElementById('safety-tbody');
  const recs = getSafetyInspections();
  tbody.innerHTML = recs.map(r => `<tr>
    <td>${r.id}</td><td>${r.inspectorName}</td><td>${r.date}</td>
    <td>${badge(r.electricalEquipment === 'Good' ? 'Safe' : 'Attention Required')}</td>
    <td>${badge(r.emergencyEquipment === 'Good' ? 'Safe' : 'Attention Required')}</td>
    <td>${badge(r.ppeAvailability === 'Good' ? 'Safe' : 'Attention Required')}</td>
    <td style="max-width:180px;white-space:normal">${r.defectsFound}</td>
    <td>${badge(r.overallStatus)}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY LOG
// ─────────────────────────────────────────────────────────────────────────────
function renderActlogSection() {
  const tbody = document.getElementById('actlog-tbody');
  const log = getData(KEYS.ACTIVITY_LOG);
  tbody.innerHTML = log.map(l => `<tr>
    <td>${l.id}</td><td>${l.userName}</td><td>${badge(l.role)}</td>
    <td>${l.action}</td>
    <td style="max-width:220px;white-space:normal">${l.details}</td>
    <td>${l.timestamp}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────
function renderUsersSection() {
  const tbody = document.getElementById('users-tbody');
  const users = getData(KEYS.USERS);
  tbody.innerHTML = users.map(u => `<tr>
    <td>${u.id}</td><td>${u.name}</td><td>${u.staffStudentId}</td>
    <td>${u.email}</td><td>${badge(u.role)}</td><td>${u.createdAt}</td>
  </tr>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────────────────────
function openModal(id) {
  if (id === 'modal-borrow') populateBorrowToolDropdown();
  if (id === 'modal-issue' || id === 'modal-addstock') populateMaterialDropdowns();
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function populateBorrowToolDropdown() {
  const sel = document.getElementById('b-tool');
  sel.innerHTML = getTools().filter(t => t.availableQty > 0).map(t =>
    `<option value="${t.id}">${t.name} (Available: ${t.availableQty})</option>`
  ).join('');
}

function populateMaterialDropdowns() {
  const html = getMaterials().map(m =>
    `<option value="${m.id}">${m.name} (Stock: ${m.currentStock} ${m.unit})</option>`
  ).join('');
  const si = document.getElementById('i-material');
  const sa = document.getElementById('as-material');
  if (si) si.innerHTML = html;
  if (sa) sa.innerHTML = html;
}

function submitBorrow() {
  const toolId   = document.getElementById('b-tool').value;
  const qty      = parseInt(document.getElementById('b-qty').value) || 1;
  const student  = document.getElementById('b-student').value.trim();
  const regno    = document.getElementById('b-regno').value.trim();
  const cls      = document.getElementById('b-class').value.trim();
  const course   = document.getElementById('b-course').value.trim();
  const date     = document.getElementById('b-date').value.trim();
  const retdate  = document.getElementById('b-retdate').value.trim();
  const time     = document.getElementById('b-time').value.trim();
  const rettime  = document.getElementById('b-rettime').value.trim();
  const cond     = document.getElementById('b-condition').value;
  const remarks  = document.getElementById('b-remarks').value.trim();

  if (!student || !toolId || !date) { alert('Please fill in Student Name, Tool and Borrow Date.'); return; }

  const tool = getTools().find(t => t.id === toolId);
  if (!tool || tool.availableQty < qty) { alert('Insufficient available quantity!'); return; }

  const txn = {
    id: generateId('TXN'), studentId: user.id, studentName: student,
    studentRegNo: regno, class: cls, course,
    lecturerId: user.id, lecturerName: user.name,
    toolId, toolName: tool.name, assetId: tool.assetId,
    qty, borrowDate: date, borrowTime: time,
    expectedReturn: retdate, expectedReturnTime: rettime,
    actualReturn: '', actualReturnTime: '',
    conditionBefore: cond, conditionAfter: '',
    status: 'Borrowed', remarks
  };

  addTransaction(txn);
  updateTool(toolId, { availableQty: tool.availableQty - qty });
  logActivity(user.id, user.name, user.role, 'Tool Borrowed', `${txn.id} — ${tool.name} x${qty} to ${student}`);
  closeModal('modal-borrow');
  document.getElementById('form-borrow') && document.getElementById('form-borrow').reset();
  renderToolsSection();
  updateNotifBadge();
}

function submitIssue() {
  const matId   = document.getElementById('i-material').value;
  const qty     = parseInt(document.getElementById('i-qty').value) || 1;
  const date    = document.getElementById('i-date').value.trim();
  const student = document.getElementById('i-student').value.trim();
  const cls     = document.getElementById('i-class').value.trim();
  const remarks = document.getElementById('i-remarks').value.trim();

  if (!matId || !date) { alert('Please select a material and enter the date.'); return; }

  const mat = getMaterials().find(m => m.id === matId);
  if (!mat || mat.currentStock < qty) { alert('Insufficient stock! Current stock: ' + (mat ? mat.currentStock : 0)); return; }

  const newStock = mat.currentStock - qty;
  updateMaterial(matId, { currentStock: newStock });

  const txn = {
    id: generateId('MTX'), materialId: matId, materialName: mat.name,
    type: 'Issue', qty, studentId: '', studentName: student,
    class: cls, lecturerId: user.id, lecturerName: user.name,
    date, remarks, remainingAfter: newStock
  };
  addMaterialTransaction(txn);
  logActivity(user.id, user.name, user.role, 'Material Issued', `${mat.name} x${qty} to ${student || 'N/A'}`);
  closeModal('modal-issue');
  renderMaterialsSection();
  updateNotifBadge();
}

function submitAddStock() {
  const matId   = document.getElementById('as-material').value;
  const qty     = parseInt(document.getElementById('as-qty').value) || 1;
  const date    = document.getElementById('as-date').value.trim();
  const remarks = document.getElementById('as-remarks').value.trim();

  if (!matId || !date) { alert('Please select a material and enter the date.'); return; }

  const mat = getMaterials().find(m => m.id === matId);
  if (!mat) return;
  const newStock = mat.currentStock + qty;
  updateMaterial(matId, { currentStock: newStock });

  const txn = {
    id: generateId('MTX'), materialId: matId, materialName: mat.name,
    type: 'Receipt', qty, studentId: '', studentName: '',
    class: '', lecturerId: user.id, lecturerName: user.name,
    date, remarks, remainingAfter: newStock
  };
  addMaterialTransaction(txn);
  logActivity(user.id, user.name, user.role, 'Stock Added', `${mat.name} +${qty} units`);
  closeModal('modal-addstock');
  renderMaterialsSection();
  updateNotifBadge();
}

function submitMaint() {
  const asset   = document.getElementById('m-asset').value.trim();
  const issue   = document.getElementById('m-issue').value.trim();
  const date    = document.getElementById('m-date').value.trim();
  const due     = document.getElementById('m-due').value.trim();
  const assign  = document.getElementById('m-assign').value.trim();

  if (!asset || !issue || !date) { alert('Please fill in Asset, Issue and Report Date.'); return; }

  const rec = {
    id: generateId('MR'), toolId: null, toolName: asset, assetId: asset,
    issue, reportedBy: user.id, reportedByName: user.name,
    reportedDate: date, dueDate: due, assignedTo: assign,
    status: 'Pending', remarks: ''
  };
  addMaintenanceRecord(rec);
  logActivity(user.id, user.name, user.role, 'Maintenance Record Created', `${rec.id} — ${asset}`);
  closeModal('modal-maint');
  renderMaintenanceSection();
  updateNotifBadge();
}

function submitSafety() {
  const date     = document.getElementById('si-date').value.trim();
  const status   = document.getElementById('si-status').value;
  const elec     = document.getElementById('si-elec').value;
  const emergency= document.getElementById('si-emergency').value;
  const ppe      = document.getElementById('si-ppe').value;
  const defects  = document.getElementById('si-defects').value.trim();
  const actions  = document.getElementById('si-actions').value.trim();
  const remarks  = document.getElementById('si-remarks').value.trim();

  if (!date) { alert('Please enter the inspection date.'); return; }

  const rec = {
    id: generateId('SI'), inspectorId: user.id, inspectorName: user.name,
    date, electricalEquipment: elec, emergencyEquipment: emergency,
    ppeAvailability: ppe, defectsFound: defects || 'None',
    correctiveActions: actions || 'None required',
    overallStatus: status, remarks
  };
  addSafetyInspection(rec);
  logActivity(user.id, user.name, user.role, 'Safety Inspection Recorded', `${rec.id} — Status: ${status}`);
  closeModal('modal-safety');
  renderSafetySection();
  updateNotifBadge();
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV EXPORT
// ─────────────────────────────────────────────────────────────────────────────
function exportCSV(type) {
  let rows = [], filename = '';
  const today = new Date().toLocaleDateString('en-GB');

  if (type === 'tools') {
    filename = `EPN_Tool_Transactions_${today}.csv`;
    rows = [['Txn ID','Student','Reg No','Class','Tool','Qty','Borrow Date','Expected Return','Status','Remarks']];
    getTransactions().forEach(t => rows.push([t.id,t.studentName,t.studentRegNo,t.class,t.toolName,t.qty,t.borrowDate,t.expectedReturn,t.status,t.remarks]));
  } else if (type === 'materials') {
    filename = `EPN_Materials_Stock_${today}.csv`;
    rows = [['ID','Name','Category','Unit','Current Stock','Min Level']];
    getMaterials().forEach(m => rows.push([m.id,m.name,m.category,m.unit,m.currentStock,m.minStockLevel]));
  } else if (type === 'bookings') {
    filename = `EPN_Bookings_${today}.csv`;
    rows = [['ID','Lecturer','Date','Start','End','Course','Class','Purpose','Status']];
    getBookings().forEach(b => rows.push([b.id,b.lecturerName,b.date,b.startTime,b.endTime,b.courseCode,b.class,b.purpose,b.status]));
  } else if (type === 'usage') {
    filename = `EPN_Usage_Records_${today}.csv`;
    rows = [['ID','Lecturer','Date','Duration','Course','Class','Students','Safety Briefing','Condition After']];
    getUsageRecords().forEach(r => rows.push([r.id,r.lecturerName,r.date,r.duration,r.courseCode,r.class,r.studentCount,r.safetyBriefing?'Yes':'No',r.conditionAfter]));
  } else if (type === 'maintenance') {
    filename = `EPN_Maintenance_${today}.csv`;
    rows = [['ID','Asset','Issue','Reported By','Report Date','Due Date','Assigned To','Status']];
    getMaintenanceRecords().forEach(r => rows.push([r.id,r.toolName,r.issue,r.reportedByName,r.reportedDate,r.dueDate,r.assignedTo,r.status]));
  } else if (type === 'safety') {
    filename = `EPN_Safety_Inspections_${today}.csv`;
    rows = [['ID','Inspector','Date','Electrical','Emergency','PPE','Defects','Overall Status']];
    getSafetyInspections().forEach(r => rows.push([r.id,r.inspectorName,r.date,r.electricalEquipment,r.emergencyEquipment,r.ppeAvailability,r.defectsFound,r.overallStatus]));
  } else if (type === 'actlog') {
    filename = `EPN_Activity_Log_${today}.csv`;
    rows = [['ID','User','Role','Action','Details','Timestamp']];
    getData(KEYS.ACTIVITY_LOG).forEach(l => rows.push([l.id,l.userName,l.role,l.action,l.details,l.timestamp]));
  }

  if (!rows.length) return;
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
