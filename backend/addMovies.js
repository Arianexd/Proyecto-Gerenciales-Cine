const mongoose = require('mongoose');
require('dotenv').config();
const { connectToDatabase, REQUIRED_DB_TARGET } = require('./config/database');

const Movie = require('./models/Movie');
const Hall = require('./models/Hall');
const MovieSession = require('./models/MovieSession');

const NEW_MOVIES = [
  {
    MovieName: 'Avatar: The Way of Water',
    Genre: 'Sci-Fi',
    Duration: 192,
    AgeLimit: 13,
    Description: 'Jake Sully y Neytiri protegen a su familia de una nueva amenaza en Pandora.',
    PosterURL: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    Director: 'James Cameron',
    Cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    Rating: 7.6,
    TrailerURL: 'https://www.youtube.com/watch?v=d9MyW72ELq0'
  },
  {
    MovieName: 'Top Gun: Maverick',
    Genre: 'Action',
    Duration: 130,
    AgeLimit: 13,
    Description: 'Maverick regresa para entrenar a una nueva generación de pilotos de élite.',
    PosterURL: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    Director: 'Joseph Kosinski',
    Cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Val Kilmer'],
    Rating: 8.3,
    TrailerURL: 'https://www.youtube.com/watch?v=qSqVVswa420'
  },
  {
    MovieName: 'Everything Everywhere All at Once',
    Genre: 'Sci-Fi',
    Duration: 139,
    AgeLimit: 13,
    Description: 'Una mujer descubre que debe conectar con vidas paralelas para salvar el multiverso.',
    PosterURL: 'https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg',
    Director: 'Daniels',
    Cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Jamie Lee Curtis', 'Stephanie Hsu'],
    Rating: 7.8,
    TrailerURL: 'https://www.youtube.com/watch?v=wxN1T1uxQ2g'
  },
  {
    MovieName: 'Joker',
    Genre: 'Drama',
    Duration: 122,
    AgeLimit: 16,
    Description: 'Arthur Fleck, un comediante fallido, desciende a la locura en Gotham.',
    PosterURL: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    Director: 'Todd Phillips',
    Cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz', 'Frances Conroy'],
    Rating: 8.4,
    TrailerURL: 'https://www.youtube.com/watch?v=zAGVQLHvwOY'
  },
  {
    MovieName: 'Parasite',
    Genre: 'Thriller',
    Duration: 132,
    AgeLimit: 16,
    Description: 'Una familia pobre se infiltra en la vida de una familia adinerada con consecuencias inesperadas.',
    PosterURL: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    Director: 'Bong Joon-ho',
    Cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    Rating: 8.5,
    TrailerURL: 'https://www.youtube.com/watch?v=5xH0HfJHsaY'
  }
];

(async () => {
  try {
    await connectToDatabase();
    console.log(`Connected to ${REQUIRED_DB_TARGET}`);

    const halls = await Hall.find({});
    if (halls.length === 0) {
      throw new Error('No hay salas en la BD. Corre `npm run seed` primero.');
    }
    console.log(`Salas disponibles: ${halls.length}`);

    // Insert only movies that don't already exist (by MovieName)
    const existingNames = new Set(
      (await Movie.find({ MovieName: { $in: NEW_MOVIES.map((m) => m.MovieName) } })).map(
        (m) => m.MovieName
      )
    );
    const moviesToInsert = NEW_MOVIES.filter((m) => !existingNames.has(m.MovieName));

    let insertedMovies = [];
    if (moviesToInsert.length > 0) {
      insertedMovies = await Movie.insertMany(moviesToInsert);
      console.log(`Películas nuevas insertadas: ${insertedMovies.length}`);
    } else {
      console.log('Todas las películas ya existían — no se insertaron películas nuevas.');
    }

    // For session generation, use the inserted movies (or re-fetch by name if all existed)
    const allTargetMovies = await Movie.find({
      MovieName: { $in: NEW_MOVIES.map((m) => m.MovieName) }
    });

    // Generate sessions for next 7 days
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    baseDate.setDate(baseDate.getDate() + 1);

    const buildSession = (dayOffset, hour, minute, movie, hallIdx, price, language = 'Spanish', subtitle = 'None') => {
      const dt = new Date(baseDate);
      dt.setDate(dt.getDate() + dayOffset);
      dt.setHours(hour, minute, 0, 0);
      return {
        MovieID: movie._id,
        HallID: halls[hallIdx % halls.length]._id,
        SessionDateTime: dt,
        Price: price,
        Language: language,
        SubtitleInfo: subtitle
      };
    };

    const sessionDefs = [];
    allTargetMovies.forEach((movie, i) => {
      // 3 funciones por película repartidas en los próximos 7 días
      sessionDefs.push(buildSession(i % 7, 14, 30, movie, i, 50, 'English', 'Spanish'));
      sessionDefs.push(buildSession((i + 2) % 7, 18, 0, movie, i + 1, 60, 'English', 'Spanish'));
      sessionDefs.push(buildSession((i + 4) % 7, 21, 0, movie, i + 2, 65, 'English', 'Spanish'));
    });

    // Avoid duplicating sessions for same movie+hall+datetime
    const existingSessions = await MovieSession.find({
      MovieID: { $in: allTargetMovies.map((m) => m._id) }
    }).select('MovieID HallID SessionDateTime');

    const sigSet = new Set(
      existingSessions.map(
        (s) => `${s.MovieID}_${s.HallID}_${new Date(s.SessionDateTime).toISOString()}`
      )
    );
    const newSessions = sessionDefs.filter(
      (s) => !sigSet.has(`${s.MovieID}_${s.HallID}_${s.SessionDateTime.toISOString()}`)
    );

    if (newSessions.length > 0) {
      const inserted = await MovieSession.insertMany(newSessions);
      console.log(`Funciones nuevas insertadas: ${inserted.length}`);
    } else {
      console.log('No se insertaron funciones nuevas (ya existían).');
    }

    console.log('\n✅ Listo.');
    process.exit(0);
  } catch (err) {
    console.error('Error agregando películas:', err);
    process.exit(1);
  }
})();
