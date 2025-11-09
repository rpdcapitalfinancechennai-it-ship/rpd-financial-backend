const mongoose = require("mongoose");

const chitSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "CHIT",
      required: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    chitDate: {
      type: Date,
      required: true,
    },
    chitAmount: {
      type: Number,
      required: true,
    },
    chitMonth: {
      type: Number,
      required: true,
    },
    totalMonth: {
      type: Number,
      required: true,
    },
    chitGroup: {
      type: String,
      required: true,
    },
    receiptNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    modeOfTransfer: {
      type: String,
      enum: ["NEFT/RTGS", "UPI", "CASH", "CHEQUE"], 
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    collateralReceived: {
      type: String,
      enum: ["YES", "NO"],
      required: true,
    },

   
    downloads: [
      {
        at: { type: Date, default: Date.now },
        filePath: { type: String, trim: true }
      }
    ]
  },
  { timestamps: true, collection: "chits" } 
);

module.exports = mongoose.model("Chit", chitSchema);
