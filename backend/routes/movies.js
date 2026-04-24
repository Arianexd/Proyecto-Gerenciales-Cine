const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { requireAdmin } = require('../middleware/auth');

function normalizeMoviePayload(payload = {}) {
  const normalizedPayload = { ...payload };

  const stringFields = ['MovieName', 'Genre', 'Description', 'PosterURL', 'Director', 'TrailerURL'];
  stringFields.forEach((field) => {
    if (typeof normalizedPayload[field] === 'string') {
      normalizedPayload[field] = normalizedPayload[field].trim();
    }
  });

  ['Duration', 'AgeLimit', 'Rating'].forEach((field) => {
    if (normalizedPayload[field] !== undefined && normalizedPayload[field] !== null && normalizedPayload[field] !== '') {
      normalizedPayload[field] = Number(normalizedPayload[field]);
    } else if (field === 'Rating') {
      delete normalizedPayload[field];
    }
  });

  if (Array.isArray(normalizedPayload.Cast)) {
    normalizedPayload.Cast = normalizedPayload.Cast
      .map((actor) => `${actor}`.trim())
      .filter(Boolean);
  } else if (typeof normalizedPayload.Cast === 'string') {
    normalizedPayload.Cast = normalizedPayload.Cast
      .split(',')
      .map((actor) => actor.trim())
      .filter(Boolean);
  }

  return normalizedPayload;
}

function getMissingMovieFields(movieData = {}) {
  const missingFields = [];

  if (typeof movieData.MovieName !== 'string' || !movieData.MovieName.trim()) {
    missingFields.push('titulo');
  }

  if (typeof movieData.Genre !== 'string' || !movieData.Genre.trim()) {
    missingFields.push('genero');
  }

  if (!Number.isFinite(Number(movieData.Duration)) || Number(movieData.Duration) < 1) {
    missingFields.push('duracion');
  }

  if (!Number.isFinite(Number(movieData.AgeLimit)) || Number(movieData.AgeLimit) < 0) {
    missingFields.push('clasificacion de edad');
  }

  return missingFields;
}

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new movie
router.post('/', requireAdmin, async (req, res) => {
  try {
    const movieData = normalizeMoviePayload(req.body);
    const missingFields = getMissingMovieFields(movieData);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Para guardar la pelicula debes completar: ${missingFields.join(', ')}`
      });
    }

    const movie = new Movie(movieData);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update movie
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movieData = normalizeMoviePayload(req.body);
    movie.set(movieData);

    const missingFields = getMissingMovieFields(movie);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Para guardar la pelicula debes completar: ${missingFields.join(', ')}`
      });
    }

    await movie.save();
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE movie
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      message: 'Movie and all related data deleted successfully',
      movie
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
