import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDb, writeDb, resetDb } from './db.js';
import { getMatchesForCompany } from './aiMatcher.js';
import { sendContractNotification } from './emailService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to generate unique IDs
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

// ==========================================
// 1. COMPANIES & AUTH
// ==========================================

// Get all registered companies (public profile without passwords)
app.get('/api/companies', (req, res) => {
  const db = readDb();
  const sanitized = (db.companies || []).map(({ password, ...rest }) => rest);
  res.json({ success: true, companies: sanitized });
});

// Register a new company account
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, industry, location, description } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Company Name and Corporate Email are required.' });
  }

  const db = readDb();
  const existing = db.companies.find(
    c => c.email.toLowerCase() === email.trim().toLowerCase() || 
         c.name.toLowerCase() === name.trim().toLowerCase()
  );

  if (existing) {
    return res.status(400).json({ 
      success: false, 
      error: `An account for "${existing.name}" (${existing.email}) already exists. Please sign in instead.` 
    });
  }

  const newCompany = {
    id: generateId('comp'),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password || 'password123',
    industry: industry || 'Manufacturing & Industrial',
    location: location || 'Regional Facility',
    description: description || 'Industrial facility committed to zero-waste circular supply chains.',
    verified: true,
    createdAt: new Date().toISOString()
  };

  db.companies.push(newCompany);
  writeDb(db);

  const { password: _, ...companyProfile } = newCompany;
  res.status(201).json({ 
    success: true, 
    company: companyProfile, 
    message: 'Company account created successfully!' 
  });
});

// Login to an existing company account
app.post('/api/auth/login', (req, res) => {
  const { email, name, password } = req.body;

  if (!email && !name) {
    return res.status(400).json({ success: false, error: 'Company Email or Name is required.' });
  }

  const db = readDb();
  const searchTerm = (email || name || '').trim().toLowerCase();
  
  const company = db.companies.find(
    c => c.email.toLowerCase() === searchTerm || c.name.toLowerCase() === searchTerm
  );

  if (!company) {
    return res.status(404).json({ 
      success: false, 
      error: 'Company account not found. Please register your company first.' 
    });
  }

  // If password provided and company has password, verify it
  if (password && company.password && company.password !== password) {
    return res.status(401).json({ success: false, error: 'Incorrect password.' });
  }

  const { password: _, ...companyProfile } = company;
  res.json({ success: true, company: companyProfile });
});

// ==========================================
// ORGANIZATION & TEAM MANAGEMENT
// ==========================================
app.get('/api/organization/:companyId/members', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();
  if (!db.teamMembers) db.teamMembers = {};

  const company = db.companies.find(c => c.id === companyId);
  if (!db.teamMembers[companyId] || db.teamMembers[companyId].length === 0) {
    // Seed default admin member
    const initialAdmin = {
      id: '#1',
      email: company ? company.email : 'admin@greenvalley.com',
      role: 'Admin',
      joinedDate: '02/10/2026'
    };
    db.teamMembers[companyId] = [initialAdmin];
    writeDb(db);
  }

  res.json({ 
    success: true, 
    members: db.teamMembers[companyId],
    company: company ? { name: company.name, industry: company.industry, location: company.location } : null
  });
});

app.post('/api/organization/:companyId/members', (req, res) => {
  const { companyId } = req.params;
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and temporary password are required.' });
  }

  const db = readDb();
  if (!db.teamMembers) db.teamMembers = {};
  if (!db.teamMembers[companyId]) db.teamMembers[companyId] = [];

  const newId = `#${db.teamMembers[companyId].length + 1}`;
  const now = new Date();
  const joinedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

  const member = {
    id: newId,
    email: email.trim(),
    role: role || 'Member',
    joinedDate
  };

  db.teamMembers[companyId].push(member);
  writeDb(db);

  res.status(201).json({ success: true, member });
});

