const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ReservationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  SeatID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  },
  TicketCode: {
    type: String,
    required: true,
    unique: true
  },
  QRCode: {
    type: String,
    required: true
  },
  CheckInStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);

