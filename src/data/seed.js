// All demo data lives here. No backend, no fetch. Treat as a fixed snapshot
// of a fictional event management company's workspace, dated mid-Q2 2026.

// ----- helpers -----
const now = new Date('2026-05-11T10:00:00Z');
function daysFromNow(d) {
  const x = new Date(now);
  x.setUTCDate(x.getUTCDate() + d);
  return x.toISOString();
}

// ----- company -----
export const company = {
  id: 'co_demo',
  name: 'Demo Events Co.',
  slug: 'demo-events',
  email: 'admin@demo.com',
  phone: '+91-9999900000',
  city: 'Jaipur',
  state: 'Rajasthan',
  country: 'India',
  gstin: '08AAAAA0000A1Z5',
  status: 'ACTIVE',
  billingCycle: 'MONTHLY',
  createdAt: daysFromNow(-180),
};

// ----- users (logins shown on the login page) -----
export const users = [
  // {
  //   id: 'u_super',
  //   name: 'Platform Admin',
  //   email: 'super@easyeventsoft.com',
  //   role: 'SUPER_ADMIN',
  //   companyId: null,
  //   phone: '+91-9999900099',
  //   lastLoginAt: daysFromNow(-1),
  // },
  {
    id: 'u_admin',
    name: 'Riya Sharma',
    email: 'admin@demo.com',
    role: 'COMPANY_ADMIN',
    companyId: 'co_demo',
    phone: '+91-9999900001',
    lastLoginAt: daysFromNow(-1),
  },
  {
    id: 'u_manager',
    name: 'Arjun Mehta',
    email: 'manager@demo.com',
    role: 'EVENT_MANAGER',
    companyId: 'co_demo',
    phone: '+91-9999900002',
    lastLoginAt: daysFromNow(-2),
  },
  {
    id: 'u_staff',
    name: 'Pooja Verma',
    email: 'staff@demo.com',
    role: 'STAFF',
    companyId: 'co_demo',
    phone: '+91-9999900003',
    lastLoginAt: daysFromNow(-3),
  },
  {
    id: 'u_accountant',
    name: 'Sunil Gupta',
    email: 'accounts@demo.com',
    role: 'ACCOUNTANT',
    companyId: 'co_demo',
    phone: '+91-9999900004',
    lastLoginAt: daysFromNow(-1),
  },
];

// ----- subscription plans -----
export const plans = [
  {
    id: 'plan_starter', name: 'Starter',
    priceMonthly: 999, priceYearly: 9999,
    maxUsers: 5, maxEvents: 50,
    features: ['Basic reports', 'Email support'],
    active: true,
  },
  {
    id: 'plan_pro', name: 'Pro',
    priceMonthly: 2499, priceYearly: 24999,
    maxUsers: 20, maxEvents: 500,
    features: ['Advanced reports', 'GST invoices', 'Priority chat support'],
    active: true,
  },
  {
    id: 'plan_business', name: 'Business',
    priceMonthly: 4999, priceYearly: 49999,
    maxUsers: 100, maxEvents: 5000,
    features: ['All Pro features', 'Custom branding', 'Dedicated success manager', 'SLA-backed support'],
    active: true,
  },
];

// ----- categories & subcategories -----
export const categories = [
  {
    id: 'cat_deco', name: 'Decoration', companyId: 'co_demo',
    subcategories: [
      { id: 'sub_floral', name: 'Floral Decoration', categoryId: 'cat_deco' },
      { id: 'sub_stage',  name: 'Stage Decoration',  categoryId: 'cat_deco' },
      { id: 'sub_light',  name: 'Lighting',          categoryId: 'cat_deco' },
    ],
    _count: { vendors: 1 },
  },
  {
    id: 'cat_photo', name: 'Photography', companyId: 'co_demo',
    subcategories: [
      { id: 'sub_wed_photo', name: 'Wedding Photography', categoryId: 'cat_photo' },
      { id: 'sub_candid',    name: 'Candid',              categoryId: 'cat_photo' },
      { id: 'sub_drone',     name: 'Drone Coverage',      categoryId: 'cat_photo' },
    ],
    _count: { vendors: 1 },
  },
  {
    id: 'cat_cater', name: 'Catering', companyId: 'co_demo',
    subcategories: [
      { id: 'sub_veg',     name: 'Veg Catering',     categoryId: 'cat_cater' },
      { id: 'sub_nonveg',  name: 'Non-Veg Catering', categoryId: 'cat_cater' },
      { id: 'sub_live',    name: 'Live Counters',    categoryId: 'cat_cater' },
    ],
    _count: { vendors: 1 },
  },
  {
    id: 'cat_ent', name: 'Entertainment', companyId: 'co_demo',
    subcategories: [
      { id: 'sub_dj',     name: 'DJ',           categoryId: 'cat_ent' },
      { id: 'sub_band',   name: 'Live Band',    categoryId: 'cat_ent' },
      { id: 'sub_anchor', name: 'Anchor / MC',  categoryId: 'cat_ent' },
    ],
    _count: { vendors: 0 },
  },
];