app.patch('/api/organization/:companyId/members/:memberId', (req, res) => {
  const { companyId, memberId } = req.params;
  const { role, action } = req.body;

  const db = readDb();
  if (!db.teamMembers || !db.teamMembers[companyId]) {
    return res.status(404).json({ success: false, error: 'Team list not found' });
  }

  if (action === 'delete') {
    db.teamMembers[companyId] = db.teamMembers[companyId].filter(m => m.id !== memberId);
    writeDb(db);
    return res.json({ success: true, message: 'Member removed' });
  }

  const member = db.teamMembers[companyId].find(m => m.id === memberId);
  if (!member) {
    return res.status(404).json({ success: false, error: 'Member not found' });
  }

  if (role) {
    member.role = role;
  } else {
    // Toggle role
    member.role = member.role === 'Admin' ? 'Member' : 'Admin';
  }

  writeDb(db);
  res.json({ success: true, member });
});

// FACILITIES MANAGEMENT
app.get('/api/facilities/:companyId', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();
  if (!db.facilities) db.facilities = {};
  
  const company = db.companies.find(c => c.id === companyId);
  if (!db.facilities[companyId] || db.facilities[companyId].length === 0) {
    db.facilities[companyId] = [
      {
        id: 'fac_1',
        name: 'Main Processing & Extraction Plant',
        location: company?.location || 'Central Industrial Area',
        type: 'Primary Production',
        storageCapacity: '1,200 Tons',
        operatingStatus: 'Operational'
      },
      {
        id: 'fac_2',
        name: 'Secondary Material Storage & Rail Yard',
        location: company?.location || 'Logistics Corridor',
        type: 'Byproduct Storage & Freight Dispatch',
        storageCapacity: '800 Tons',
        operatingStatus: 'Operational'
      }
    ];
    writeDb(db);
  }

  res.json({ success: true, facilities: db.facilities[companyId] });
});

app.post('/api/facilities/:companyId', (req, res) => {
  const { companyId } = req.params;
  const { name, location, type, storageCapacity } = req.body;

  const db = readDb();
  if (!db.facilities) db.facilities = {};
  if (!db.facilities[companyId]) db.facilities[companyId] = [];

  const facility = {
    id: `fac_${Date.now()}`,
    name: name || 'New Facility Unit',
    location: location || 'Regional Facility',
    type: type || 'Manufacturing Unit',
    storageCapacity: storageCapacity || '500 Tons',
    operatingStatus: 'Operational'
  };

  db.facilities[companyId].push(facility);
  writeDb(db);
  res.status(201).json({ success: true, facility });
});

// ==========================================
// 2. WASTE LISTINGS (Items for sale)
// ==========================================

// Get all waste listings
app.get('/api/waste-listings', (req, res) => {
  const { category, search, companyId } = req.query;
  const db = readDb();
  let listings = db.wasteListings || [];

  if (companyId) {
    listings = listings.filter(w => w.companyId === companyId);
  }
  if (category && category !== 'All') {
    listings = listings.filter(w => w.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    listings = listings.filter(w =>
      w.title.toLowerCase().includes(s) ||
      w.description.toLowerCase().includes(s) ||
      w.companyName.toLowerCase().includes(s) ||
      w.location.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, listings });
});

// Create waste listing
app.post('/api/waste-listings', (req, res) => {
  const {
    companyId,
    companyName,
    companyEmail,
    title,
    category,
    quantity,
    unit,
    pricePerUnit,
    purityPercentage,
    frequency,
    location,
    description
  } = req.body;

  if (!companyId || !title || !quantity || !pricePerUnit) {
    return res.status(400).json({ success: false, error: 'Missing required listing fields.' });
  }

  const db = readDb();
  const newListing = {
    id: generateId('waste'),
    companyId,
    companyName: companyName || 'Verified Partner',
    companyEmail: companyEmail || '',
    title: title.trim(),
    category: category || 'General Industrial Waste',
    quantity: Number(quantity),
    unit: unit || 'Tons',
    pricePerUnit: Number(pricePerUnit),
    purityPercentage: purityPercentage ? Number(purityPercentage) : 95,
    frequency: frequency || 'One-time Batch',
    location: location || 'Regional Facility',
    description: description || '',
    createdAt: new Date().toISOString()
  };

  db.wasteListings.unshift(newListing);
  writeDb(db);

  res.status(201).json({ success: true, listing: newListing });
});

// Delete waste listing
app.delete('/api/waste-listings/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.wasteListings = db.wasteListings.filter(w => w.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Listing deleted.' });
});

