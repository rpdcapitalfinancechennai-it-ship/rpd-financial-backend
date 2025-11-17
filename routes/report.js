const express = require('express');
const path = require('path');
const router = express.Router();

const Chit = require('../models/chit');
const Receipt = require('../models/FD');
const Loan = require('../models/loan');
const { chitPdf } = require('../utils/pdfChit');

router.get('/', async (req, res) => {
  try {
    const { start, end, type } = req.query;
    if (!start || !end || !type) return res.status(400).json({ error: "start, end, type required" });

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23,59,59,999); 

    let Model;
    if (type === "CHIT") Model = Chit;
    else if (type === "FD") Model = Receipt;
    else if (type === "LOAN") Model = Loan;
    else return res.status(400).json({ error: "Invalid type" });

    const data = await Model.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).select("receiptNo chitGroup accountNo loanNo createdAt downloads");


    res.json(data);
  } catch (e) {
    console.error("Report error:", e);
    res.status(500).json({ error: e.message });
  }
});


router.get('/:id/pdf', async (req, res) => {
  try {
    const chit = await Chit.findById(req.params.id); 
    if (!chit) return res.status(404).json({ error: "Chit not found" });

    const filePath = chitPdf(res, chit); 
    chit.downloads.push({ at: new Date(), filePath });
    await chit.save();

    console.log("PDF saved at:", filePath);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
