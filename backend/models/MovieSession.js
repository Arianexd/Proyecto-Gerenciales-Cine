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

module.exports = mongoose.model('MovieSession', movieSessionSchema);