// ==========================================
// 3. REQUIREMENTS (Raw Material Needs)
// ==========================================

// Get all requirements
app.get('/api/requirements', (req, res) => {
  const { category, search, companyId } = req.query;
  const db = readDb();
  let requirements = db.requirements || [];

  if (companyId) {
    requirements = requirements.filter(r => r.companyId === companyId);
  }
  if (category && category !== 'All') {
    requirements = requirements.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const s = search.toLowerCase();
    requirements = requirements.filter(r =>
      r.title.toLowerCase().includes(s) ||
      r.description.toLowerCase().includes(s) ||
      r.companyName.toLowerCase().includes(s) ||
      r.location.toLowerCase().includes(s)
    );
  }

  res.json({ success: true, requirements });
});

// Create requirement
app.post('/api/requirements', (req, res) => {
  const {
    companyId,
    companyName,
    companyEmail,
    title,
    category,
    quantityNeeded,
    unit,
    maxPricePerUnit,
    urgency,
    location,
    description
  } = req.body;

  if (!companyId || !title || !quantityNeeded || !maxPricePerUnit) {
    return res.status(400).json({ success: false, error: 'Missing required requirement fields.' });
  }

  const db = readDb();
  const newRequirement = {
    id: generateId('req'),
    companyId,
    companyName: companyName || 'Verified Buyer',
    companyEmail: companyEmail || '',
    title: title.trim(),
    category: category || 'Raw Materials',
    quantityNeeded: Number(quantityNeeded),
    unit: unit || 'Tons',
    maxPricePerUnit: Number(maxPricePerUnit),
    urgency: urgency || 'Continuous Contract',
    location: location || 'Regional Plant',
    description: description || '',
    createdAt: new Date().toISOString()
  };

  db.requirements.unshift(newRequirement);
  writeDb(db);

  res.status(201).json({ success: true, requirement: newRequirement });
});

// Delete requirement
app.delete('/api/requirements/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.requirements = db.requirements.filter(r => r.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Requirement deleted.' });
});

// ==========================================
// COMMON DASHBOARD (Global Live Stats for all companies)
// ==========================================
app.get('/api/dashboard/common', (req, res) => {
  const db = readDb();
  const companies = db.companies || [];
  const wasteListings = db.wasteListings || [];
  const requirements = db.requirements || [];
  const history = db.history || [];
  const deals = db.dealRequests || [];

  const totalWasteTonnes = wasteListings.reduce((sum, w) => sum + (Number(w.quantity) || 0), 0);
  const totalDemandTonnes = requirements.reduce((sum, r) => sum + (Number(r.quantityNeeded) || 0), 0);
  const totalDivertedTonnes = history.reduce((sum, h) => sum + (Number(h.landfillDivertedTonnes) || 0), 0);
  const totalCo2SavedTonnes = history.reduce((sum, h) => sum + (Number(h.co2SavedTonnes) || 0), 0);
  const totalTradeValue = history.reduce((sum, h) => sum + (Number(h.totalValue) || 0), 0);

  // Active categories breakdown
  const categoryStats = {};
  wasteListings.forEach(w => {
    categoryStats[w.category] = (categoryStats[w.category] || 0) + 1;
  });

  res.json({
    success: true,
    stats: {
      totalCompaniesCount: companies.length,
      totalActiveWasteStreams: wasteListings.length,
      totalWasteTonnes,
      totalActiveRequirements: requirements.length,
      totalDemandTonnes,
      totalCompletedDeals: history.length,
      totalDivertedTonnes: Math.round(totalDivertedTonnes * 10) / 10,
      totalCo2SavedTonnes: Math.round(totalCo2SavedTonnes * 10) / 10,
      totalTradeValue,
      activeNegotiationsCount: deals.filter(d => d.status === 'pending' || d.status === 'accepted').length
    },
    categoryStats,
    recentHistory: history.slice(0, 5),
    latestListings: wasteListings.slice(0, 4)
  });
});