// ----- vendors -----
export const vendors = [
  {
    id: 'v1', name: 'Bloom & Bliss Decorators',
    contactPerson: 'Kabir Singh', phone: '+91-9810000001', email: 'kabir@bloombliss.in',
    category: { id: 'cat_deco', name: 'Decoration' },
    subcategory: { id: 'sub_floral', name: 'Floral Decoration' },
    basePrice: 75000, rating: 5, active: true,
    address: 'Vaishali Nagar, Jaipur',
    notes: 'Reliable for last-minute weddings.',
  },
  {
    id: 'v2', name: 'Lens & Light Studio',
    contactPerson: 'Neha Kapoor', phone: '+91-9810000002', email: 'neha@lenslight.in',
    category: { id: 'cat_photo', name: 'Photography' },
    subcategory: { id: 'sub_candid', name: 'Candid' },
    basePrice: 60000, rating: 4, active: true,
    address: 'C-Scheme, Jaipur',
  },
  {
    id: 'v3', name: 'Royal Spice Caterers',
    contactPerson: 'Mohit Jain', phone: '+91-9810000003', email: 'orders@royalspice.in',
    category: { id: 'cat_cater', name: 'Catering' },
    subcategory: { id: 'sub_nonveg', name: 'Non-Veg Catering' },
    basePrice: 950, rating: 5, active: true,
    notes: 'Per-plate pricing, min 100 guests.',
  },
];

// ----- leads -----
export const leads = [
  {
    id: 'l1',
    name: 'Aakash Khanna',
    phone: '+91-9876500001', email: 'aakash@khanna.in',
    eventType: 'Wedding',
    estimatedBudget: 850000,
    status: 'CONFIRMED',
    source: 'Referral',
    eventDate: daysFromNow(60),
    convertedEventId: 'e1',
    owner: { id: 'u_manager', name: 'Arjun Mehta' },
    notes: 'High-priority — referred by Mehra family.',
  },
  {
    id: 'l2',
    name: 'Sneha Iyer',
    phone: '+91-9876500002', email: 'sneha.iyer@email.com',
    eventType: 'Birthday',
    estimatedBudget: 75000,
    status: 'NEW',
    source: 'Website',
    eventDate: daysFromNow(20),
    owner: { id: 'u_manager', name: 'Arjun Mehta' },
  },
  {
    id: 'l3',
    name: 'Globex Corp',
    phone: '+91-9876500003', email: 'events@globex.com',
    eventType: 'Corporate',
    estimatedBudget: 450000,
    status: 'NEGOTIATION',
    source: 'Walk-in',
    eventDate: daysFromNow(45),
    owner: { id: 'u_manager', name: 'Arjun Mehta' },
    notes: 'Awaiting venue confirmation from their side.',
  },
  {
    id: 'l4',
    name: 'Tanvi Shah',
    phone: '+91-9876500004', email: 'tanvi.shah@email.com',
    eventType: 'Anniversary',
    estimatedBudget: 120000,
    status: 'CONTACTED',
    source: 'Instagram',
    eventDate: daysFromNow(38),
    owner: { id: 'u_admin', name: 'Riya Sharma' },
  },
  {
    id: 'l5',
    name: 'Rohan Malhotra',
    phone: '+91-9876500005', email: 'rohan.m@email.com',
    eventType: 'Wedding',
    estimatedBudget: 1200000,
    status: 'LOST',
    source: 'Referral',
    eventDate: daysFromNow(-15),
    owner: { id: 'u_manager', name: 'Arjun Mehta' },
    notes: 'Chose another vendor; budget conflict.',
  },
];

