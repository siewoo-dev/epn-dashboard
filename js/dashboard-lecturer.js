/**
 * dashboard-lecturer.js — Lecturer Dashboard Logic
 * Smart EPN Workshop Management Dashboard
 */

const user = requireAuth('lecturer');
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
  const titles = {
    overview: 'Dashboard Overview', 'record-usage': 'Record Workshop Usage',
    booking: 'Workshop Booking', tools: 'Tool Transactions',
    materials: 'Material Usage', reports: 'My Reports'
  };
  document.getElementById('page-title').textContent = isBM ?
    ({ overview:'Ringkasan', 'record-usage':'Rekod Penggunaan', booking:'Tempahan', tools:'Alatan', materials:'Bahan', reports:'Laporan' }[name] || name) :
    (titles[name] || name);
  closeSidebar();
  renderSection(name);
}

function renderSection(name) {
  switch (name) {
    case 'overview':      renderOverview(); break;
    case 'record-usage':  renderUsageHistory(); break;
    case 'booking':       renderBookingSection(); break;
    case 'tools':         renderLecToolsTable(); break;
    case 'materials':     renderLecMaterials(); break;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function myTransactions() {
  return getTransactions().filter(t => t.lecturerId === user.id || t.lecturerName === user.name);
}
function myUsageRecords() {
  return getUsageRecords().filter(r => r.lecturerId === user.id || r.lecturerName === user.name);
}
function myBookings() {
  return getBookings().filter(b => b.lecturerId === user.id || b.lecturerName === user.name);
}
function myMatTxns() {
  return getMaterialTransactions().filter(t => t.lecturerId === user.id || t.lecturerName === user.name);
}

function badge(status) {
  const map = {
    'Borrowed':'badge-borrowed','Returned':'badge-returned','Overdue':'badge-overdue',
    'Damaged':'badge-damaged','Missing':'badge-missing','Requested':'badge-requested',
    'Pending':'badge-pending','Safe':'badge-safe','Attention Required':'badge-attention',
    'Repair Required':'badge-repair','Inspection Due':'badge-insp-due',
    'Confirmed':'badge-confirmed','Completed':'badge-completed','In Progress':'badge-progress',
  };
  return `<span class="badge ${map[status]||'badge-pending'}">${status}</span>`;
}

// ── Overview ───────────────────────────────────────────────────────────────────
function renderOverview() {
  const myTxns = myTransactions();
  const myMat  = myMatTxns();
  const now    = new Date();
  const thisMonth = now.getMonth();
  const thisYear  = now.getFullYear();

  const sessionsThisMonth = myUsageRecords().filter(r => {
    const p = r.date.split('/');
    const d = new Date(p[2], p[1]-1, p[0]);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const borrowed = myTxns.filter(t => t.status === 'Borrowed').length;
  const matUsedThisMonth = myMat.filter(t => {
    if (t.type !== 'Issue') return false;
    const p = t.date.split('/');
    const d = new Date(p[2], p[1]-1, p[0]);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).reduce((s, t) => s + t.qty, 0);
  const pendingReturns = myTxns.filter(t => t.status === 'Borrowed' || t.status === 'Overdue').length;

  const cards = [
    { icon: '📅', label: 'My Sessions This Month',       value: sessionsThisMonth, accent: '#16a34a', sub: 'workshop sessions recorded' },
    { icon: '🔧', label: 'Tools Borrowed by My Class',   value: borrowed,           accent: '#3b82d4', sub: 'currently on loan' },
    { icon: '📦', label: 'Materials Issued This Month',  value: matUsedThisMonth,   accent: '#7c3aed', sub: 'units issued' },
    { icon: '⏳', label: 'Pending Returns',              value: pendingReturns,     accent: '#d97706', sub: 'tools not yet returned' },
  ];

  document.getElementById('lec-cards').innerHTML = cards.map(c => `
    <div class="summary-card" style="--card-accent:${c.accent}">
      <div class="card-icon-lg">${c.icon}</div>
      <div class="card-label">${c.label}</div>
      <div class="card-value">${c.value}</div>
      <div class="card-sub">${c.sub}</div>
    </div>`).join('');

  // Recent tools table
  const tbody = document.getElementById('lec-recent-tools');
  const recent = myTxns.slice(0, 5);
  tbody.innerHTML = recent.length ? recent.map(t => `<tr>
    <td>${t.id}</td><td>${t.studentName}</td><td>${t.toolName}</td>
    <td>${t.borrowDate}</td><td>${badge(t.status)}</td>
  </tr>`).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:1rem">No transactions.</td></tr>';
}

// ── Usage Form ─────────────────────────────────────────────────────────────────
function calcDuration() {
  const start = document.getElementById('u-start').value;
  const end   = document.getElementById('u-end').value;
  if (!start || !end) return;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) { document.getElementById('u-duration').value = ''; return; }
  document.getElementById('u-duration').value = `${Math.floor(diff/60)}h ${diff%60}m`;
}

function submitUsage() {
  const date     = document.getElementById('u-date').value.trim();
  const start    = document.getElementById('u-start').value.trim();
  const end      = document.getElementById('u-end').value.trim();
  const duration = document.getElementById('u-duration').value.trim();
  const code     = document.getElementById('u-code').value.trim();
  const cname    = document.getElementById('u-cname').value.trim();
  const cls      = document.getElementById('u-class').value.trim();
  const sem      = document.getElementById('u-sem').value.trim();
  const activity = document.getElementById('u-activity').value.trim();
  const students = parseInt(document.getElementById('u-students').value) || 0;
  const purpose  = document.getElementById('u-purpose').value.trim();
  const before   = document.getElementById('u-before').value;
  const after    = document.getElementById('u-after').value;
  const safety   = document.getElementById('u-safety').checked;
  const remarks  = document.getElementById('u-remarks').value.trim();

  const msg = document.getElementById('usage-msg');
  if (!date || !start || !end || !code || !cls) {
    msg.textContent = 'Please fill in Date, Times, Course Code and Class.';
    msg.className = 'global-msg show error'; return;
  }
  msg.className = 'global-msg';

  const rec = {
    id: generateId('UR'),
    bookingId: '', lecturerId: user.id, lecturerName: user.name,
    date, startTime: start, endTime: end, duration: duration || `${start}–${end}`,
    courseCode: code, courseName: cname, class: cls, semester: sem,
    activity, studentCount: students, safetyBriefing: safety,
    conditionBefore: before, conditionAfter: after, remarks
  };
  addUsageRecord(rec);
  logActivity(user.id, user.name, user.role, 'Usage Record Added', `${rec.id} — ${code} ${cls} on ${date}`);
  msg.textContent = 'Usage record saved successfully!';
  msg.className = 'global-msg show success';
  setTimeout(() => msg.className = 'global-msg', 2500);
  renderUsageHistory();
}

function resetUsageForm() {
  ['u-date','u-start','u-end','u-duration','u-code','u-cname','u-class','u-sem','u-activity','u-purpose','u-remarks'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('u-students').value = 18;
  document.getElementById('u-safety').checked = false;
  document.getElementById('u-before').value = 'Good';
  document.getElementById('u-after').value = 'Good';
}

function renderUsageHistory() {
  const tbody = document.getElementById('lec-usage-hist');
  const recs = myUsageRecords();
  tbody.innerHTML = recs.length ? recs.map(r => `<tr>
    <td>${r.id}</td><td>${r.date}</td><td>${r.duration}</td>
    <td>${r.courseCode}<br><small>${r.courseName||''}</small></td>
    <td>${r.class}</td><td>${r.studentCount}</td>
    <td>${r.safetyBriefing ? badge('Safe') : badge('Attention Required')}</td>
    <td>${r.conditionAfter}</td>
  </tr>`).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:1rem">No records yet.</td></tr>';
}

// ── Booking ────────────────────────────────────────────────────────────────────
function checkClash() {
  const date  = document.getElementById('bk-date').value.trim();
  const start = document.getElementById('bk-start').value.trim();
  const end   = document.getElementById('bk-end').value.trim();
  const clashAlert = document.getElementById('clash-alert');
  const clashMsg   = document.getElementById('clash-msg');

  if (!date || !start || !end) { clashAlert.style.display = 'none'; return; }

  const existing = getBookings().filter(b => b.date === date && b.status !== 'Completed');
  const [ns, ne] = [toMinutes(start), toMinutes(end)];
  const clashes = existing.filter(b => {
    const [bs, be] = [toMinutes(b.startTime), toMinutes(b.endTime)];
    return ns < be && ne > bs;
  });

  if (clashes.length) {
    clashAlert.style.display = 'flex';
    clashMsg.textContent = `Clash detected with: ${clashes.map(b => `${b.lecturerName} (${b.startTime}–${b.endTime})`).join(', ')} on ${date}`;
  } else {
    clashAlert.style.display = 'none';
    const bm = document.getElementById('booking-msg');
    bm.textContent = '✓ No clash detected. Workshop is available for this slot.';
    bm.className = 'global-msg show success';
    setTimeout(() => bm.className = 'global-msg', 2500);
  }
}

function toMinutes(t) {
  const [h, m] = (t || '00:00').split(':').map(Number);
  return h * 60 + m;
}

function submitBooking() {
  const date    = document.getElementById('bk-date').value.trim();
  const start   = document.getElementById('bk-start').value.trim();
  const end     = document.getElementById('bk-end').value.trim();
  const code    = document.getElementById('bk-code').value.trim();
  const cname   = document.getElementById('bk-cname').value.trim();
  const cls     = document.getElementById('bk-class').value.trim();
  const purpose = document.getElementById('bk-purpose').value.trim();
  const bm      = document.getElementById('booking-msg');

  if (!date || !start || !end || !code) {
    bm.textContent = 'Please fill in Date, Times and Course Code.';
    bm.className = 'global-msg show error'; return;
  }

  // Re-check clash
  const existing = getBookings().filter(b => b.date === date && b.status !== 'Completed');
  const [ns, ne] = [toMinutes(start), toMinutes(end)];
  const clash = existing.some(b => {
    const [bs, be] = [toMinutes(b.startTime), toMinutes(b.endTime)];
    return ns < be && ne > bs;
  });
  if (clash) {
    bm.textContent = 'Cannot book — time slot clash exists. Please choose a different time.';
    bm.className = 'global-msg show error'; return;
  }

  const bk = {
    id: generateId('BK'), lecturerId: user.id, lecturerName: user.name,
    date, startTime: start, endTime: end,
    courseCode: code, courseName: cname, class: cls, purpose, status: 'Pending'
  };
  addBooking(bk);
  logActivity(user.id, user.name, user.role, 'Workshop Booked', `${bk.id} — ${code} on ${date}`);
  bm.textContent = 'Booking submitted! Status: Pending approval.';
  bm.className = 'global-msg show success';
  setTimeout(() => bm.className = 'global-msg', 3000);
  renderBookingSection();
}

function renderBookingSection() {
  const tbody = document.getElementById('lec-bookings');
  const bks = getBookings();
  tbody.innerHTML = bks.length ? bks.map(b => `<tr>
    <td>${b.id}</td><td>${b.lecturerName}</td><td>${b.date}</td>
    <td>${b.startTime}–${b.endTime}</td>
    <td>${b.courseCode}</td><td>${b.class}</td>
    <td>${badge(b.status)}</td>
  </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:var(--muted)">No bookings.</td></tr>';
}

// ── Tools Table ────────────────────────────────────────────────────────────────
function renderLecToolsTable() {
  const tbody = document.getElementById('lec-tools-tbody');
  const txns = myTransactions();
  tbody.innerHTML = txns.length ? txns.map(t => `<tr class="${['Overdue','Damaged','Missing'].includes(t.status)?'row-overdue':''}">
    <td>${t.id}</td>
    <td>${t.studentName}<br><small>${t.studentRegNo}</small></td>
    <td>${t.toolName}</td><td>${t.qty}</td>
    <td>${t.borrowDate} ${t.borrowTime}</td>
    <td>${t.expectedReturn} ${t.expectedReturnTime}</td>
    <td>${badge(t.status)}</td>
    <td>${t.status==='Borrowed'||t.status==='Overdue'?`<button class="btn btn-success btn-sm" onclick="lecMarkReturn('${t.id}')">✓ Return</button>`:'—'}</td>
  </tr>`).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--muted)">No transactions.</td></tr>';
}

function lecMarkReturn(id) {
  const today = new Date();
  updateTransaction(id, {
    status: 'Returned',
    actualReturn: today.toLocaleDateString('en-GB'),
    actualReturnTime: today.toTimeString().slice(0,5),
    conditionAfter: 'Good'
  });
  const txn = getTransactions().find(t => t.id === id);
  if (txn) { const tool = getTools().find(t => t.id === txn.toolId); if (tool) updateTool(tool.id, { availableQty: tool.availableQty + txn.qty }); }
  logActivity(user.id, user.name, user.role, 'Tool Returned', `${id} verified by lecturer`);
  renderLecToolsTable();
}

function openBorrowModal() {
  const sel = document.getElementById('lb-tool');
  sel.innerHTML = getTools().filter(t => t.availableQty > 0).map(t =>
    `<option value="${t.id}">${t.name} (Avail: ${t.availableQty})</option>`
  ).join('');
  openModal('modal-lec-borrow');
}

function submitLecBorrow() {
  const toolId  = document.getElementById('lb-tool').value;
  const qty     = parseInt(document.getElementById('lb-qty').value) || 1;
  const student = document.getElementById('lb-student').value.trim();
  const regno   = document.getElementById('lb-regno').value.trim();
  const cls     = document.getElementById('lb-class').value.trim();
  const course  = document.getElementById('lb-course').value.trim();
  const date    = document.getElementById('lb-date').value.trim();
  const retdate = document.getElementById('lb-retdate').value.trim();
  const time    = document.getElementById('lb-time').value.trim();
  const rettime = document.getElementById('lb-rettime').value.trim();

  if (!student || !toolId || !date) { alert('Please fill Student Name, Tool and Borrow Date.'); return; }
  const tool = getTools().find(t => t.id === toolId);
  if (!tool || tool.availableQty < qty) { alert('Insufficient available quantity!'); return; }

  const txn = {
    id: generateId('TXN'), studentId: '', studentName: student,
    studentRegNo: regno, class: cls, course,
    lecturerId: user.id, lecturerName: user.name,
    toolId, toolName: tool.name, assetId: tool.assetId,
    qty, borrowDate: date, borrowTime: time,
    expectedReturn: retdate, expectedReturnTime: rettime,
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Borrowed', remarks: ''
  };
  addTransaction(txn);
  updateTool(toolId, { availableQty: tool.availableQty - qty });
  logActivity(user.id, user.name, user.role, 'Tool Borrowed', `${txn.id} — ${tool.name} x${qty}`);
  closeModal('modal-lec-borrow');
  renderLecToolsTable();
}

// ── Materials ──────────────────────────────────────────────────────────────────
function renderLecMaterials() {
  const tbody = document.getElementById('lec-mat-tbody');
  const txns = myMatTxns();
  tbody.innerHTML = txns.length ? txns.map(t => `<tr>
    <td>${t.id}</td><td>${t.materialName}</td>
    <td>${badge(t.type === 'Issue' ? 'Borrowed' : 'Returned')}<br><small>${t.type}</small></td>
    <td>${t.qty}</td><td>${t.studentName || '—'}</td>
    <td>${t.date}</td><td>${t.remarks||'—'}</td>
  </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;color:var(--muted)">No material transactions.</td></tr>';

  // Stock view
  const stock = document.getElementById('lec-stock-tbody');
  stock.innerHTML = getMaterials().map(m => `<tr class="${m.currentStock<=m.minStockLevel?'row-lowstock':''}">
    <td>${m.name}</td><td>${m.category}</td><td>${m.unit}</td>
    <td><strong>${m.currentStock}</strong></td><td>${m.minStockLevel}</td>
    <td>${badge(m.currentStock<=m.minStockLevel?'Attention Required':'Safe')}</td>
  </tr>`).join('');
}

function submitLecIssue() {
  const matId   = document.getElementById('li-material').value;
  const qty     = parseInt(document.getElementById('li-qty').value) || 1;
  const date    = document.getElementById('li-date').value.trim();
  const student = document.getElementById('li-student').value.trim();
  const cls     = document.getElementById('li-class').value.trim();
  const remarks = document.getElementById('li-remarks').value.trim();

  if (!matId || !date) { alert('Please select a material and date.'); return; }
  const mat = getMaterials().find(m => m.id === matId);
  if (!mat || mat.currentStock < qty) { alert('Insufficient stock! Current: ' + (mat ? mat.currentStock : 0)); return; }

  const newStock = mat.currentStock - qty;
  updateMaterial(matId, { currentStock: newStock });
  const txn = {
    id: generateId('MTX'), materialId: matId, materialName: mat.name,
    type: 'Issue', qty, studentId: '', studentName: student,
    class: cls, lecturerId: user.id, lecturerName: user.name,
    date, remarks, remainingAfter: newStock
  };
  addMaterialTransaction(txn);
  logActivity(user.id, user.name, user.role, 'Material Issued', `${mat.name} x${qty}`);
  closeModal('modal-lec-issue');
  renderLecMaterials();
}

// ── Modal helpers ──────────────────────────────────────────────────────────────
function openModal(id) {
  if (id === 'modal-lec-issue') {
    document.getElementById('li-material').innerHTML = getMaterials().map(m =>
      `<option value="${m.id}">${m.name} (Stock: ${m.currentStock} ${m.unit})</option>`).join('');
  }
  document.getElementById(id).classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ── CSV Export ─────────────────────────────────────────────────────────────────
function exportLecCSV(type) {
  let rows = [], filename = '';
  const today = new Date().toLocaleDateString('en-GB');
  if (type === 'tools') {
    filename = `EPN_MyTools_${today}.csv`;
    rows = [['Txn ID','Student','Tool','Qty','Borrow Date','Status']];
    myTransactions().forEach(t => rows.push([t.id,t.studentName,t.toolName,t.qty,t.borrowDate,t.status]));
  } else if (type === 'materials') {
    filename = `EPN_MyMaterials_${today}.csv`;
    rows = [['ID','Material','Type','Qty','Student','Date','Remarks']];
    myMatTxns().forEach(t => rows.push([t.id,t.materialName,t.type,t.qty,t.studentName,t.date,t.remarks]));
  } else if (type === 'bookings') {
    filename = `EPN_MyBookings_${today}.csv`;
    rows = [['ID','Date','Start','End','Course','Class','Status']];
    myBookings().forEach(b => rows.push([b.id,b.date,b.startTime,b.endTime,b.courseCode,b.class,b.status]));
  } else if (type === 'usage') {
    filename = `EPN_MyUsage_${today}.csv`;
    rows = [['ID','Date','Duration','Course','Class','Students','Safety','Condition After']];
    myUsageRecords().forEach(r => rows.push([r.id,r.date,r.duration,r.courseCode,r.class,r.studentCount,r.safetyBriefing?'Yes':'No',r.conditionAfter]));
  }
  if (!rows.length) return;
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