// ==========================================
// 4. AI MATCHMAKER
// ==========================================

app.get('/api/ai/matches/:companyId', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();

  const results = getMatchesForCompany(
    companyId,
    db.requirements || [],
    db.wasteListings || []
  );

  res.json({
    success: true,
    companyId,
    ...results
  });
});

// ==========================================
// 5. DEAL REQUESTS & WORKFLOW
// ==========================================

// Get deals for a company (both sent and received)
app.get('/api/deals/:companyId', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();
  const deals = db.dealRequests || [];

  const sentRequests = deals.filter(d => d.buyerCompanyId === companyId);
  const receivedRequests = deals.filter(d => d.sellerCompanyId === companyId);

  res.json({
    success: true,
    sentRequests: sentRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    receivedRequests: receivedRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// Create new deal request (Buy Request)
app.post('/api/deals', (req, res) => {
  const {
    wasteListingId,
    wasteTitle,
    buyerCompanyId,
    buyerCompanyName,
    buyerCompanyEmail,
    sellerCompanyId,
    sellerCompanyName,
    sellerCompanyEmail,
    requestedQuantity,
    unit,
    offeredPricePerUnit,
    initialMessage
  } = req.body;

  if (!wasteListingId || !buyerCompanyId || !sellerCompanyId || !requestedQuantity || !offeredPricePerUnit) {
    return res.status(400).json({ success: false, error: 'Missing deal request details.' });
  }

  const db = readDb();
  const dealId = generateId('deal');
  const totalValue = Number(requestedQuantity) * Number(offeredPricePerUnit);

  const newDeal = {
    id: dealId,
    wasteListingId,
    wasteTitle: wasteTitle || 'Industrial Material Batch',
    buyerCompanyId,
    buyerCompanyName,
    buyerCompanyEmail,
    sellerCompanyId,
    sellerCompanyName,
    sellerCompanyEmail,
    requestedQuantity: Number(requestedQuantity),
    unit: unit || 'Tons',
    offeredPricePerUnit: Number(offeredPricePerUnit),
    totalValue,
    status: 'pending', // pending, accepted, declined, completed
    initialMessage: initialMessage || 'We are interested in purchasing this waste byproduct.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.dealRequests.unshift(newDeal);

  // Initialize first chat message if message was provided
  const chatMsg = {
    id: generateId('msg'),
    dealRequestId: dealId,
    senderCompanyId: buyerCompanyId,
    senderCompanyName: buyerCompanyName,
    receiverCompanyId: sellerCompanyId,
    receiverCompanyName: sellerCompanyName,
    text: initialMessage || `Hi ${sellerCompanyName}, we have initiated a purchase request for ${requestedQuantity} ${unit} of "${wasteTitle}" at ₹${offeredPricePerUnit}/${unit}.`,
    createdAt: new Date().toISOString()
  };

  if (!db.chatMessages) db.chatMessages = [];
  db.chatMessages.push(chatMsg);

  writeDb(db);

  res.status(201).json({ success: true, deal: newDeal });
});

// Update deal status (accept, decline, complete)
app.patch('/api/deals/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, finalPrice, finalQuantity, notes } = req.body;

  const db = readDb();
  const deal = db.dealRequests.find(d => d.id === id);

  if (!deal) {
    return res.status(404).json({ success: false, error: 'Deal request not found.' });
  }

  deal.status = status;
  deal.updatedAt = new Date().toISOString();

  if (finalPrice) deal.offeredPricePerUnit = Number(finalPrice);
  if (finalQuantity) deal.requestedQuantity = Number(finalQuantity);
  deal.totalValue = deal.offeredPricePerUnit * deal.requestedQuantity;

  // Add system message to chat log
  if (!db.chatMessages) db.chatMessages = [];
  db.chatMessages.push({
    id: generateId('sys_msg'),
    dealRequestId: id,
    senderCompanyId: 'system',
    senderCompanyName: 'System Alert',
    receiverCompanyId: 'both',
    receiverCompanyName: 'Both',
    text: `⚡ Deal status updated to: "${status.toUpperCase()}" by company representative.`,
    createdAt: new Date().toISOString(),
    isSystem: true
  });

  // If deal is marked completed, log it into Transaction History and automatically update/remove listings!
  if (status === 'completed') {
    const qty = deal.requestedQuantity;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Remove or reduce quantity from the Seller's Waste Listing
    if (deal.wasteListingId) {
      const wasteListingIndex = db.wasteListings.findIndex(w => w.id === deal.wasteListingId);
      if (wasteListingIndex !== -1) {
        const wasteItem = db.wasteListings[wasteListingIndex];
        wasteItem.quantity -= qty;
        if (wasteItem.quantity <= 0) {
          // Completely fulfilled - remove from available public listings!
          db.wasteListings.splice(wasteListingIndex, 1);
        }
      }
    }

    // 2. Remove or reduce quantity from the Buyer's matching Requirement
    if (deal.buyerCompanyId) {
      const normalizedWasteTitle = (deal.wasteTitle || '').toLowerCase();
      const reqIndex = db.requirements.findIndex(r => 
        r.companyId === deal.buyerCompanyId && 
        (normalizedWasteTitle.includes(r.title.toLowerCase()) || r.title.toLowerCase().includes(normalizedWasteTitle))
      );
      if (reqIndex !== -1) {
        const reqItem = db.requirements[reqIndex];
        reqItem.quantityNeeded -= qty;
        if (reqItem.quantityNeeded <= 0) {
          // Completely fulfilled - remove from active public requirements!
          db.requirements.splice(reqIndex, 1);
        }
      }
    }

    // 3. Record permanent transaction in History with exact date & time
    const historyItem = {
      id: generateId('hist'),
      dealRequestId: deal.id,
      wasteTitle: deal.wasteTitle,
      sellerCompanyId: deal.sellerCompanyId,
      sellerCompanyName: deal.sellerCompanyName,
      buyerCompanyId: deal.buyerCompanyId,
      buyerCompanyName: deal.buyerCompanyName,
      quantity: qty,
      unit: deal.unit,
      finalPricePerUnit: deal.offeredPricePerUnit,
      totalValue: deal.totalValue,
      completedAt: now.toISOString(),
      completedDate: formattedDate,
      completedTime: formattedTime,
      formattedDateTime: `${formattedDate} at ${formattedTime}`,
      landfillDivertedTonnes: qty,
      co2SavedTonnes: Math.round(qty * 0.6 * 10) / 10,
      notes: notes || 'Contract executed & materials successfully transferred.'
    };

    if (!db.history) db.history = [];
    db.history.unshift(historyItem);
  }

  // 4. Send email notifications to BOTH companies when contract is accepted or finalized
  let emailDispatch = null;
  if (status === 'accepted' || status === 'completed') {
    try {
      const emailResult = await sendContractNotification({ deal, eventType: status, db });
      if (emailResult.success && emailResult.notifications) {
        if (!db.emailNotifications) db.emailNotifications = [];
        db.emailNotifications.unshift(...emailResult.notifications);
        emailDispatch = {
          success: true,
          count: emailResult.count,
          buyerEmail: emailResult.buyerEmail,
          sellerEmail: emailResult.sellerEmail,
          eventType: status
        };
      }
    } catch (emailErr) {
      console.error('Email dispatch error on status change:', emailErr);
    }
  }

  writeDb(db);
  res.json({ success: true, deal, emailDispatch });
});

// ==========================================
// 6. IN-APP CHAT
// ==========================================

// Get chat messages for a deal
app.get('/api/chat/:dealRequestId', (req, res) => {
  const { dealRequestId } = req.params;
  const db = readDb();
  const messages = (db.chatMessages || []).filter(m => m.dealRequestId === dealRequestId);
  res.json({ success: true, messages });
});

// Send chat message
app.post('/api/chat/:dealRequestId', (req, res) => {
  const { dealRequestId } = req.params;
  const { senderCompanyId, senderCompanyName, receiverCompanyId, receiverCompanyName, text } = req.body;

  if (!text || !senderCompanyId) {
    return res.status(400).json({ success: false, error: 'Sender and text are required.' });
  }

  const db = readDb();
  const message = {
    id: generateId('msg'),
    dealRequestId,
    senderCompanyId,
    senderCompanyName: senderCompanyName || 'Representative',
    receiverCompanyId: receiverCompanyId || '',
    receiverCompanyName: receiverCompanyName || '',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  if (!db.chatMessages) db.chatMessages = [];
  db.chatMessages.push(message);

  writeDb(db);
  res.status(201).json({ success: true, message });
});

// ==========================================
// 7. TRANSACTION HISTORY & ESG IMPACT
// ==========================================

app.get('/api/history/:companyId', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();
  const history = db.history || [];

  // Companies we bought from (I was buyer)
  const boughtFrom = history.filter(h => h.buyerCompanyId === companyId);

  // Companies who bought from us (I was seller)
  const soldTo = history.filter(h => h.sellerCompanyId === companyId);

  // ESG & Economic aggregates
  const totalWasteDiverted = history
    .filter(h => h.buyerCompanyId === companyId || h.sellerCompanyId === companyId)
    .reduce((sum, h) => sum + (h.landfillDivertedTonnes || 0), 0);

  const totalCo2Saved = history
    .filter(h => h.buyerCompanyId === companyId || h.sellerCompanyId === companyId)
    .reduce((sum, h) => sum + (h.co2SavedTonnes || 0), 0);

  const totalSalesRevenue = soldTo.reduce((sum, h) => sum + (h.totalValue || 0), 0);
  const totalPurchasesCost = boughtFrom.reduce((sum, h) => sum + (h.totalValue || 0), 0);

  res.json({
    success: true,
    companyId,
    boughtFrom,
    soldTo,
    metrics: {
      totalWasteDivertedTonnes: Math.round(totalWasteDiverted * 10) / 10,
      totalCo2SavedTonnes: Math.round(totalCo2Saved * 10) / 10,
      totalSalesRevenue,
      totalPurchasesCost,
      completedDealsCount: boughtFrom.length + soldTo.length
    }
  });
});

// ==========================================
// 8. EMAIL NOTIFICATIONS OUTBOX & AUDIT
// ==========================================

app.get('/api/notifications/:companyId', (req, res) => {
  const { companyId } = req.params;
  const db = readDb();
  const allNotifications = db.emailNotifications || [];
  const company = db.companies.find(c => c.id === companyId);
  
  // Filter by recipientCompanyId or recipientEmail
  const companyNotifications = allNotifications.filter(n => 
    n.recipientCompanyId === companyId || 
    (company && n.recipientEmail?.toLowerCase() === company.email?.toLowerCase())
  );

  res.json({
    success: true,
    notifications: companyNotifications
  });
});

app.get('/api/notifications', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    notifications: (db.emailNotifications || []).slice(0, 50)
  });
});

// Reset database to initial seed data
app.post('/api/reset', (req, res) => {
  const initial = resetDb();
  res.json({ success: true, message: 'Database reset to demo state.', data: initial });
});

// Serve frontend static build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`♻️ Waste2Worth Server running on port ${PORT}`);
});
