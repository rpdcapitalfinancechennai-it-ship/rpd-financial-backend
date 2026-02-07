const express = require('express');
const FD = require('../models/FD');
const { buildFDReceipt, nextSequence } = require('../utils/numberRules');
const { fdPdf } = require('../utils/pdfFD');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.customerId || !data.name || !data.date || !data.accountNo) {
      return res.status(400).json({ error: "Missing required fields" });
    }


    // Generate receiptNo as you already do
    const last = await FD.findOne({ type: 'FD' }).sort({ createdAt: -1 }).lean();
    let seq = 0;
    if (last && last.receiptNo) {
      const match = last.receiptNo.match(/(\d+)$/);
      if (match) seq = parseInt(match[1], 10) - 1000;
    }
    const nextSeq = nextSequence(seq);
    const receiptNo = buildFDReceipt(nextSeq);

    // Create FD
    const saved = await FD.create({
      type: 'FD',
      ...data,
      date: new Date(data.date),
      receivedDate: data.receivedDate ? new Date(data.receivedDate) : null,
      paymentDueDate: data.paymentDueDate ? new Date(data.paymentDueDate) : null,
      monthlyInterestDate: data.monthlyInterestDate ? new Date(data.monthlyInterestDate) : null,
      receiptNo,
    });

    res.status(201).json(saved);

  } catch (e) {
    console.error("Error in /fd route:", e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const fd = await FD.findById(req.params.id);   // no .lean()
    if (!fd) return res.status(404).json({ error: "fd not found" });

    const filePath = fdPdf(res, fd); // PDF saved
    console.log("PDF saved at:", filePath);

    // Save download record
    fd.downloads.push({ at: new Date(), filePath });
    await fd.save();

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
