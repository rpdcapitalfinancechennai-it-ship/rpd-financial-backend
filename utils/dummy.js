/*const PDFDocument = require('pdfkit');
const path = require('path');

function drawHeader(doc) {
  const logoPath = path.join(__dirname,'../assets/logo.png');
  try { doc.image(logoPath, 40, 30, { width: 70 }); } catch(_) {}
  doc.fontSize(14).text('RPD CAPITAL FINANCE', 130, 35);
  doc.fontSize(10).text('Financing your Future', 130, 52);
  doc.text('Plot No. 32BLA, S Kolathur Main Road', 130, 66);
  doc.text('Viduthalai Nagar, Kovilambakkam, Chennai - 600129', 130, 80);
  doc.text('Phone: +91 96633 16054', 130, 94);
  doc.fontSize(12).text('RECEIPT', { align: 'center' }).moveDown(0.5);
}

function loanPdf(res, data) {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${data.receiptNo}.pdf"`);
  doc.pipe(res);

  drawHeader(doc);

  const left = 40, right = 330, y0 = 130, gap = 18;
  const L = [
    `Customer ID : ${data.customerId}`,
    `Name : ${data.name}`,
    `Contact Details : ${data.contact || ''}`,
    `Loan Open Date : ${data.loanOpenDate || ''}`,
  ];
  const R = [
    `Date : ${data.date}`,
    `Receipt No : ${data.receiptNo}`,
    `Loan Closing : ${data.loanClosingDate || ''}`,
    `Loan No : ${data.loanNo || ''}`,
  ];
  doc.fontSize(10);
  L.forEach((t,i)=> doc.text(t, left, y0 + i*gap));
  R.forEach((t,i)=> doc.text(t, right, y0 + i*gap));

  // Table header
  const tableY = y0 + 5*gap + 10;
  const cols = [
    { w: 90, h: 20, label: 'Loan Open Date' },
    { w: 90, h: 20, label: 'Loan No' },
    { w: 80, h: 20, label: 'Loan Amount' },
    { w: 80, h: 20, label: 'Mode of Transfer' },
    { w: 60, h: 20, label: 'Rate Of Interest (ROI)' },
    { w: 70, h: 20, label: 'Payment Method (MI/ME/DR)' },
    { w: 80, h: 20, label: 'Interest payable per month' },
  ];
  let x = 40;
  cols.forEach(c=>{ doc.rect(x, tableY, c.w, c.h).stroke(); doc.text(c.label, x+4, tableY+6, { width:c.w-8 }); x += c.w; });
  x = 40; const rowY = tableY + 20;
  const values = [data.loanOpenDate, data.loanNo, `₹${data.loanAmount||''}`, data.modeOfTransfer, data.rateOfInterest, data.paymentMethod, `₹${data.interestPerMonth||''}`];
  cols.forEach((c,i)=>{ doc.rect(x, rowY, c.w, 22).stroke(); doc.text(String(values[i]||''), x+4, rowY+6, { width:c.w-8 }); x+=c.w; });

  doc.moveDown(2);
  doc.text('RPD – For Safe , Steady Stable Growth', 40, rowY+40);
  doc.text('(Authorised Signatory)', 460, rowY+60);

  doc.end();
}

module.exports = { loanPdf };*/


//FD Pdf 


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

  // Move header block slightly down (y = 40 → top margin)
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
     .moveDown(4);
}


function loanPdf(res, data) {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const pdfDir = path.join(__dirname, '../receipts/loan');
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
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();

  drawHeader(doc);

const leftX = 40;
const rightX = 330;
const startY = 230;
const gap = 23; // default gap
const labelWidth = 130;

const leftFields = [
  { label: "Customer ID", value: data.customerId },
  { label: "Name", value: data.name },
  { label: "Contact Details", value: data.contact || "" },
];

const rightFields = [
  { label: "Date", value: formatDate(data.loanOpenDate) },
  { label: "Receipt No", value: data.receiptNo },
  { label: "Loan Closing Date(Exp)", value: formatDate(data.loanClosingDate) },
];

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


  /// Table Y position
const tableY = startY + 4 * gap + 10;


// Table headers
// Helper function to format amounts with commas and asterisks
function formatAmount(amount) {
  if (!amount) return '';
  return `*${Number(amount).toLocaleString()}*`;
}

// Table headers
const headers = [
  'Loan Open Date',
  'Loan No',
  'Loan Amount',
  'Mode of Transfer',
  'ROI %',
  'Payment Method (MI/ME/DR)',
  'Interest payable Amonut'
];

// Table Y positions
const rowY = tableY + 20;

const values = [
  data.loanOpenDate ? new Date(data.loanOpenDate).toLocaleDateString() : '',
  data.loanNo || '',
  formatAmount(data.loanAmount),
  data.modeOfTransfer || '',
  data.rateOfInterest || '',
  data.paymentMethod || '',
  formatAmount(data.interestPerMonth)
];

// Column widths (total 520)
const widths = [75, 90, 80, 60, 40, 75, 85];
const rowHeight = 40;  // row height

// Draw header row
doc.font('Times-Bold').fontSize(11);
let x = 40; // start position
headers.forEach((header, i) => {
  doc.rect(x, tableY, widths[i], rowHeight).stroke();

  const fontSize = 9;
  const headerTextY = tableY + (rowHeight / 5) - (fontSize / 2);

  doc.text(header, x + 5, headerTextY, {
    width: widths[i] - 10,
    align: 'center'
  });

  x += widths[i];
});

// Draw value row
doc.font('Times-Roman').fontSize(12);
x = 40;
values.forEach((value, i) => {
  doc.rect(x, tableY + rowHeight, widths[i], rowHeight).stroke();

  const fontSize = 9;
  const valueTextY = tableY + rowHeight + (rowHeight / 2) - (fontSize / 2);

  doc.text(value.toString(), x + 5, valueTextY, {
    width: widths[i] - 10,
    align: 'center'
  });

  x += widths[i];
});

// Transaction Details
  const detailsY = tableY + rowHeight * 2 + 20;
  const details = [
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
  const footerHeight = 180;       // reserved footer space
  const footerTop = doc.page.height - footerHeight;

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
  const textY = footerTop + 95;

  // Left text below stamp
  doc.fontSize(12).font('Times-Bold')
     .text('RPD – For Safe, Steady, Stable Growths', margin, textY, {
       width: stampWidth + 40,
       align: 'left'
     });

  // Right text below signature (centered under image)
  doc.fontSize(12).font('Times-Bold')
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

module.exports = { loanPdf };

