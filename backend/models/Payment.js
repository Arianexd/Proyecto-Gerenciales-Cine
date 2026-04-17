const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  ReservationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  PaymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Cash', 'Online'],
    required: true
  },
  Amount: {
    type: Number,
    required: true,
    min: 0
  },
  PaymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  ProcessingTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

