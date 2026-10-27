/**
 * data.js — Smart EPN Workshop Management Dashboard
 * Demo seed data & localStorage CRUD helpers
 * Politeknik Kuching Sarawak — Electrical Wiring Workshop (EPN)
 * ⚠️ ALL DATA IS DEMONSTRATION DATA ONLY
 */

// ── localStorage Keys ─────────────────────────────────────────────────────────
const KEYS = {
  SEEDED:               'epn_seeded',
  CURRENT_USER:         'epn_current_user',
  USERS:                'epn_users',
  TOOLS:                'epn_tools',
  MATERIALS:            'epn_materials',
  TOOL_TRANSACTIONS:    'epn_tool_transactions',
  MATERIAL_TRANSACTIONS:'epn_material_transactions',
  BOOKINGS:             'epn_bookings',
  USAGE_RECORDS:        'epn_usage_records',
  MAINTENANCE:          'epn_maintenance',
  SAFETY_INSPECTIONS:   'epn_safety_inspections',
  ACTIVITY_LOG:         'epn_activity_log',
  THEME:                'epn_theme',
  LANG:                 'epn_lang',
};

// ── Generic Helpers ────────────────────────────────────────────────────────────
function getData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch { return []; }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch { return null; }
}

function setObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// ── DEMO SEED DATA ─────────────────────────────────────────────────────────────

const DEMO_USERS = [
  {
    id: 'USR-001',
    name: 'Ahmad Zulkifli bin Hassan',
    staffStudentId: 'PK-SUP-001',
    email: 'supervisor@epn.edu.my',
    password: 'Supervisor@2026',
    role: 'supervisor',
    createdAt: '01/01/2026'
  },
  {
    id: 'USR-002',
    name: 'Siti Rahimah binti Sahari',
    staffStudentId: 'PK-LEC-001',
    email: 'lecturer@epn.edu.my',
    password: 'Lecturer@2026',
    role: 'lecturer',
    createdAt: '01/01/2026'
  },
  {
    id: 'USR-003',
    name: 'Muhammad Hafiz bin Rosli',
    staffStudentId: '23DET-001',
    email: 'student@epn.edu.my',
    password: 'Student@2026',
    role: 'student',
    createdAt: '01/01/2026'
  },
  {
    id: 'USR-004',
    name: 'Nurul Ain binti Samsudin',
    staffStudentId: 'PK-LEC-002',
    email: 'lecturer2@epn.edu.my',
    password: 'Lecturer@2026',
    role: 'lecturer',
    createdAt: '01/01/2026'
  },
  {
    id: 'USR-005',
    name: 'Farah Nabilah binti Azman',
    staffStudentId: '23DET-002',
    email: 'student2@epn.edu.my',
    password: 'Student@2026',
    role: 'student',
    createdAt: '01/01/2026'
  }
];

