const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "LOAN",
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    loanOpenDate: {
      type: Date,
      required: true,
    },
    loanClosingDate: {
      type: Date,
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    modeOfTransfer: {
      type: String,
      enum: ["NEFT/RTGS", "UPI", "CASH", "CHEQUE"], // ✅ matches frontend
      required: true,
    },
    rateOfInterest: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["MI", "ME", "DR"], // ✅ matches frontend
      required: true,
    },
    interestPerMonth: {
      type: Number,
      required: true,
    },
    receiptNo: {
      type: String,
      required: true,
      unique: true,
    },
    loanNo: {
      type: String,
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    collateralReceived: {
      type: String,
      enum: ["YES", "NO"], // ✅ matches frontend
      required: true,
    },
     downloads: [
      {
        at: { type: Date, default: Date.now },
        filePath: { type: String, trim: true }
      }
    ]
  },
  { timestamps: true,
    collection: 'loans'
   }
);

module.exports = mongoose.model("Loan", loanSchema);
