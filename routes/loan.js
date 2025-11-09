const express = require('express');
const Loan = require('../models/loan');
const { loanPdf } = require('../utils/pdfLoan'); // adjust path if utils is elsewhere

const router = express.Router();

// Helper to generate next receipt number
async function getNextReceiptNo() {
  const lastLoan = await Loan.find({ type: 'LOAN' })
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();

  if (!lastLoan || lastLoan.length === 0) return 'RPD/L/1001';

  const lastNum = Number(lastLoan[0].receiptNo.match(/\d+$/)[0]);
  const nextNum = lastNum + 1;

  return `RPD/L/${nextNum}`;
}

router.post('/', async (req, res) => {
  try {
    const {
      customerId, loanNo, name, contact,
      loanOpenDate, loanClosingDate, loanAmount,
      modeOfTransfer, rateOfInterest, paymentMethod, interestPerMonth, transactionId, collateralReceived
    } = req.body;

    if (!customerId || !loanNo || !name || !contact || !loanOpenDate || !loanClosingDate || !loanAmount || !rateOfInterest || !interestPerMonth) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const loanAmountNum = Number(loanAmount);
    const interestNum = Number(interestPerMonth);

    if (isNaN(loanAmountNum) || isNaN(interestNum)) {
      return res.status(400).json({ error: "Loan amount, ROI, and Interest per month must be numbers" });
    }

    //Generate receipt number
    const receiptNo = await getNextReceiptNo();

    //Create Loan
    const saved = await Loan.create({
      type: 'LOAN',
      customerId,
      loanNo,   // user typed
      name,
      contact,
      loanOpenDate,
      loanClosingDate,
      loanAmount: loanAmountNum,
      modeOfTransfer,
      rateOfInterest,
      paymentMethod,
      interestPerMonth: interestNum,
      transactionId,
      collateralReceived,
      receiptNo
    });

    res.status(201).json(saved);

  } catch (e) {
    console.error("Loan creation error:", e);

    if (e.code === 11000 && e.keyPattern?.loanNo) {
      return res.status(400).json({
        error: `Loan Number "${req.body.loanNo}" already exists. Please enter a different Loan Number.`
      });
    }

    res.status(500).json({ error: e.message });
  }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);   // no .lean()
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    const filePath = loanPdf(res, loan); // PDF saved
    console.log("PDF saved at:", filePath);

    // Save download record
    loan.downloads.push({ at: new Date(), filePath });
    await loan.save();

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
