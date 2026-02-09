const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('en-IN') : '';
}

// ✅ Custom Header
function drawHeader(doc) {
  const logoPath = path.join(__dirname, '../assets/logo.png');
  try { doc.image(logoPath, 40, 40, { width: 90 }); } catch (_) {} // logo a bit lower & bigger

  const headerTop = 40;

  // Company name (bold, left aligned at center region)
  doc.fontSize(16).font('Times-Bold')
     .text('RPD CAPITAL FINANCE', 0, headerTop, { align: 'center' });

  // Reg No on the same line (right side)
  doc.fontSize(11).font('Times-Bold')
     .text('Reg No – 54/2025', 0, headerTop, { align: 'right' });

  // Tagline
  doc.fontSize(12).font('Times-Bold')
     .text('Financing your Future', 0, headerTop + 20, { align: 'center' });

  // Address lines
  doc.fontSize(12).font('Times-Roman')
     .text('Plot No.328LA, S Kolathur Main Road', 0, headerTop + 40, { align: 'center' })
     .text('Viduthalai Nagar, Kovilambakkam', { align: 'center' })
     .text('Chennai-600129', { align: 'center' })
     .text('Phone: +91 96633 16054', { align: 'center' });

  // Extra gap before body starts
  doc.moveDown(3);
  doc.fontSize(14).font('Times-Bold')
     .text('RECEIPT', { align: 'center', underline: true })
     .moveDown(2);
}

function fdPdf(res, data) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  const pdfDir = path.join(__dirname, '../receipts/fd');
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

  // Border
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  doc.rect(20, 20, pageWidth - 40, pageHeight - 75).stroke();

  drawHeader(doc);

  const leftX = 40;
  const rightX = 330;
  const startY = 200;
  const gap = 23; // default gap
  const labelWidth = 130;

  const leftFields = [
  { label: "Customer ID", value: data.customerId },
  { label: "Account No", value: data.accountNo },
  { label: "Received with thanks from", value: data.receivedWithThanksFrom },
  { label: "Jointly", value: data.jointly },
  { label: "Under", value: data.under },
].filter(f => f.value); // ✅ keep only if value exists

const rightFields = [
  { label: "Receipt No", value: data.receiptNo },
  { label: "Date", value: formatDate(data.date) },
].filter(f => f.value); // ✅ keep only if value exists


  let y = startY;

  for (let i = 0; i < Math.max(leftFields.length, rightFields.length); i++) {
    // Left field
    if (leftFields[i]) {
      doc.font("Times-Roman").fontSize(12)
         .text(leftFields[i].label + " :", leftX, y, { width: labelWidth });
      doc.font("Times-Bold").fontSize(11)
         .text(leftFields[i].value, leftX + labelWidth + 5, y);
    }

    // Right field
    if (rightFields[i]) {
      doc.font("Times-Roman").fontSize(12)
         .text(rightFields[i].label + " :", rightX, y, { width: labelWidth });
      doc.font("Times-Bold").fontSize(11)
         .text(rightFields[i].value, rightX + labelWidth + 5, y);
    }

    // Increase gap dynamically
    if (leftFields[i]?.label === "Received with thanks from") {
      y += gap + 10; // add extra 10px space after this row
    } else {
      y += gap;
    }
  }

  // Table Y position
  const tableY = startY + 6 * gap + 10;

  // ✅ Show *amount* (literal asterisks, no bold)
  function formatAmount(amount) {
    if (!amount) return '';
    return `*${Number(amount).toLocaleString('en-IN')}*`;
  }

  const headers = [
    'Received Date',
    'Received Amount',
    'Period',
    'ROI %',
    'Interest Payable',
    'Payment Due Date',
    'Payment Due Amount',
  ];

  const values = [
  data.receivedDate ? new Date(data.receivedDate).toLocaleDateString('en-IN') : '',
  formatAmount(data.receivedAmount),
  data.period || '',
  data.roiPerAnnum ? `${data.roiPerAnnum}%` : '',
  data.interestPayable || '',
  data.paymentDueDate ? new Date(data.paymentDueDate).toLocaleDateString('en-IN') : '',
  //data.monthlyInterestDate ? new Date(data.monthlyInterestDate).toLocaleDateString('en-IN') : '',
  formatAmount(data.paymentDueAmount)
];


  const widths = [75, 85, 48, 45, 80, 85, 100, 100];
  const rowHeight = 32;

  // Header row
  doc.font('Times-Bold').fontSize(11);
  let x = 40;
  headers.forEach((header, i) => {
    doc.rect(x, tableY, widths[i], rowHeight).stroke();
    const fontSize = 9;
    const headerTextY = tableY + (rowHeight / 3) - (fontSize / 2);

    doc.text(header, x + 5, headerTextY, {
      width: widths[i] - 10,
      align: 'center'
    });
    x += widths[i];
  });

  // Value row
  doc.font('Times-Roman').fontSize(12);
  x = 40;
  values.forEach((value, i) => {
    doc.rect(x, tableY + rowHeight, widths[i], rowHeight).stroke();
    const fontSize = 9;
    const valueTextY = tableY + rowHeight + (rowHeight / 3) - (fontSize / 2);

    doc.text(value.toString(), x + 5, valueTextY, {
      width: widths[i] - 10,
      align: 'center'
    });

    x += widths[i];
  });

