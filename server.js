const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const nodemailer = require('nodemailer');

const app = express();

app.use(
  cors({
    origin: [
      "https://mellow-rugelach-8f7232.netlify.app", 
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());
app.use(morgan('dev'));
app.use(bodyParser.json());



// MongoDB connection
const uri = process.env.MONGO_URI || "mongodb+srv://rpdcapitalfinanceoffice_db_user:rpddatabase@rpd.azqjbtb.mongodb.net/rpd-financial?retryWrites=true&w=majority&appName=rpd";
mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

//  Routes
app.use('/api/contact', require('./routes/contact')(transporter));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/loan', require('./routes/loan'));
app.use('/api/fd', require('./routes/fd'));
app.use('/api/chit', require('./routes/chit'));
app.use('/api/report', require('./routes/report'));
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

//  Port setup for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
