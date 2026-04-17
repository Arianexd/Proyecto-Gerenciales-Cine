const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  HallName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  Capacity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hall', hallSchema);