const DEMO_TOOLS = [
  { id: 'TL-001', assetId: 'EPN-MM-001', name: 'Digital Multimeter', category: 'Measuring Instrument', totalQty: 10, availableQty: 7, condition: 'Good', location: 'Cabinet A' },
  { id: 'TL-002', assetId: 'EPN-MM-002', name: 'Clamp Meter', category: 'Measuring Instrument', totalQty: 6, availableQty: 5, condition: 'Good', location: 'Cabinet A' },
  { id: 'TL-003', assetId: 'EPN-PL-001', name: 'Combination Pliers', category: 'Hand Tool', totalQty: 20, availableQty: 15, condition: 'Good', location: 'Cabinet B' },
  { id: 'TL-004', assetId: 'EPN-PL-002', name: 'Long Nose Pliers', category: 'Hand Tool', totalQty: 20, availableQty: 18, condition: 'Good', location: 'Cabinet B' },
  { id: 'TL-005', assetId: 'EPN-SD-001', name: 'Flathead Screwdriver Set', category: 'Hand Tool', totalQty: 15, availableQty: 12, condition: 'Good', location: 'Cabinet B' },
  { id: 'TL-006', assetId: 'EPN-SD-002', name: 'Phillips Screwdriver Set', category: 'Hand Tool', totalQty: 15, availableQty: 13, condition: 'Good', location: 'Cabinet B' },
  { id: 'TL-007', assetId: 'EPN-WS-001', name: 'Wire Stripper', category: 'Hand Tool', totalQty: 12, availableQty: 9, condition: 'Good', location: 'Cabinet C' },
  { id: 'TL-008', assetId: 'EPN-CT-001', name: 'Crimping Tool', category: 'Hand Tool', totalQty: 8, availableQty: 6, condition: 'Good', location: 'Cabinet C' },
  { id: 'TL-009', assetId: 'EPN-VT-001', name: 'Voltage Tester (Non-contact)', category: 'Measuring Instrument', totalQty: 10, availableQty: 8, condition: 'Good', location: 'Cabinet A' },
  { id: 'TL-010', assetId: 'EPN-CB-001', name: 'Conduit Bender', category: 'Specialist Tool', totalQty: 4, availableQty: 3, condition: 'Good', location: 'Cabinet D' },
  { id: 'TL-011', assetId: 'EPN-HM-001', name: 'Hammer', category: 'Hand Tool', totalQty: 10, availableQty: 9, condition: 'Good', location: 'Cabinet B' },
  { id: 'TL-012', assetId: 'EPN-TK-001', name: 'Tape Measure (5m)', category: 'Measuring Instrument', totalQty: 15, availableQty: 14, condition: 'Good', location: 'Cabinet A' },
  { id: 'TL-013', assetId: 'EPN-DL-001', name: 'Power Drill', category: 'Power Tool', totalQty: 5, availableQty: 3, condition: 'Good', location: 'Cabinet D' },
  { id: 'TL-014', assetId: 'EPN-HL-001', name: 'Heat Gun', category: 'Power Tool', totalQty: 4, availableQty: 4, condition: 'Good', location: 'Cabinet D' },
  { id: 'TL-015', assetId: 'EPN-FS-001', name: 'Fish Tape / Draw Wire', category: 'Specialist Tool', totalQty: 3, availableQty: 2, condition: 'Fair', location: 'Cabinet D' },
];

const DEMO_MATERIALS = [
  { id: 'MT-001', name: 'PVC Cable 1.5mm² (Red)', category: 'Electrical Cable', unit: 'meter', currentStock: 180, minStockLevel: 50, unitPrice: 1.20 },
  { id: 'MT-002', name: 'PVC Cable 1.5mm² (Black)', category: 'Electrical Cable', unit: 'meter', currentStock: 160, minStockLevel: 50, unitPrice: 1.20 },
  { id: 'MT-003', name: 'PVC Cable 2.5mm² (Red)', category: 'Electrical Cable', unit: 'meter', currentStock: 45, minStockLevel: 50, unitPrice: 1.80 },
  { id: 'MT-004', name: 'PVC Cable 4mm² (Black)', category: 'Electrical Cable', unit: 'meter', currentStock: 20, minStockLevel: 30, unitPrice: 2.50 },
  { id: 'MT-005', name: 'Single Switch (13A)', category: 'Wiring Accessory', unit: 'piece', currentStock: 85, minStockLevel: 20, unitPrice: 3.50 },
  { id: 'MT-006', name: 'Double Socket Outlet (13A)', category: 'Wiring Accessory', unit: 'piece', currentStock: 60, minStockLevel: 20, unitPrice: 8.00 },
  { id: 'MT-007', name: '3-Pin Plug (13A)', category: 'Wiring Accessory', unit: 'piece', currentStock: 12, minStockLevel: 20, unitPrice: 2.80 },
  { id: 'MT-008', name: 'PVC Conduit 20mm (3m)', category: 'Conduit & Fitting', unit: 'piece', currentStock: 40, minStockLevel: 15, unitPrice: 4.50 },
  { id: 'MT-009', name: 'Cable Tie 200mm', category: 'Conduit & Fitting', unit: 'pack', currentStock: 25, minStockLevel: 10, unitPrice: 3.00 },
  { id: 'MT-010', name: 'Terminal Block (12-way)', category: 'Connector', unit: 'piece', currentStock: 30, minStockLevel: 10, unitPrice: 5.50 },
  { id: 'MT-011', name: 'Insulation Tape (Black)', category: 'Consumable', unit: 'roll', currentStock: 8, minStockLevel: 15, unitPrice: 1.50 },
  { id: 'MT-012', name: 'Wire Connector (Wago 3-way)', category: 'Connector', unit: 'pack', currentStock: 22, minStockLevel: 10, unitPrice: 6.00 },
];

