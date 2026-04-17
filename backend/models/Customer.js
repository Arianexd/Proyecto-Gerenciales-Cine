const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true
  },
  Surname: {
    type: String,
    required: true,
    trim: true
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  PhoneNumber: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

