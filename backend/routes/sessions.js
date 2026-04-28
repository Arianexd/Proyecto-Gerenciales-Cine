const express = require('express');
const router = express.Router();
const MovieSession = require('../models/MovieSession');
const Reservation = require('../models/Reservation');
const Ticket = require('../models/Ticket');
const { requireAdmin } = require('../middleware/auth');

// GET all sessions with populated movie and hall data
router.get('/', async (req, res) => {
  try {
    const sessions = await MovieSession.find()
      .populate('MovieID', 'MovieName Genre Duration')
      .populate('HallID', 'HallName Capacity')
      .sort({ SessionDateTime: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single session
router.get('/:id', async (req, res) => {
  try {
    const session = await MovieSession.findById(req.params.id)
      .populate('MovieID')
      .populate('HallID');
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET session seat availability
router.get('/:id/availability', async (req, res) => {
  try {
    const session = await MovieSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const reservations = await Reservation.find({ SessionID: req.params.id }).select('_id');
    const reservationIds = reservations.map((reservation) => reservation._id);
    const tickets = await Ticket.find({ ReservationID: { $in: reservationIds } }).select('SeatID');
    const soldSeatIds = tickets.map((ticket) => ticket.SeatID.toString());

    res.json({ soldSeatIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new session
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { HallID, SessionDateTime, MovieID } = req.body;

    // ✅ Validación mejorada: considerar duración de película y tiempo de limpieza
    const Movie = require('../models/Movie');
    const movie = await Movie.findById(MovieID);
    if (!movie) {
      return res.status(400).json({ error: 'Película no encontrada' });
    }

    const sessionStart = new Date(SessionDateTime);
    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionEnd.getMinutes() + movie.Duration + 30); // +30 min limpieza

    // Buscar sesiones que se solapen considerando duración
    const conflictingSessions = await MovieSession.find({
      HallID,
      _id: { $ne: req.params.id }, // Excluir sesión actual si es actualización
      $or: [
        // Sesión existente empieza durante la nueva sesión
        {
          SessionDateTime: { 
            $gte: sessionStart, 
            $lt: sessionEnd 
          }
        },
        // Sesión existente termina durante la nueva sesión
        {
          $expr: {
            $gt: [
              { 
                $add: [
                  "$SessionDateTime", 
                  { $multiply: ["$Duration", 60000] }, 
                  1800000 // 30 min limpieza
                ] 
              },
              sessionStart
            ]
          }
        }
      ]
    }).populate('MovieID', 'MovieName Duration');

    if (conflictingSessions.length > 0) {
      const conflict = conflictingSessions[0];
      const conflictStart = new Date(conflict.SessionDateTime);
      const conflictEnd = new Date(conflictStart);
      conflictEnd.setMinutes(conflictEnd.getMinutes() + (conflict.MovieID?.Duration || 120) + 30);
      
      return res.status(400).json({ 
        error: `Conflicto de horario con "${conflict.MovieID?.MovieName}" (${conflictStart.toLocaleTimeString()} - ${conflictEnd.toLocaleTimeString()})` 
      });
    }

    const session = new MovieSession(req.body);
    await session.save();
    const populatedSession = await MovieSession.findById(session._id)
      .populate('MovieID', 'MovieName Genre Duration')
      .populate('HallID', 'HallName Capacity');
    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update session
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { HallID, SessionDateTime, MovieID } = req.body;

    if (HallID && SessionDateTime && MovieID) {
      // ✅ Validación mejorada para actualizaciones
      const Movie = require('../models/Movie');
      const movie = await Movie.findById(MovieID);
      if (!movie) {
        return res.status(400).json({ error: 'Película no encontrada' });
      }

      const sessionStart = new Date(SessionDateTime);
      const sessionEnd = new Date(sessionStart);
      sessionEnd.setMinutes(sessionEnd.getMinutes() + movie.Duration + 30);

      const conflictingSessions = await MovieSession.find({
        HallID,
        _id: { $ne: req.params.id },
        $or: [
          {
            SessionDateTime: { 
              $gte: sessionStart, 
              $lt: sessionEnd 
            }
          },
          {
            $expr: {
              $gt: [
                { 
                  $add: [
                    "$SessionDateTime", 
                    { $multiply: ["$Duration", 60000] }, 
                    1800000
                  ] 
                },
                sessionStart
              ]
            }
          }
        ]
      }).populate('MovieID', 'MovieName Duration');

      if (conflictingSessions.length > 0) {
        const conflict = conflictingSessions[0];
        const conflictStart = new Date(conflict.SessionDateTime);
        const conflictEnd = new Date(conflictStart);
        conflictEnd.setMinutes(conflictEnd.getMinutes() + (conflict.MovieID?.Duration || 120) + 30);
        
        return res.status(400).json({ 
          error: `Conflicto de horario con "${conflict.MovieID?.MovieName}" (${conflictStart.toLocaleTimeString()} - ${conflictEnd.toLocaleTimeString()})` 
        });
      }
    }

    const session = await MovieSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('MovieID').populate('HallID');
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE session
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const session = await MovieSession.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ message: 'Session deleted successfully', session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
