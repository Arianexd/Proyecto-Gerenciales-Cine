const express = require('express');
const router = express.Router();
const Hall = require('../models/Hall');
const { requireAdmin } = require('../middleware/auth');

// GET all halls
router.get('/', async (req, res) => {
  try {
    const halls = await Hall.find().sort({ HallName: 1 });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single hall
router.get('/:id', async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    res.json(hall);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new hall
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { HallName, Capacity } = req.body;

    if (!HallName || !Capacity) {
      return res.status(400).json({
        error: 'El nombre de la sala y la capacidad son obligatorios'
      });
    }

    const hall = new Hall({
      HallName,
      Capacity
    });

    await hall.save();

    res.status(201).json(hall);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ya existe una sala con ese nombre'
      });
    }

    res.status(400).json({
      error: error.message
    });
  }
});

// PUT update hall
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { HallName, Capacity } = req.body;

    const hall = await Hall.findByIdAndUpdate(
      req.params.id,
      {
        HallName,
        Capacity
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    res.json(hall);
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ya existe una sala con ese nombre'
      });
    }

    res.status(400).json({
      error: error.message
    });
  }
});

// DELETE hall
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    res.json({ message: 'Hall deleted successfully', hall });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;