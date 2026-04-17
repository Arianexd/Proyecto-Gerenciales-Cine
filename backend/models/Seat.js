const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  HallID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  RowNumber: {
    type: String,
    required: true,
    trim: true
  },
  SeatNumber: {
    type: Number,
    required: true,
    min: 1
  },
  ScreenViewInfo: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    default: 'Good'
  },
  AcousticProfile: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Poor'],
    default: 'Good'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique seats per hall
seatSchema.index({ HallID: 1, RowNumber: 1, SeatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);

