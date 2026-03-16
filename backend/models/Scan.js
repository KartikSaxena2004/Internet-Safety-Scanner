const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  riskScore: {
    type: Number,
    required: true,
  },
  explanations: [
    {
      type: String,
    }
  ],
  scannedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Scan', scanSchema);
