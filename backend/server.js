require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const scanRoutes = require('./routes/scanRoutes');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internetsafety')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', scanRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Internet Safety Scanner API is running');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
