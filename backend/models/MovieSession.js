const mongoose = require('mongoose');

const movieSessionSchema = new mongoose.Schema({
  MovieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  HallID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hall',
    required: true
  },
  SessionDateTime: {
    type: Date,
    required: true
  },
  Price: {
    type: Number,
    required: true,
    min: 0
  },
  Language: {
    type: String,
    required: true,
    trim: true
  },
  SubtitleInfo: {
    type: String,
    trim: true,
    default: 'None'
  }
}, {
  timestamps: true
});

movieSessionSchema.pre('findOneAndDelete', async function(next) {
  const session = await this.model.findOne(this.getQuery()).select('_id');

  if (session) {
    const Reservation = mongoose.model('Reservation');
    const Payment = mongoose.model('Payment');
    const Ticket = mongoose.model('Ticket');
    const reservations = await Reservation.find({ SessionID: session._id }).select('_id');
    const reservationIds = reservations.map((reservation) => reservation._id);
    const deleteOperations = [Reservation.deleteMany({ SessionID: session._id })];

    if (reservationIds.length > 0) {
      deleteOperations.unshift(
        Payment.deleteMany({ ReservationID: { $in: reservationIds } }),
        Ticket.deleteMany({ ReservationID: { $in: reservationIds } })
      );
    }

    await Promise.all(deleteOperations);
  }

  next();
});

module.exports = mongoose.model('MovieSession', movieSessionSchema);
