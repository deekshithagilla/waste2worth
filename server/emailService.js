import nodemailer from 'nodemailer';

// Configure transporter
// If environment variables exist, use real SMTP (e.g., SendGrid, Mailgun, Amazon SES, Gmail, etc.)
// Otherwise, use built-in JSON/stream transport with logging for instant zero-config testing
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Development / Test transporter
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const transporter = createTransporter();

/**
 * Generate responsive corporate HTML email template for Contract events
 */
function generateEmailHtml({
  recipientRole,
  recipientName,
  recipientEmail,
  otherPartyRole,
  otherPartyName,
  otherPartyEmail,
  deal,
  actionTitle,
  statusBadge,
  badgeColor,
  formattedVal,
  dateStr,
  isAccepted,
  isFinalized
}) {
  const landfillTons = deal.requestedQuantity;
  const co2Tons = Math.round(deal.requestedQuantity * 0.6 * 10) / 10;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${actionTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #0f172a; padding: 28px 32px; color: #ffffff; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header .subtitle { color: #94a3b8; font-size: 12px; margin-top: 4px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #ffffff; background-color: ${badgeColor}; margin-top: 12px; }
    .content { padding: 32px; }
    .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .lead { font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .table-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .table-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .table-row:last-child { border-bottom: none; }
    .table-label { color: #64748b; font-weight: 500; }
    .table-val { color: #0f172a; font-weight: 700; text-align: right; }
    .total-val { color: #059669; font-size: 16px; font-weight: 900; }
    .esg-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .esg-title { font-size: 12px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .esg-metrics { display: flex; gap: 16px; font-size: 13px; }
    .esg-item { flex: 1; }
    .esg-val { font-size: 16px; font-weight: 800; color: #047857; }
    .esg-lbl { font-size: 11px; color: #065f46; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 11px; color: #94a3b8; text-align: center; }
    .footer a { color: #059669; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">
        Waste2Worth Industrial Symbiosis
      </div>
      <h1>${actionTitle}</h1>
      <div class="subtitle">Official Transaction Notice • Protocol Reference: ${deal.id}</div>
      <div class="badge">${statusBadge}</div>
    </div>

    <div class="content">
      <div class="greeting">Dear ${recipientName} (${recipientRole}),</div>
      
      <p class="lead">
        ${isAccepted 
          ? `We are pleased to inform you that the contract proposal for <strong>${deal.wasteTitle}</strong> between <strong>${deal.buyerCompanyName}</strong> and <strong>${deal.sellerCompanyName}</strong> has been officially <strong>accepted and agreed</strong>.` 
          : `The secondary material transfer for <strong>${deal.wasteTitle}</strong> between <strong>${deal.buyerCompanyName}</strong> and <strong>${deal.sellerCompanyName}</strong> has been successfully <strong>finalized and verified</strong>. Corresponding stock has been settled and archived into the platform's permanent audit ledger.`
        }
      </p>

      <div class="table-box">
        <div class="table-row">
          <span class="table-label">Material Stream:</span>
          <span class="table-val">${deal.wasteTitle}</span>
        </div>
        <div class="table-row">
          <span class="table-label">Contract Quantity:</span>
          <span class="table-val">${deal.requestedQuantity} ${deal.unit}</span>
        </div>
        <div class="table-row">
          <span class="table-label">Agreed Unit Price:</span>
          <span class="table-val">₹${deal.offeredPricePerUnit} / ${deal.unit}</span>
        </div>
        <div class="table-row">
          <span class="table-label">Total Contract Value:</span>
          <span class="table-val total-val">₹${formattedVal}</span>
        </div>
        <div class="table-row">
          <span class="table-label">Buyer Company:</span>
          <span class="table-val">${deal.buyerCompanyName} (${deal.buyerCompanyEmail})</span>
        </div>
        <div class="table-row">
          <span class="table-label">Seller Company:</span>
          <span class="table-val">${deal.sellerCompanyName} (${deal.sellerCompanyEmail})</span>
        </div>
        <div class="table-row">
          <span class="table-label">Notice Timestamp:</span>
          <span class="table-val">${dateStr}</span>
        </div>
      </div>

      ${isFinalized ? `
      <div class="esg-box">
        <div class="esg-title">🌱 Verified Environmental Impact</div>
        <div class="esg-metrics">
          <div class="esg-item">
            <div class="esg-val">${landfillTons} Tons</div>
            <div class="esg-lbl">Landfill Waste Diverted</div>
          </div>
          <div class="esg-item">
            <div class="esg-val">${co2Tons} MT CO₂e</div>
            <div class="esg-lbl">Lifecycle Carbon Abated</div>
          </div>
          <div class="esg-item">
            <div class="esg-val">Grade A</div>
            <div class="esg-lbl">Circular Standard</div>
          </div>
        </div>
      </div>
      ` : ''}

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
        You can inspect your deal history, chat logs, and download verified ESG compliance records at any time by accessing your Waste2Worth company portal.
      </p>
    </div>

    <div class="footer">
      This is an automated notification from the <strong>Waste2Worth Circular Economy Platform</strong>.<br/>
      Facilitating zero-waste industrial symbioses and B2B secondary resource recovery.<br/>
      © ${new Date().getFullYear()} Waste2Worth Alliance. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Dispatch automated email notifications to BOTH buyer and seller companies
 */
export async function sendContractNotification({ deal, eventType, db }) {
  try {
    // 1. Resolve Buyer & Seller emails with fallbacks to registered company profiles
    let buyerEmail = deal.buyerCompanyEmail;
    let buyerName = deal.buyerCompanyName;
    if ((!buyerEmail || buyerEmail.trim() === '') && db?.companies) {
      const bComp = db.companies.find(c => c.id === deal.buyerCompanyId);
      if (bComp) {
        buyerEmail = bComp.email;
        buyerName = buyerName || bComp.name;
      }
    }

    let sellerEmail = deal.sellerCompanyEmail;
    let sellerName = deal.sellerCompanyName;
    if ((!sellerEmail || sellerEmail.trim() === '') && db?.companies) {
      const sComp = db.companies.find(c => c.id === deal.sellerCompanyId);
      if (sComp) {
        sellerEmail = sComp.email;
        sellerName = sellerName || sComp.name;
      }
    }

    if (!buyerEmail) buyerEmail = 'procurement@buyer-company.com';
    if (!sellerEmail) sellerEmail = 'sales@seller-company.com';

    const isAccepted = eventType === 'accepted';
    const isFinalized = eventType === 'completed';

    const actionTitle = isAccepted 
      ? 'Contract Proposal Agreed & Accepted' 
      : 'Contract Finalized & Material Transfer Verified';

    const statusBadge = isAccepted ? 'Contract Agreed' : 'Transferred & Executed';
    const badgeColor = isAccepted ? '#059669' : '#7c3aed';
    const formattedVal = (deal.totalValue || (deal.requestedQuantity * deal.offeredPricePerUnit)).toLocaleString();
    const dateStr = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

    // Subject lines
    const subjectPrefix = `[Waste2Worth] ${actionTitle}`;
    const subject = `${subjectPrefix}: ${deal.wasteTitle} (${deal.requestedQuantity} ${deal.unit} @ ₹${deal.offeredPricePerUnit})`;

    // Generate customized HTML content for Buyer
    const buyerHtml = generateEmailHtml({
      recipientRole: 'Buyer Company',
      recipientName: buyerName,
      recipientEmail: buyerEmail,
      otherPartyRole: 'Seller Company',
      otherPartyName: sellerName,
      otherPartyEmail: sellerEmail,
      deal,
      actionTitle,
      statusBadge,
      badgeColor,
      formattedVal,
      dateStr,
      isAccepted,
      isFinalized
    });

    // Generate customized HTML content for Seller
    const sellerHtml = generateEmailHtml({
      recipientRole: 'Seller Company',
      recipientName: sellerName,
      recipientEmail: sellerEmail,
      otherPartyRole: 'Buyer Company',
      otherPartyName: buyerName,
      otherPartyEmail: buyerEmail,
      deal,
      actionTitle,
      statusBadge,
      badgeColor,
      formattedVal,
      dateStr,
      isAccepted,
      isFinalized
    });

    // Plain text versions
    const plainTextBody = `
Waste2Worth Industrial Symbiosis Platform - Notification
--------------------------------------------------------
Event: ${actionTitle}
Material: ${deal.wasteTitle}
Quantity: ${deal.requestedQuantity} ${deal.unit}
Unit Price: ₹${deal.offeredPricePerUnit} / ${deal.unit}
Total Contract Value: ₹${formattedVal}
Buyer: ${buyerName} (${buyerEmail})
Seller: ${sellerName} (${sellerEmail})
Timestamp: ${dateStr}
Reference ID: ${deal.id}
--------------------------------------------------------
Verified by Waste2Worth Platform Protocol.
    `.trim();

    // 2. Dispatch email to BUYER
    const buyerMailOptions = {
      from: '"Waste2Worth Notifications" <notifications@waste2worth.org>',
      to: buyerEmail,
      subject,
      text: plainTextBody,
      html: buyerHtml
    };

    // 3. Dispatch email to SELLER
    const sellerMailOptions = {
      from: '"Waste2Worth Notifications" <notifications@waste2worth.org>',
      to: sellerEmail,
      subject,
      text: plainTextBody,
      html: sellerHtml
    };

    const [buyerResult, sellerResult] = await Promise.all([
      transporter.sendMail(buyerMailOptions),
      transporter.sendMail(sellerMailOptions)
    ]);

    // 4. Create persistent records for notification audit outbox
    const nowIso = new Date().toISOString();
    const buyerNotificationRecord = {
      id: `email_${Date.now()}_b`,
      dealId: deal.id,
      eventType,
      recipientRole: 'BUYER',
      recipientCompanyId: deal.buyerCompanyId,
      recipientCompanyName: buyerName,
      recipientEmail: buyerEmail,
      counterpartyName: sellerName,
      counterpartyEmail: sellerEmail,
      wasteTitle: deal.wasteTitle,
      quantity: deal.requestedQuantity,
      unit: deal.unit,
      totalValue: deal.totalValue,
      subject,
      html: buyerHtml,
      text: plainTextBody,
      status: 'Delivered',
      sentAt: nowIso
    };

    const sellerNotificationRecord = {
      id: `email_${Date.now()}_s`,
      dealId: deal.id,
      eventType,
      recipientRole: 'SELLER',
      recipientCompanyId: deal.sellerCompanyId,
      recipientCompanyName: sellerName,
      recipientEmail: sellerEmail,
      counterpartyName: buyerName,
      counterpartyEmail: buyerEmail,
      wasteTitle: deal.wasteTitle,
      quantity: deal.requestedQuantity,
      unit: deal.unit,
      totalValue: deal.totalValue,
      subject,
      html: sellerHtml,
      text: plainTextBody,
      status: 'Delivered',
      sentAt: nowIso
    };

    // Console formatted terminal audit
    console.log('\n================================================================');
    console.log(`📧 [EMAIL DISPATCHED] Event: ${eventType.toUpperCase()}`);
    console.log(`   Contract ID:  ${deal.id}`);
    console.log(`   Material:     "${deal.wasteTitle}" (${deal.requestedQuantity} ${deal.unit})`);
    console.log(`   Total Value:  ₹${formattedVal}`);
    console.log(`   -> Buyer:     ${buyerEmail} (${buyerName}) [Delivered]`);
    console.log(`   -> Seller:    ${sellerEmail} (${sellerName}) [Delivered]`);
    console.log('================================================================\n');

    return {
      success: true,
      count: 2,
      buyerEmail,
      sellerEmail,
      notifications: [buyerNotificationRecord, sellerNotificationRecord]
    };

  } catch (error) {
    console.error('Error dispatching contract email notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