// ----- events -----
export const events = [
  {
    id: 'e1',
    name: 'Khanna Wedding',
    clientName: 'Aakash Khanna',
    clientPhone: '+91-9876500001',
    clientEmail: 'aakash@khanna.in',
    eventType: 'Wedding',
    venue: 'Rambagh Palace',
    venueAddress: 'Bhawani Singh Rd, Jaipur',
    startDate: daysFromNow(60),
    endDate:   daysFromNow(62),
    guestCount: 350,
    budget: 850000,
    actualSpend: 320000,
    status: 'CONFIRMED',
    description: 'Three-day wedding with sangeet, mehendi, and reception.',
    manager: { id: 'u_manager', name: 'Arjun Mehta', email: 'manager@demo.com' },
    checklist: [
      { item: 'Confirm venue booking', done: true },
      { item: 'Finalize menu',         done: true },
      { item: 'Send invites',          done: false },
      { item: 'Book photographer',     done: true },
      { item: 'Order floral arrangements', done: false },
    ],
    vendors: [
      { id: 'ev1', vendor: vendors[0], agreedPrice: 180000 },
      { id: 'ev2', vendor: vendors[1], agreedPrice: 95000 },
      { id: 'ev3', vendor: vendors[2], agreedPrice: 332500 },
    ],
  },
  {
    id: 'e2',
    name: 'Globex Annual Gala',
    clientName: 'Globex Corp',
    clientPhone: '+91-9876500003',
    clientEmail: 'events@globex.com',
    eventType: 'Corporate',
    venue: 'Jaipur Marriott',
    venueAddress: 'Ashram Marg, Jaipur',
    startDate: daysFromNow(45),
    endDate:   daysFromNow(45),
    guestCount: 200,
    budget: 450000,
    actualSpend: 80000,
    status: 'PLANNING',
    description: 'Annual awards night for Globex Corp employees.',
    manager: { id: 'u_manager', name: 'Arjun Mehta', email: 'manager@demo.com' },
    checklist: [
      { item: 'AV equipment quote',    done: true },
      { item: 'Award trophies design', done: false },
      { item: 'Stage layout approval', done: false },
    ],
    vendors: [
      { id: 'ev4', vendor: vendors[1], agreedPrice: 80000 },
    ],
  },
  {
    id: 'e3',
    name: 'Iyer 25th Anniversary',
    clientName: 'Mahesh Iyer',
    clientPhone: '+91-9876500011',
    eventType: 'Anniversary',
    venue: 'Hotel Clarks Amer',
    startDate: daysFromNow(-15),
    endDate:   daysFromNow(-15),
    guestCount: 120,
    budget: 250000,
    actualSpend: 245000,
    status: 'COMPLETED',
    manager: { id: 'u_manager', name: 'Arjun Mehta', email: 'manager@demo.com' },
    vendors: [],
  },
  {
    id: 'e4',
    name: 'Sharma Engagement',
    clientName: 'Pradeep Sharma',
    clientPhone: '+91-9876500021',
    eventType: 'Engagement',
    venue: 'Hilton Jaipur',
    startDate: daysFromNow(10),
    endDate:   daysFromNow(10),
    guestCount: 150,
    budget: 320000,
    actualSpend: 50000,
    status: 'CONFIRMED',
    manager: { id: 'u_manager', name: 'Arjun Mehta', email: 'manager@demo.com' },
    vendors: [],
  },
];

