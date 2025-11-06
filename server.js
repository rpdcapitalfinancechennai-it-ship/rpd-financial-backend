const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config(); // ✅ enables .env support on Render

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// ✅ Use environment variable for MongoDB URI (Render → Environment tab)
const uri = process.env.MONGO_URI || "mongodb+srv://rpdcapitalfinanceoffice_db_user:rpddatabase@rpd.azqjbtb.mongodb.net/rpd-financial?retryWrites=true&w=majority&appName=rpd";

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// 🔹 Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/loan', require('./routes/loan'));
app.use('/api/fd', require('./routes/fd'));
app.use('/api/chit', require('./routes/chit'));
app.use('/api/report', require('./routes/report'));
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

// ✅ Render automatically sets PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