const DEMO_TOOL_TRANSACTIONS = [
  {
    id: 'TXN-001', studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli',
    studentRegNo: '23DET-001', class: 'DET2A', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-001', toolName: 'Digital Multimeter', assetId: 'EPN-MM-001',
    qty: 1, borrowDate: '15/01/2026', borrowTime: '08:00',
    expectedReturn: '15/01/2026', expectedReturnTime: '13:00',
    actualReturn: '15/01/2026', actualReturnTime: '12:45',
    conditionBefore: 'Good', conditionAfter: 'Good',
    status: 'Returned', remarks: 'Returned in good condition'
  },
  {
    id: 'TXN-002', studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli',
    studentRegNo: '23DET-001', class: 'DET2A', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-003', toolName: 'Combination Pliers', assetId: 'EPN-PL-001',
    qty: 2, borrowDate: '20/01/2026', borrowTime: '09:00',
    expectedReturn: '20/01/2026', expectedReturnTime: '17:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Borrowed', remarks: ''
  },
  {
    id: 'TXN-003', studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman',
    studentRegNo: '23DET-002', class: 'DET2B', course: 'DET20013',
    lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin',
    toolId: 'TL-007', toolName: 'Wire Stripper', assetId: 'EPN-WS-001',
    qty: 1, borrowDate: '05/01/2026', borrowTime: '10:00',
    expectedReturn: '05/01/2026', expectedReturnTime: '17:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Overdue', remarks: 'Student has not returned'
  },
  {
    id: 'TXN-004', studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman',
    studentRegNo: '23DET-002', class: 'DET2B', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-009', toolName: 'Voltage Tester (Non-contact)', assetId: 'EPN-VT-001',
    qty: 1, borrowDate: '10/02/2026', borrowTime: '08:30',
    expectedReturn: '10/02/2026', expectedReturnTime: '13:00',
    actualReturn: '10/02/2026', actualReturnTime: '13:10',
    conditionBefore: 'Good', conditionAfter: 'Damaged — cracked casing',
    status: 'Damaged', remarks: 'Casing cracked, sent for repair'
  },
  {
    id: 'TXN-005', studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli',
    studentRegNo: '23DET-001', class: 'DET2A', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-005', toolName: 'Flathead Screwdriver Set', assetId: 'EPN-SD-001',
    qty: 1, borrowDate: '18/02/2026', borrowTime: '09:00',
    expectedReturn: '18/02/2026', expectedReturnTime: '17:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Requested', remarks: 'Pending lecturer approval'
  },
  {
    id: 'TXN-006', studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman',
    studentRegNo: '23DET-002', class: 'DET2B', course: 'DET20013',
    lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin',
    toolId: 'TL-002', toolName: 'Clamp Meter', assetId: 'EPN-MM-002',
    qty: 1, borrowDate: '25/02/2026', borrowTime: '08:00',
    expectedReturn: '25/02/2026', expectedReturnTime: '13:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Borrowed', remarks: ''
  },
  {
    id: 'TXN-007', studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli',
    studentRegNo: '23DET-001', class: 'DET2A', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-013', toolName: 'Power Drill', assetId: 'EPN-DL-001',
    qty: 1, borrowDate: '01/03/2026', borrowTime: '10:00',
    expectedReturn: '01/03/2026', expectedReturnTime: '17:00',
    actualReturn: '01/03/2026', actualReturnTime: '16:50',
    conditionBefore: 'Good', conditionAfter: 'Good',
    status: 'Returned', remarks: ''
  },
  {
    id: 'TXN-008', studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman',
    studentRegNo: '23DET-002', class: 'DET2B', course: 'DET20013',
    lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin',
    toolId: 'TL-008', toolName: 'Crimping Tool', assetId: 'EPN-CT-001',
    qty: 1, borrowDate: '10/03/2026', borrowTime: '09:00',
    expectedReturn: '10/03/2026', expectedReturnTime: '17:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Borrowed', remarks: ''
  },
  {
    id: 'TXN-009', studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli',
    studentRegNo: '23DET-001', class: 'DET2A', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-015', toolName: 'Fish Tape / Draw Wire', assetId: 'EPN-FS-001',
    qty: 1, borrowDate: '15/03/2026', borrowTime: '08:00',
    expectedReturn: '15/03/2026', expectedReturnTime: '13:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Fair', conditionAfter: '',
    status: 'Missing', remarks: 'Item not found after session'
  },
  {
    id: 'TXN-010', studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman',
    studentRegNo: '23DET-002', class: 'DET2B', course: 'DET20013',
    lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari',
    toolId: 'TL-004', toolName: 'Long Nose Pliers', assetId: 'EPN-PL-002',
    qty: 2, borrowDate: '20/03/2026', borrowTime: '10:00',
    expectedReturn: '20/03/2026', expectedReturnTime: '17:00',
    actualReturn: '', actualReturnTime: '',
    conditionBefore: 'Good', conditionAfter: '',
    status: 'Borrowed', remarks: ''
  },
];