// ----- tasks -----
export const tasks = [
  { id: 't1', title: 'Finalize floral arrangement', description: 'Color palette: white + dusty pink', eventId: 'e1', event: { id:'e1', name:'Khanna Wedding' }, priority: 'HIGH',   status: 'TODO',        dueDate: daysFromNow(10), assignee: { id: 'u_staff',   name: 'Pooja Verma' } },
  { id: 't2', title: 'Confirm catering menu',       description: 'Veg/non-veg mix per family preference', eventId: 'e1', event: { id:'e1', name:'Khanna Wedding' }, priority: 'HIGH',   status: 'IN_PROGRESS', dueDate: daysFromNow(5),  assignee: { id: 'u_manager', name: 'Arjun Mehta' } },
  { id: 't3', title: 'Stage design draft',          description: '', eventId: 'e2', event: { id:'e2', name:'Globex Annual Gala' }, priority: 'MEDIUM', status: 'TODO',        dueDate: daysFromNow(15), assignee: { id: 'u_staff',   name: 'Pooja Verma' } },
  { id: 't4', title: 'Send save-the-date emails',   description: '', eventId: 'e2', event: { id:'e2', name:'Globex Annual Gala' }, priority: 'LOW',    status: 'DONE',        dueDate: daysFromNow(-5), assignee: { id: 'u_manager', name: 'Arjun Mehta' } },
  { id: 't5', title: 'Book drone team',             description: '', eventId: 'e1', event: { id:'e1', name:'Khanna Wedding' },     priority: 'MEDIUM', status: 'TODO',        dueDate: daysFromNow(20), assignee: { id: 'u_staff',   name: 'Pooja Verma' } },
  { id: 't6', title: 'AV equipment rental',         description: 'Mics + speakers + projector', eventId: 'e2', event: { id:'e2', name:'Globex Annual Gala' }, priority: 'URGENT', status: 'BLOCKED',    dueDate: daysFromNow(7),  assignee: { id: 'u_manager', name: 'Arjun Mehta' } },
];

// ----- payments -----
export const payments = [
  { id: 'p1', direction: 'INCOMING', amount: 300000, method: 'BANK_TRANSFER', status: 'PAID',    reference: 'TXN-9001', paidAt: daysFromNow(-20), event: { id:'e1', name:'Khanna Wedding' }, vendor: null },
  { id: 'p2', direction: 'INCOMING', amount: 150000, method: 'UPI',           status: 'PAID',    reference: 'TXN-9002', paidAt: daysFromNow(-10), event: { id:'e1', name:'Khanna Wedding' }, vendor: null },
  { id: 'p3', direction: 'OUTGOING', amount: 50000,  method: 'BANK_TRANSFER', status: 'PAID',    reference: 'TXN-9003', paidAt: daysFromNow(-8),  event: { id:'e1', name:'Khanna Wedding' }, vendor: { id:'v1', name:'Bloom & Bliss Decorators' } },
  { id: 'p4', direction: 'INCOMING', amount: 100000, method: 'CHEQUE',        status: 'PENDING', reference: 'CHQ-441',  paidAt: daysFromNow(2),   event: { id:'e2', name:'Globex Annual Gala' }, vendor: null },
  { id: 'p5', direction: 'OUTGOING', amount: 30000,  method: 'UPI',           status: 'PAID',    reference: 'TXN-9005', paidAt: daysFromNow(-2),  event: { id:'e2', name:'Globex Annual Gala' }, vendor: { id:'v2', name:'Lens & Light Studio' } },
  { id: 'p6', direction: 'INCOMING', amount: 245000, method: 'BANK_TRANSFER', status: 'PAID',    reference: 'TXN-9006', paidAt: daysFromNow(-16), event: { id:'e3', name:'Iyer 25th Anniversary' }, vendor: null },
];

// ----- expenses -----
export const expenses = [
  { id: 'x1', title: 'Venue advance',       amount: 200000, category: 'Venue',     spentAt: daysFromNow(-25), event: { id:'e1', name:'Khanna Wedding' } },
  { id: 'x2', title: 'Decor materials',     amount: 70000,  category: 'Decoration',spentAt: daysFromNow(-15), event: { id:'e1', name:'Khanna Wedding' } },
  { id: 'x3', title: 'Office stationery',   amount: 4500,   category: 'Office',    spentAt: daysFromNow(-7),  event: null },
  { id: 'x4', title: 'Marketing — Instagram', amount: 25000,category: 'Marketing', spentAt: daysFromNow(-5),  event: null },
  { id: 'x5', title: 'AV rental advance',   amount: 50000,  category: 'AV',        spentAt: daysFromNow(-3),  event: { id:'e2', name:'Globex Annual Gala' } },
  { id: 'x6', title: 'Travel — site visit', amount: 8500,   category: 'Travel',    spentAt: daysFromNow(-12), event: { id:'e1', name:'Khanna Wedding' } },
];

