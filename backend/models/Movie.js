const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  MovieName: {
    type: String,
    required: true,
    trim: true
  },
  Genre: {
    type: String,
    required: true,
    trim: true
  },
  Duration: {
    type: Number,
    required: true,
    min: 1
  },
  AgeLimit: {
    type: Number,
    required: true,
    min: 0
  },
  Description: {
    type: String,
    trim: true,
    default: ''
  },
  PosterURL: {
    type: String,
    trim: true,
    default: ''
  },
  Director: {
    type: String,
    trim: true,
    default: ''
  },
  Cast: {
    type: [String],
    default: []
  },
  Rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  UserRatingAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  UserRatingCount: {
    type: Number,
    default: 0,
    min: 0
  },
  TrailerURL: {
    type: String,
    trim: true
  },
  ReleaseDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

movieSchema.pre('findOneAndDelete', async function(next) {
  const movie = await this.model.findOne(this.getQuery()).select('_id');

  if (movie) {
    const movieId = movie._id;
    const MovieSession = mongoose.model('MovieSession');
    const Reservation = mongoose.model('Reservation');
    const Payment = mongoose.model('Payment');
    const Ticket = mongoose.model('Ticket');
    const Review = mongoose.model('Review');
    const sessions = await MovieSession.find({ MovieID: movieId }).select('_id');
    const sessionIds = sessions.map((session) => session._id);

    if (sessionIds.length > 0) {
      const reservations = await Reservation.find({ SessionID: { $in: sessionIds } }).select('_id');
      const reservationIds = reservations.map((reservation) => reservation._id);
      const deleteOperations = [
        Reservation.deleteMany({ SessionID: { $in: sessionIds } }),
        MovieSession.deleteMany({ MovieID: movieId })
      ];

      if (reservationIds.length > 0) {
        deleteOperations.unshift(
          Payment.deleteMany({ ReservationID: { $in: reservationIds } }),
          Ticket.deleteMany({ ReservationID: { $in: reservationIds } })
        );
      }

      await Promise.all(deleteOperations);
    }

    await Review.deleteMany({ MovieID: movieId });
  }

  next();
});

module.exports = mongoose.model('Movie', movieSchema);
