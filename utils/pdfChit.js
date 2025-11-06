const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN') : '';
}

function formatAmount(amount) {
  if (!amount) return '';
  return Number(amount).toLocaleString('en-IN');
}

// ✅ Custom Header
function drawHeader(doc) {
  const logoPath = path.join(__dirname, '../assets/logo.png');
  try { doc.image(logoPath, 40, 40, { width: 90 }); } catch (_) {}

  const headerTop = 40;

  doc.fontSize(16).font('Times-Bold')
     .text('RPD CAPITAL FINANCE', 0, headerTop, { align: 'center' });

  doc.fontSize(11).font('Times-Bold')
     .text('Reg No – 54/2025', 0, headerTop, { align: 'right' });

  doc.fontSize(12).font('Times-Bold')
     .text('Financing your Future', 0, headerTop + 20, { align: 'center' });

  doc.fontSize(12).font('Times-Roman')
     .text('Plot No.328LA, S Kolathur Main Road', 0, headerTop + 40, { align: 'center' })
     .text('Viduthalai Nagar, Kovilambakkam', { align: 'center' })
     .text('Chennai-600129', { align: 'center' })
     .text('Phone: +91 96633 16054', { align: 'center' });

  doc.moveDown(3);
  doc.fontSize(14).font('Times-Bold')
     .text('RECEIPT', { align: 'center', underline: true })
     .moveDown(4);
}

function chitPdf(res, data) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  const pdfDir = path.join(__dirname, '../receipts/chit');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

  const safeReceiptNo = data.receiptNo.replace(/\//g, '-'); // replace slashes
  const filePath = path.join(pdfDir, `${safeReceiptNo}.pdf`);

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  if (res) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeReceiptNo}.pdf"`);
    doc.pipe(res);
  }


  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.rect(20, 20, pageWidth - 40, pageHeight - 80).stroke();
  drawHeader(doc);

  const leftX = 40;
  const rightX = 330;
  const startY = 230;
  const labelWidth = 130;
  const gap = 25;

  const leftFields = [
    { label: "Customer ID", value: data.customerId },
    { label: "Name", value: data.name },
    { label: "Contact Details", value: data.contact || "" },
  ];

  const rightFields = [
    { label: "Date", value: formatDate(data.chitDate) },
    { label: "Receipt No", value: data.receiptNo },
  ];

  let y = startY;
  for (let i = 0; i < Math.max(leftFields.length, rightFields.length); i++) {
    if (leftFields[i]) {
      doc.font("Times-Roman").fontSize(12)
         .text(leftFields[i].label + " :", leftX, y, { width: labelWidth });
      doc.font("Times-Bold").fontSize(11)
         .text(leftFields[i].value, leftX + labelWidth + 5, y);
    }

    if (rightFields[i]) {
      doc.font("Times-Roman").fontSize(12)
         .text(rightFields[i].label + " :", rightX, y, { width: labelWidth });
      doc.font("Times-Bold").fontSize(11)
         .text(rightFields[i].value, rightX + labelWidth + 5, y);
    }

    y += gap;
  }

  // Table Section
  const tableY = y + 20;
  const headers = [
    'Payment Date',
    'Chit Amount',
    'Chit Group',
    'Current Month / Total No.of Month',
    'Mode of Transfer',
  ];

  const values = [
    formatDate(data.chitDate),
    formatAmount(data.chitAmount),
    data.chitGroup || '',
    `${data.chitMonth || ''}/${data.totalMonth || ''}`,
    data.modeOfTransfer || '',
  ];

  // Dynamic column widths
  const availableWidth = pageWidth - 80;
  const widths = [
    availableWidth * 0.18,
    availableWidth * 0.18,
    availableWidth * 0.18,
    availableWidth * 0.28,
    availableWidth * 0.18,
  ];
  const rowHeight = 50;

  doc.font('Times-Bold').fontSize(11);
  let x = 40;
  headers.forEach((header, i) => {
    doc.rect(x, tableY, widths[i], rowHeight).stroke();
    doc.text(header, x + 5, tableY + 15, { width: widths[i] - 10, align: 'center' });
    x += widths[i];
  });

  doc.font('Times-Roman').fontSize(12);
  x = 40;
  values.forEach((value, i) => {
    doc.rect(x, tableY + rowHeight, widths[i], rowHeight).stroke();
    doc.text(value.toString(), x + 5, tableY + rowHeight + 15, {
      width: widths[i] - 10,
      align: 'center'
    });
    x += widths[i];
  });

  // Payee Details
  const detailsY = tableY + rowHeight * 2 + 20;
  const details = [
    { label: "Collateral Received", value: data.collateralReceived || '-' },
    { label: "Transaction Id", value: data.transactionId || '-' },
  ];

  let dY = detailsY;
  details.forEach(d => {
    doc.font('Times-Roman').fontSize(12).text(d.label + " :", leftX, dY);
    doc.font('Times-Bold').fontSize(12).text(d.value, leftX + 130, dY);
    dY += 25;
  });

  function drawFooter(doc) {
    const margin = 60;              // left/right padding
    const stampWidth = 130;         // stamp image size
    const signWidth = 130;          // signature image size
    const footerTop = doc.page.height - 180; // fixed distance from bottom
  
    const stampPath = path.join(__dirname, '../assets/stamp.png');
    const signPath = path.join(__dirname, '../assets/sign.png');
  
    // --- Stamp (bottom-left)
    try {
      doc.image(stampPath, margin, footerTop, { width: stampWidth });
    } catch (_) {}
  
    // --- Signature (bottom-right)
    const signX = doc.page.width - signWidth - margin;
    try {
      doc.image(signPath, signX, footerTop, { width: signWidth });
    } catch (_) {}
  
    // --- Footer texts
    const textY = footerTop + 70;
  
    // Left text under stamp
    doc.fontSize(11).font('Times-Bold')
       .text('RPD – For Safe, Steady, Stable Growths', margin, textY, {
         width: stampWidth + 50,
         align: 'left'
       });
  
    // Right text under signature
    doc.fontSize(11).font('Times-Bold')
       .text('(Authorised Signatory)', signX, textY, {
         width: signWidth,
         align: 'center'
       });
  }
  
    drawFooter(doc);
  
    doc.on("pageAdded", () => {
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();
      drawHeader(doc);
      drawFooter(doc);
    });
  
    doc.end();

     return filePath;
}

module.exports = { chitPdf };
