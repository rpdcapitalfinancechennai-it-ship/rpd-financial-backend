const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
const uri = "mongodb+srv://rpdcapitalfinanceoffice_db_user:rpddatabase@rpd.azqjbtb.mongodb.net/rpd-financial?retryWrites=true&w=majority&appName=rpd";
//const uri = "mongodb+srv://JeevaUser:jeeva@cluster0.uqfdmia.mongodb.net/rpd-financial?retryWrites=true&w=majority&appName=Cluster0";
//mongodb+srv://rpdcapitalfinanceoffice_db_user:rpddatabase@rpd.azqjbtb.mongodb.net/?retryWrites=true&w=majority&appName=rpd
mongoose.connect(uri)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.log("MongoDB connection error ❌", err));

// 🔹 Auth Route
app.use('/api/auth', require('./routes/auth'));

// 🔹 Other existing routes
app.use('/api/loan', require('./routes/loan'));
app.use('/api/fd', require('./routes/fd'));
app.use('/api/chit', require('./routes/chit'));
app.use('/api/report', require('./routes/report'));
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`API running on http://localhost:${PORT}`));