const showMonthly = data.interestPayable === "Monthly";

 
 // ✅ PAYEE & NOMINEE DETAILS SECTION (Clean Alignment)
const payY = tableY + (rowHeight * 2) + 30; // space after table
const rowGap = 25;                          // vertical gap between rows
const leftColX = leftX;                     // left column X start
const rightColX = rightX;                   // right column X start
const labelWidth1 = 120;                    // consistent label width
const textOffset = 5;                       // small space between label and value

doc.font('Times-Roman').fontSize(12);

// ---- Row 1: Payable to + Transaction Details
doc.text("Payable to :", leftColX, payY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.payableTo || '-', leftColX + labelWidth1 + textOffset, payY);

doc.font('Times-Roman')
   .text("Transaction Details :", rightColX, payY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.transactionId || '-', rightColX + labelWidth1 + textOffset, payY);

// ---- Row 2: Nominee Name + Guardian Name
const nomineeRowY = payY + rowGap;

doc.font('Times-Roman')
   .text("Nominee Name :", leftColX, nomineeRowY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.nomineeName || '-', leftColX + labelWidth1 + textOffset, nomineeRowY);

doc.font('Times-Roman')
   .text("Guardian Name :", rightColX, nomineeRowY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.guardianName || '-', rightColX + labelWidth1 + textOffset, nomineeRowY);

// ---- Row 3: Nominee Address (Full Row)
const nomineeAddressY = nomineeRowY + rowGap;

doc.font('Times-Roman')
   .text("Nominee Address :", leftColX, nomineeAddressY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.nomineeAddress || '-', leftColX + labelWidth1 + textOffset, nomineeAddressY, {
       width: 400,
       align: 'left'
   });

// ---- Row 4: Guardian Address (Full Row)
const guardianAddressY = nomineeAddressY + rowGap;

doc.font('Times-Roman')
   .text("Guardian Address :", leftColX, guardianAddressY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.guardianAddress || '-', leftColX + labelWidth1 + textOffset, guardianAddressY, {
       width: 400,
       align: 'left'
   });

// ---- Row 5: Account Details (Full Row)
const accountDetailsY = guardianAddressY + rowGap;

doc.font('Times-Roman')
   .text("Account Details :", leftColX, accountDetailsY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.accountDetails || '-', leftColX + labelWidth1 + textOffset, accountDetailsY, {
       width: 200,
       align: 'left'
   });

// ---- Row 6: Monthly Payable
const monthlyRowY = accountDetailsY + rowGap;

doc.font('Times-Roman')
   .text("Monthly Payable :", leftColX, monthlyRowY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(formatAmount(data.monthlyInterest) || '-', leftColX + labelWidth1 + textOffset, monthlyRowY);

doc.font('Times-Roman')
   .text("Monthly Payable Date :", rightColX, monthlyRowY, { width: labelWidth1 });
doc.font('Times-Roman')
   .text(data.monthlyInterestDate || '-', rightColX + labelWidth1 + textOffset, monthlyRowY);



  function drawFooter(doc) {
    const margin = 60;              // left/right padding
    const stampWidth = 130;         // stamp image size
    const signWidth = 130;          // signature image size
    const footerTop = doc.page.height - 170; // fixed distance from bottom
  
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
}

module.exports = { fdPdf };