// ----- invoices -----
export const invoices = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2026-0001',
    type: 'INVOICE',
    status: 'PARTIAL',
    clientName: 'Aakash Khanna',
    clientAddress: '14, Civil Lines, Jaipur — 302006',
    clientGstin: '',
    event: { id: 'e1', name: 'Khanna Wedding' },
    issueDate: daysFromNow(-25),
    dueDate:   daysFromNow(5),
    items: [
      { description: 'Wedding event management — full service', quantity: 1, unitPrice: 500000, gstRate: 18 },
      { description: 'Floral decoration package',               quantity: 1, unitPrice: 180000, gstRate: 18 },
    ],
    subtotal: 680000,
    gst: 122400,
    discount: 0,
    total: 802400,
    amountPaid: 450000,
    notes: 'Balance payable 7 days before the event.',
    terms: 'Cancellations within 30 days of the event forfeit 50% of paid amount.',
  },
  {
    id: 'inv2',
    invoiceNumber: 'INV-2026-0002',
    type: 'INVOICE',
    status: 'PAID',
    clientName: 'Mahesh Iyer',
    clientAddress: 'B-12, Malviya Nagar, Jaipur',
    event: { id: 'e3', name: 'Iyer 25th Anniversary' },
    issueDate: daysFromNow(-30),
    dueDate:   daysFromNow(-16),
    items: [
      { description: 'Anniversary event package', quantity: 1, unitPrice: 220000, gstRate: 18 },
    ],
    subtotal: 220000, gst: 39600, discount: 14600, total: 245000,
    amountPaid: 245000,
  },
  {
    id: 'inv3',
    invoiceNumber: 'QTN-2026-0003',
    type: 'QUOTATION',
    status: 'SENT',
    clientName: 'Globex Corp',
    clientAddress: 'Tech Park, Jaipur',
    clientGstin: '08GLOBE0000G1Z3',
    event: { id: 'e2', name: 'Globex Annual Gala' },
    issueDate: daysFromNow(-10),
    dueDate:   daysFromNow(20),
    items: [
      { description: 'Corporate gala — venue & coordination', quantity: 1, unitPrice: 250000, gstRate: 18 },
      { description: 'AV equipment + crew',                    quantity: 1, unitPrice: 90000,  gstRate: 18 },
      { description: 'Award trophies (per piece)',             quantity: 20, unitPrice: 1500,  gstRate: 12 },
    ],
    subtotal: 370000, gst: 64720, discount: 0, total: 434720,
    amountPaid: 0,
  },
  {
    id: 'inv4',
    invoiceNumber: 'INV-2026-0004',
    type: 'INVOICE',
    status: 'OVERDUE',
    clientName: 'Tanvi Shah',
    event: null,
    issueDate: daysFromNow(-40),
    dueDate:   daysFromNow(-10),
    items: [{ description: 'Pre-event consultation', quantity: 1, unitPrice: 15000, gstRate: 18 }],
    subtotal: 15000, gst: 2700, discount: 0, total: 17700,
    amountPaid: 0,
  },
];

