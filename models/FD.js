const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
  type: { type: String, enum: ['FD','LOAN','CHIT'], required: true },
  customerId: { type: String, required: true },
  name: { type: String, required: true },
  contact: String,
  date: { type: Date, required: true },
  receiptNo: { type: String, required: true, unique: true },
  accountNo: { type: String, required: true },
  receivedWithThanksFrom: String,
  jointly: String,
  under: String,
  receivedDate: Date,
  receivedAmount: Number,
  period: String,
  roiPerAnnum: Number,
  interestPayable: { type: String, enum: ['Monthly', 'Maturity'] },
  paymentDueDate: Date,
  monthlyInterestDate : Date,
  paymentDueAmount: Number,
  payableTo: String,
  nomineeName: String,
  nomineeAddress: String,
  guardianName: String,
  guardianAddress: String,
  transactionId: { type: String, trim: true},
  accountDetails : { type: String, trim: true},
  downloads: [{ at: { type: Date, default: Date.now }, filePath: String }],
  monthlyInterest : Number
}, { 
  timestamps: true,
  collection: 'fds'   
});

module.exports = mongoose.model('FD', ReceiptSchema);