const DEMO_MATERIAL_TRANSACTIONS = [
  { id: 'MTX-001', materialId: 'MT-001', materialName: 'PVC Cable 1.5mm² (Red)', type: 'Issue', qty: 20, studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli', class: 'DET2A', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '15/01/2026', remarks: 'Practical 1', remainingAfter: 200 },
  { id: 'MTX-002', materialId: 'MT-005', materialName: 'Single Switch (13A)', type: 'Issue', qty: 5, studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli', class: 'DET2A', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '15/01/2026', remarks: 'Practical 1', remainingAfter: 90 },
  { id: 'MTX-003', materialId: 'MT-003', materialName: 'PVC Cable 2.5mm² (Red)', type: 'Issue', qty: 15, studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman', class: 'DET2B', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '20/01/2026', remarks: 'Practical 2', remainingAfter: 60 },
  { id: 'MTX-004', materialId: 'MT-001', materialName: 'PVC Cable 1.5mm² (Red)', type: 'Receipt', qty: 100, studentId: '', studentName: '', class: '', lecturerId: 'USR-001', lecturerName: 'Ahmad Zulkifli bin Hassan', date: '01/02/2026', remarks: 'Stock replenishment from supplier', remainingAfter: 280 },
  { id: 'MTX-005', materialId: 'MT-007', materialName: '3-Pin Plug (13A)', type: 'Issue', qty: 8, studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman', class: 'DET2B', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '10/02/2026', remarks: 'Practical 3', remainingAfter: 20 },
  { id: 'MTX-006', materialId: 'MT-011', materialName: 'Insulation Tape (Black)', type: 'Issue', qty: 4, studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli', class: 'DET2A', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '18/02/2026', remarks: 'Practical 3', remainingAfter: 12 },
  { id: 'MTX-007', materialId: 'MT-004', materialName: 'PVC Cable 4mm² (Black)', type: 'Issue', qty: 10, studentId: 'USR-003', studentName: 'Muhammad Hafiz bin Rosli', class: 'DET2A', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '01/03/2026', remarks: 'Practical 4', remainingAfter: 30 },
  { id: 'MTX-008', materialId: 'MT-006', materialName: 'Double Socket Outlet (13A)', type: 'Issue', qty: 6, studentId: 'USR-005', studentName: 'Farah Nabilah binti Azman', class: 'DET2B', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '10/03/2026', remarks: 'Practical 4', remainingAfter: 66 },
];

const DEMO_BOOKINGS = [
  { id: 'BK-001', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '15/01/2026', startTime: '08:00', endTime: '13:00', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', purpose: 'Practical 1 — Basic Wiring', status: 'Completed' },
  { id: 'BK-002', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '20/01/2026', startTime: '14:00', endTime: '17:00', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2B', purpose: 'Practical 2 — Conduit Installation', status: 'Completed' },
  { id: 'BK-003', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '18/02/2026', startTime: '08:00', endTime: '13:00', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', purpose: 'Practical 3 — Switch & Socket Wiring', status: 'Confirmed' },
  { id: 'BK-004', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '25/02/2026', startTime: '08:00', endTime: '13:00', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2B', purpose: 'Practical 3 — Switch & Socket Wiring', status: 'Confirmed' },
  { id: 'BK-005', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '20/03/2026', startTime: '09:00', endTime: '17:00', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', purpose: 'Practical 4 — Distribution Board', status: 'Confirmed' },
  { id: 'BK-006', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '25/03/2026', startTime: '14:00', endTime: '17:00', courseCode: 'DET20024', courseName: 'Industrial Electrical Installation', class: 'DET3A', purpose: 'Practical 5 — 3-Phase Wiring', status: 'Pending' },
];

const DEMO_USAGE_RECORDS = [
  { id: 'UR-001', bookingId: 'BK-001', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '15/01/2026', startTime: '08:05', endTime: '12:55', duration: '4h 50m', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', semester: '2', activity: 'Basic domestic wiring installation', studentCount: 18, safetyBriefing: true, conditionBefore: 'Good', conditionAfter: 'Good', remarks: 'Session ran smoothly. All tools returned.' },
  { id: 'UR-002', bookingId: 'BK-002', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '20/01/2026', startTime: '14:00', endTime: '17:00', duration: '3h 00m', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2B', semester: '2', activity: 'PVC conduit installation and cable drawing', studentCount: 16, safetyBriefing: true, conditionBefore: 'Good', conditionAfter: 'Good', remarks: '' },
  { id: 'UR-003', bookingId: 'BK-003', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '18/02/2026', startTime: '08:00', endTime: '13:00', duration: '5h 00m', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', semester: '2', activity: 'Switch and socket outlet wiring', studentCount: 18, safetyBriefing: true, conditionBefore: 'Good', conditionAfter: 'Attention Required — one bench power point faulty', remarks: 'Reported faulty power point to supervisor. Maintenance requested.' },
  { id: 'UR-004', bookingId: 'BK-004', lecturerId: 'USR-004', lecturerName: 'Nurul Ain binti Samsudin', date: '25/02/2026', startTime: '08:00', endTime: '13:00', duration: '5h 00m', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2B', semester: '2', activity: 'Switch and socket outlet wiring', studentCount: 15, safetyBriefing: true, conditionBefore: 'Good', conditionAfter: 'Good', remarks: 'One voltage tester returned damaged.' },
  { id: 'UR-005', bookingId: 'BK-005', lecturerId: 'USR-002', lecturerName: 'Siti Rahimah binti Sahari', date: '20/03/2026', startTime: '09:00', endTime: '17:00', duration: '8h 00m', courseCode: 'DET20013', courseName: 'Electrical Wiring Technology', class: 'DET2A', semester: '2', activity: 'Consumer unit / distribution board installation', studentCount: 18, safetyBriefing: true, conditionBefore: 'Good', conditionAfter: 'Good', remarks: '' },
];

const DEMO_MAINTENANCE = [
  { id: 'MR-001', toolId: 'TL-009', toolName: 'Voltage Tester (Non-contact)', assetId: 'EPN-VT-001', issue: 'Cracked casing — returned damaged by student', reportedBy: 'USR-002', reportedByName: 'Siti Rahimah binti Sahari', reportedDate: '10/02/2026', dueDate: '17/02/2026', assignedTo: 'Workshop Technician', status: 'In Progress', remarks: 'Sent to supplier for repair' },
  { id: 'MR-002', toolId: 'TL-015', toolName: 'Fish Tape / Draw Wire', assetId: 'EPN-FS-001', issue: 'Item reported missing after session on 15/03/2026', reportedBy: 'USR-002', reportedByName: 'Siti Rahimah binti Sahari', reportedDate: '15/03/2026', dueDate: '22/03/2026', assignedTo: 'Ahmad Zulkifli bin Hassan', status: 'Pending', remarks: 'Investigation ongoing' },
  { id: 'MR-003', toolId: 'TL-013', toolName: 'Power Drill', assetId: 'EPN-DL-001', issue: 'Scheduled annual service and blade inspection', reportedBy: 'USR-001', reportedByName: 'Ahmad Zulkifli bin Hassan', reportedDate: '01/03/2026', dueDate: '15/03/2026', assignedTo: 'Workshop Technician', status: 'Completed', remarks: 'Serviced and tested. OK.' },
  { id: 'MR-004', toolId: null, toolName: 'Bench Power Point (Station 4)', assetId: 'EPN-BP-004', issue: 'Faulty power point — reported during workshop session on 18/02/2026', reportedBy: 'USR-002', reportedByName: 'Siti Rahimah binti Sahari', reportedDate: '18/02/2026', dueDate: '25/02/2026', assignedTo: 'Electrical Technician', status: 'Pending', remarks: 'Power point isolated. Pending repair.' },
];

const DEMO_SAFETY = [
  { id: 'SI-001', inspectorId: 'USR-001', inspectorName: 'Ahmad Zulkifli bin Hassan', date: '05/01/2026', electricalEquipment: 'Good', emergencyEquipment: 'Good', ppeAvailability: 'Good', defectsFound: 'None', correctiveActions: 'None required', overallStatus: 'Safe', remarks: 'All items in order for new semester.' },
  { id: 'SI-002', inspectorId: 'USR-001', inspectorName: 'Ahmad Zulkifli bin Hassan', date: '05/02/2026', electricalEquipment: 'Attention Required', emergencyEquipment: 'Good', ppeAvailability: 'Good', defectsFound: 'Bench power point Station 4 faulty. One emergency light battery low.', correctiveActions: 'Maintenance request raised for power point. Emergency light battery replaced.', overallStatus: 'Attention Required', remarks: 'Monitor repair progress.' },
  { id: 'SI-003', inspectorId: 'USR-001', inspectorName: 'Ahmad Zulkifli bin Hassan', date: '05/03/2026', electricalEquipment: 'Good', emergencyEquipment: 'Good', ppeAvailability: 'Attention Required', defectsFound: 'Low stock of insulation gloves (only 4 pairs remaining, minimum 10).', correctiveActions: 'Requisition submitted for PPE replenishment.', overallStatus: 'Attention Required', remarks: 'Next inspection due 05/04/2026.' },
];

const DEMO_ACTIVITY_LOG = [
  { id: 'AL-001', userId: 'USR-001', userName: 'Ahmad Zulkifli bin Hassan', role: 'supervisor', action: 'Safety Inspection Recorded', details: 'Inspection SI-001 — Status: Safe', timestamp: '05/01/2026 09:15' },
  { id: 'AL-002', userId: 'USR-002', userName: 'Siti Rahimah binti Sahari', role: 'lecturer', action: 'Tool Borrowed', details: 'TXN-001 — Digital Multimeter x1 by Muhammad Hafiz', timestamp: '15/01/2026 08:05' },
  { id: 'AL-003', userId: 'USR-002', userName: 'Siti Rahimah binti Sahari', role: 'lecturer', action: 'Tool Returned', details: 'TXN-001 — Digital Multimeter x1 returned in Good condition', timestamp: '15/01/2026 12:45' },
  { id: 'AL-004', userId: 'USR-002', userName: 'Siti Rahimah binti Sahari', role: 'lecturer', action: 'Material Issued', details: 'MTX-001 — PVC Cable 1.5mm² 20m to DET2A', timestamp: '15/01/2026 08:10' },
  { id: 'AL-005', userId: 'USR-001', userName: 'Ahmad Zulkifli bin Hassan', role: 'supervisor', action: 'Stock Received', details: 'MTX-004 — PVC Cable 1.5mm² 100m received', timestamp: '01/02/2026 10:00' },
  { id: 'AL-006', userId: 'USR-001', userName: 'Ahmad Zulkifli bin Hassan', role: 'supervisor', action: 'Safety Inspection Recorded', details: 'Inspection SI-002 — Status: Attention Required', timestamp: '05/02/2026 09:30' },
  { id: 'AL-007', userId: 'USR-002', userName: 'Siti Rahimah binti Sahari', role: 'lecturer', action: 'Tool Marked Damaged', details: 'TXN-004 — Voltage Tester cracked casing', timestamp: '10/02/2026 13:10' },
  { id: 'AL-008', userId: 'USR-001', userName: 'Ahmad Zulkifli bin Hassan', role: 'supervisor', action: 'Maintenance Record Created', details: 'MR-001 — Voltage Tester sent for repair', timestamp: '10/02/2026 14:00' },
];

// ── Seed Function ──────────────────────────────────────────────────────────────
function seedData() {
  if (localStorage.getItem(KEYS.SEEDED) === 'true') return;

  setData(KEYS.USERS, DEMO_USERS);
  setData(KEYS.TOOLS, DEMO_TOOLS);
  setData(KEYS.MATERIALS, DEMO_MATERIALS);
  setData(KEYS.TOOL_TRANSACTIONS, DEMO_TOOL_TRANSACTIONS);
  setData(KEYS.MATERIAL_TRANSACTIONS, DEMO_MATERIAL_TRANSACTIONS);
  setData(KEYS.BOOKINGS, DEMO_BOOKINGS);
  setData(KEYS.USAGE_RECORDS, DEMO_USAGE_RECORDS);
  setData(KEYS.MAINTENANCE, DEMO_MAINTENANCE);
  setData(KEYS.SAFETY_INSPECTIONS, DEMO_SAFETY);
  setData(KEYS.ACTIVITY_LOG, DEMO_ACTIVITY_LOG);

  localStorage.setItem(KEYS.SEEDED, 'true');
}

// ── CRUD Helpers ───────────────────────────────────────────────────────────────

// Tools
function getTools() { return getData(KEYS.TOOLS); }
function updateTool(id, changes) {
  const tools = getTools();
  const idx = tools.findIndex(t => t.id === id);
  if (idx !== -1) { tools[idx] = { ...tools[idx], ...changes }; setData(KEYS.TOOLS, tools); }
}

// Tool Transactions
function getTransactions() { return getData(KEYS.TOOL_TRANSACTIONS); }
function addTransaction(obj) {
  const txns = getTransactions();
  txns.unshift(obj);
  setData(KEYS.TOOL_TRANSACTIONS, txns);
}
function updateTransaction(id, changes) {
  const txns = getTransactions();
  const idx = txns.findIndex(t => t.id === id);
  if (idx !== -1) { txns[idx] = { ...txns[idx], ...changes }; setData(KEYS.TOOL_TRANSACTIONS, txns); }
}

// Materials
function getMaterials() { return getData(KEYS.MATERIALS); }
function updateMaterial(id, changes) {
  const mats = getMaterials();
  const idx = mats.findIndex(m => m.id === id);
  if (idx !== -1) { mats[idx] = { ...mats[idx], ...changes }; setData(KEYS.MATERIALS, mats); }
}

// Material Transactions
function getMaterialTransactions() { return getData(KEYS.MATERIAL_TRANSACTIONS); }
function addMaterialTransaction(obj) {
  const txns = getMaterialTransactions();
  txns.unshift(obj);
  setData(KEYS.MATERIAL_TRANSACTIONS, txns);
}

// Bookings
function getBookings() { return getData(KEYS.BOOKINGS); }
function addBooking(obj) {
  const bks = getBookings();
  bks.unshift(obj);
  setData(KEYS.BOOKINGS, bks);
}
function updateBooking(id, changes) {
  const bks = getBookings();
  const idx = bks.findIndex(b => b.id === id);
  if (idx !== -1) { bks[idx] = { ...bks[idx], ...changes }; setData(KEYS.BOOKINGS, bks); }
}

// Usage Records
function getUsageRecords() { return getData(KEYS.USAGE_RECORDS); }
function addUsageRecord(obj) {
  const recs = getUsageRecords();
  recs.unshift(obj);
  setData(KEYS.USAGE_RECORDS, recs);
}

// Maintenance
function getMaintenanceRecords() { return getData(KEYS.MAINTENANCE); }
function addMaintenanceRecord(obj) {
  const recs = getMaintenanceRecords();
  recs.unshift(obj);
  setData(KEYS.MAINTENANCE, recs);
}
function updateMaintenanceRecord(id, changes) {
  const recs = getMaintenanceRecords();
  const idx = recs.findIndex(r => r.id === id);
  if (idx !== -1) { recs[idx] = { ...recs[idx], ...changes }; setData(KEYS.MAINTENANCE, recs); }
}

// Safety Inspections
function getSafetyInspections() { return getData(KEYS.SAFETY_INSPECTIONS); }
function addSafetyInspection(obj) {
  const recs = getSafetyInspections();
  recs.unshift(obj);
  setData(KEYS.SAFETY_INSPECTIONS, recs);
}

// Activity Log
function logActivity(userId, userName, role, action, details) {
  const log = getData(KEYS.ACTIVITY_LOG);
  const now = new Date();
  const ts = now.toLocaleDateString('en-GB').replace(/\//g, '/') + ' ' +
    now.toTimeString().slice(0, 5);
  log.unshift({ id: generateId('AL'), userId, userName, role, action, details, timestamp: ts });
  setData(KEYS.ACTIVITY_LOG, log);
}

// ── Business Logic Helpers ─────────────────────────────────────────────────────

function checkLowStock() {
  return getMaterials().filter(m => m.currentStock <= m.minStockLevel);
}

function checkOverdue() {
  // Returns transactions that are Borrowed but past expectedReturn date
  const txns = getTransactions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueIds = [];
  txns.forEach(t => {
    if (t.status === 'Borrowed' && t.expectedReturn) {
      const parts = t.expectedReturn.split('/');
      const expDate = new Date(parts[2], parts[1] - 1, parts[0]);
      if (expDate < today) {
        overdueIds.push(t.id);
      }
    }
  });
  return overdueIds;
}

function getDashboardStats() {
  const tools = getTools();
  const txns = getTransactions();
  const materials = getMaterials();
  const bookings = getBookings();
  const maintenance = getMaintenanceRecords();
  const safety = getSafetyInspections();

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const sessionsThisMonth = getUsageRecords().filter(u => {
    const parts = u.date.split('/');
    const d = new Date(parts[2], parts[1] - 1, parts[0]);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const lastInspection = safety.length > 0 ? safety[0] : null;
  const inspectionDue = !lastInspection || lastInspection.overallStatus === 'Inspection Due' ? 1 : 0;

  return {
    totalTools: tools.reduce((s, t) => s + t.totalQty, 0),
    toolsBorrowed: txns.filter(t => t.status === 'Borrowed').length,
    toolsOverdueDamagedMissing: txns.filter(t => ['Overdue','Damaged','Missing'].includes(t.status)).length,
    totalMaterialTypes: materials.length,
    materialsLowStock: checkLowStock().length,
    sessionsThisMonth,
    maintenancePending: maintenance.filter(m => m.status === 'Pending' || m.status === 'In Progress').length,
    inspectionsDue: inspectionDue,
  };
}

// ── Session Helpers ────────────────────────────────────────────────────────────
function getCurrentUser() { return getObject(KEYS.CURRENT_USER); }
function setCurrentUser(user) { setObject(KEYS.CURRENT_USER, user); }
function clearCurrentUser() { localStorage.removeItem(KEYS.CURRENT_USER); }

function requireAuth(requiredRole) {
  const user = getCurrentUser();
  if (!user) { window.location.href = 'index.html'; return null; }
  if (requiredRole && user.role !== requiredRole) {
    const map = { supervisor: 'dashboard-supervisor.html', lecturer: 'dashboard-lecturer.html', student: 'dashboard-student.html' };
    window.location.href = map[user.role] || 'index.html';
    return null;
  }
  return user;
}

function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

// ── Init ───────────────────────────────────────────────────────────────────────
seedData();
