const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');

// GET all reservations with populated data
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('CustomerID', 'Name Surname Email')
      .populate({
        path: 'SessionID',
        populate: [
          { path: 'MovieID', select: 'MovieName Genre' },
          { path: 'HallID', select: 'HallName' }
        ]
      })
      .sort({ CreationTime: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single reservation
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('CustomerID')
      .populate({
        path: 'SessionID',
        populate: [
          { path: 'MovieID' },
          { path: 'HallID' }
        ]
      });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new reservation
router.post('/', async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('CustomerID', 'Name Surname Email')
      .populate({
        path: 'SessionID',
        populate: [
          { path: 'MovieID', select: 'MovieName Genre' },
          { path: 'HallID', select: 'HallName' }
        ]
      });
    res.status(201).json(populatedReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update reservation (mainly for status updates)
router.put('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('CustomerID')
      .populate({
        path: 'SessionID',
        populate: [
          { path: 'MovieID' },
          { path: 'HallID' }
        ]
      });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation deleted successfully', reservation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

