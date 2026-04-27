const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
    default: null
  },
  SessionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MovieSession',
    required: true
  },
  SeatIDs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat'
  }],
  CreationTime: {
    type: Date,
    default: Date.now
  },
  Status: {
    type: String,
    enum: ['CREATED', 'PAID', 'CANCELLED'],
    default: 'CREATED'
  }
}, {
  timestamps: true
});

reservationSchema.pre('findOneAndDelete', async function(next) {
  const reservation = await this.model.findOne(this.getQuery()).select('_id');

  if (reservation) {
    await Promise.all([
      mongoose.model('Payment').deleteMany({ ReservationID: reservation._id }),
      mongoose.model('Ticket').deleteMany({ ReservationID: reservation._id })
    ]);
  }

  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);