// ----- activity logs -----
export const activityLogs = [
  { id: 'log1', createdAt: daysFromNow(-0.04), user: { id:'u_admin',   name:'Riya Sharma',  role:'COMPANY_ADMIN' }, action: 'UPDATE',  entity: 'Event',   entityId: 'e1', description: 'Updated event "Khanna Wedding" — status changed PLANNING → CONFIRMED', previousValue: { status: 'PLANNING' }, newValue: { status: 'CONFIRMED' }, ipAddress: '203.0.113.10', userAgent: 'Mozilla/5.0 (Mac) Safari' },
  { id: 'log2', createdAt: daysFromNow(-0.1),  user: { id:'u_manager', name:'Arjun Mehta',  role:'EVENT_MANAGER' }, action: 'CREATE',  entity: 'Task',    entityId: 't1', description: 'Created task "Finalize floral arrangement"', previousValue: null, newValue: { title: 'Finalize floral arrangement', status: 'TODO', priority: 'HIGH' } },
  { id: 'log3', createdAt: daysFromNow(-0.5),  user: { id:'u_accountant', name:'Sunil Gupta', role:'ACCOUNTANT' }, action: 'CREATE',  entity: 'Payment', entityId: 'p2', description: 'Recorded incoming payment ₹1,50,000 for Khanna Wedding', previousValue: null, newValue: { amount: 150000, status: 'PAID' } },
  { id: 'log4', createdAt: daysFromNow(-1.2),  user: { id:'u_admin',   name:'Riya Sharma',  role:'COMPANY_ADMIN' }, action: 'CONVERT', entity: 'Lead',    entityId: 'l1', description: 'Converted lead "Aakash Khanna" → event "Khanna Wedding"', previousValue: { status: 'NEGOTIATION' }, newValue: { status: 'CONFIRMED', convertedEventId: 'e1' } },
  { id: 'log5', createdAt: daysFromNow(-1.5),  user: { id:'u_manager', name:'Arjun Mehta',  role:'EVENT_MANAGER' }, action: 'ASSIGN',  entity: 'Vendor',  entityId: 'v1', description: 'Assigned vendor "Bloom & Bliss Decorators" to event "Khanna Wedding"' },
  { id: 'log6', createdAt: daysFromNow(-2),    user: { id:'u_admin',   name:'Riya Sharma',  role:'COMPANY_ADMIN' }, action: 'LOGIN',   entity: 'Auth', description: 'Signed in from 203.0.113.10' },
  { id: 'log7', createdAt: daysFromNow(-2.5),  user: { id:'u_accountant', name:'Sunil Gupta', role:'ACCOUNTANT' }, action: 'CREATE',  entity: 'Invoice', entityId: 'inv1', description: 'Generated invoice INV-2026-0001 for ₹8,02,400' },
  { id: 'log8', createdAt: daysFromNow(-3),    user: { id:'u_manager', name:'Arjun Mehta',  role:'EVENT_MANAGER' }, action: 'UPDATE',  entity: 'Task',    entityId: 't4', description: 'Marked task "Send save-the-date emails" as DONE', previousValue: { status: 'IN_PROGRESS' }, newValue: { status: 'DONE' } },
  { id: 'log9', createdAt: daysFromNow(-4),    user: { id:'u_admin',   name:'Riya Sharma',  role:'COMPANY_ADMIN' }, action: 'CREATE',  entity: 'Vendor',  entityId: 'v3', description: 'Added vendor "Royal Spice Caterers"' },
  { id: 'log10',createdAt: daysFromNow(-5),    user: { id:'u_manager', name:'Arjun Mehta',  role:'EVENT_MANAGER' }, action: 'DELETE',  entity: 'Lead',    entityId: 'l99', description: 'Deleted lead "Test entry"' },
];

// ----- super-admin: companies -----
export const companies = [
  { ...company, _count: { users: 5 }, subscriptionPlan: plans[1], subscriptionPlanId: 'plan_pro', subscriptionEnd: daysFromNow(30) },
  {
    id: 'co_002', name: 'Stellar Soirees', slug: 'stellar-soirees',
    email: 'hi@stellarsoirees.com', phone: '+91-8800000002',
    city: 'Mumbai', state: 'Maharashtra', country: 'India',
    status: 'ACTIVE', billingCycle: 'YEARLY',
    createdAt: daysFromNow(-90),
    _count: { users: 8 },
    subscriptionPlan: plans[2], subscriptionPlanId: 'plan_business',
    subscriptionEnd: daysFromNow(180),
  },
  {
    id: 'co_003', name: 'Confetti & Co.', slug: 'confetti-co',
    email: 'admin@confettiandco.in', phone: '+91-8800000003',
    city: 'Bengaluru', state: 'Karnataka', country: 'India',
    status: 'TRIAL', billingCycle: 'MONTHLY',
    createdAt: daysFromNow(-7),
    _count: { users: 2 },
    subscriptionPlan: plans[0], subscriptionPlanId: 'plan_starter',
    subscriptionEnd: daysFromNow(7),
  },
  {
    id: 'co_004', name: 'Crescendo Events', slug: 'crescendo',
    email: 'team@crescendoevents.in', phone: '+91-8800000004',
    city: 'Delhi', state: 'Delhi', country: 'India',
    status: 'SUSPENDED', billingCycle: 'MONTHLY',
    createdAt: daysFromNow(-300),
    _count: { users: 3 },
    subscriptionPlan: null,
    subscriptionEnd: daysFromNow(-15),
  },
  {
    id: 'co_005', name: 'Marquee Moments', slug: 'marquee',
    email: 'contact@marqueemoments.in', phone: '+91-8800000005',
    city: 'Hyderabad', state: 'Telangana', country: 'India',
    status: 'ACTIVE', billingCycle: 'MONTHLY',
    createdAt: daysFromNow(-200),
    _count: { users: 12 },
    subscriptionPlan: plans[1], subscriptionPlanId: 'plan_pro',
    subscriptionEnd: daysFromNow(15),
  },
];

