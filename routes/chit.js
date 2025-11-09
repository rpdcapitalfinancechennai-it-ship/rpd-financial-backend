const express = require('express');
const Chit = require('../models/chit');
const { chitPdf } = require('../utils/pdfChit'); // adjust path if utils is elsewhere

const router = express.Router();

// Helper to generate next receipt number
async function getNextReceiptNo() {
  const lastChit = await Chit.find({ type: 'CHIT' })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();

  if (!lastChit || lastChit.length === 0) return 'RPD/C/1001';

  const lastNum = Number(lastChit[0].receiptNo.match(/\d+$/)[0]);
  const nextNum = lastNum + 1;

  return `RPD/C/${nextNum}`;
}

router.post('/', async (req, res) => {
  try {
    const { customerId, name, contact, chitDate, chitAmount, chitMonth, chitGroup, modeOfTransfer, totalMonth, transactionId, collateralReceived  } = req.body;

    // Validate required fields
    if (!customerId || !name || !contact || !chitDate || !chitAmount || !chitMonth || !chitGroup || !totalMonth ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert numeric fields
    const chitAmountNum = Number(chitAmount);
    const chitMonthNum = Number(chitMonth);
    const chitTotMonthNum = Number(totalMonth);

    if (isNaN(chitAmountNum) || isNaN(chitMonthNum) || isNaN(chitTotMonthNum)) {
      return res.status(400).json({ error: "Chit Amount, Chit month must be numbers" });
    }

    // Generate receipt number
    const receiptNo = await getNextReceiptNo();

    // Create chit
    const saved = await Chit.create({
      type: 'CHIT',
      customerId,
      name,
      contact,
      chitDate,
      chitGroup,
      chitAmount: chitAmountNum,
      chitMonth:  chitMonthNum,
      modeOfTransfer,
      totalMonth : chitTotMonthNum,
      transactionId, 
      collateralReceived,
      receiptNo        // auto-generated
    });

    res.status(201).json(saved);

  } catch (e) {
    console.error("Chit creation error:", e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id);   // ⬅️ no .lean()
    if (!chit) return res.status(404).json({ error: "Chit not found" });

    const filePath = chitPdf(res, chit); // PDF saved
    console.log("PDF saved at:", filePath);

    // Save download record
    chit.downloads.push({ at: new Date(), filePath });
    await chit.save();

    // If you don’t want to send PDF response twice, 
    // don’t res.json here. chitPdf() already streams the file.
    // But if you only want to return filePath:
    // res.json({ path: filePath });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