// ----- dashboard summary (pre-computed) -----
export const dashboardSummary = {
  revenueYTD:  795000,
  expensesYTD: 358000,
  profitYTD:   437000,
  pendingPayments: payments.filter((p) => p.status === 'PENDING').slice(0, 5),
  upcomingEvents:  events.filter((e) => e.status === 'CONFIRMED' || e.status === 'PLANNING')
                          .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
                          .slice(0, 5),
  leadFunnel: ['NEW','CONTACTED','NEGOTIATION','CONFIRMED','LOST'].map((s) => ({
    status: s,
    _count: leads.filter((l) => l.status === s).length,
  })).filter((x) => x._count > 0),
  revenueByMonth: [
    { month: '2025-12', total: 60000 },
    { month: '2026-01', total: 95000 },
    { month: '2026-02', total: 140000 },
    { month: '2026-03', total: 175000 },
    { month: '2026-04', total: 230000 },
    { month: '2026-05', total: 95000 },
  ],
  recentActivities: activityLogs.slice(0, 8),
};

// ----- reports -----
export const reports = {
  revenue: {
    total: 795000,
    byMethod: [
      { method: 'BANK_TRANSFER', total: 545000 },
      { method: 'UPI',           total: 150000 },
      { method: 'CHEQUE',        total: 100000 },
    ],
    byMonth: [
      { month: '2025-12', total: 60000 },
      { month: '2026-01', total: 95000 },
      { month: '2026-02', total: 140000 },
      { month: '2026-03', total: 175000 },
      { month: '2026-04', total: 230000 },
      { month: '2026-05', total: 95000 },
    ],
  },
  expenses: {
    total: 358000,
    byCategory: [
      { category: 'Venue',      total: 200000 },
      { category: 'Decoration', total: 70000 },
      { category: 'AV',         total: 50000 },
      { category: 'Marketing',  total: 25000 },
      { category: 'Travel',     total: 8500 },
      { category: 'Office',     total: 4500 },
    ],
  },
  events: {
    byStatus: ['PLANNING','CONFIRMED','ONGOING','COMPLETED','CANCELLED'].map((s) => ({
      status: s,
      _count: events.filter((e) => e.status === s).length,
    })).filter((x) => x._count > 0),
    byType: Array.from(new Set(events.map((e) => e.eventType))).map((t) => ({
      eventType: t,
      _count: events.filter((e) => e.eventType === t).length,
    })),
  },
  leads: {
    byStatus: ['NEW','CONTACTED','NEGOTIATION','CONFIRMED','LOST'].map((s) => ({
      status: s,
      _count: leads.filter((l) => l.status === s).length,
    })).filter((x) => x._count > 0),
    conversionRate: 20.0,
  },
};

// ----- platform analytics (super admin) -----
export const platformAnalytics = {
  totalCompanies: companies.length,
  activeCompanies: companies.filter((c) => c.status === 'ACTIVE').length,
  trialCompanies: companies.filter((c) => c.status === 'TRIAL').length,
  suspendedCompanies: companies.filter((c) => c.status === 'SUSPENDED').length,
  totalUsers: 30,
  companiesByMonth: [
    { month: '2025-08', count: 1 },
    { month: '2025-10', count: 1 },
    { month: '2025-12', count: 0 },
    { month: '2026-02', count: 2 },
    { month: '2026-04', count: 1 },
  ],
  recentSignups: companies.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
};
