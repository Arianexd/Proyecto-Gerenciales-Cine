const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { connectToDatabase, REQUIRED_DB_TARGET } = require('./config/database');

const Customer = require('./models/Customer');
const Movie = require('./models/Movie');
const Hall = require('./models/Hall');
const Seat = require('./models/Seat');
const MovieSession = require('./models/MovieSession');
const Reservation = require('./models/Reservation');
const Payment = require('./models/Payment');
const Ticket = require('./models/Ticket');
const User = require('./models/User');
const Review = require('./models/Review');
const SnackCategory = require('./models/SnackCategory');
const SnackProduct = require('./models/SnackProduct');
const { refreshMovieReviewStats } = require('./utils/movieRatings');
const { generateTicketCode } = require('./utils/tickets');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log(`MongoDB connected to ${REQUIRED_DB_TARGET}`);

    // Clear existing data
    await Customer.deleteMany({});
    await Movie.deleteMany({});
    await Hall.deleteMany({});
    await Seat.deleteMany({});
    await MovieSession.deleteMany({});
    await Reservation.deleteMany({});
    await Payment.deleteMany({});
    await Ticket.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    await SnackCategory.deleteMany({});
    await SnackProduct.deleteMany({});
    console.log('Cleared existing data');

    // INSERT CUSTOMERS (3 records)
    const customers = await Customer.insertMany([
      {
        Name: 'Ahmet',
        Surname: 'Yilmaz',
        CI: '1234567890',
        Gender: 'Male',
        Age: 30,
        Email: 'ahmet@email.com',
        PhoneNumber: '5551234567'
      },
      {
        Name: 'Ayse',
        Surname: 'Kaya',
        CI: '0987654321',
        Gender: 'Female',
        Age: 25,
        Email: 'ayse@email.com',
        PhoneNumber: '5559876543'
      },
      {
        Name: 'Mehmet',
        Surname: 'Demir',
        CI: '1122334455',
        Gender: 'Male',
        Age: 35,
        Email: 'mehmet@email.com',
        PhoneNumber: '5555555555'
      }
    ]);
    console.log('Seeded customers:', customers.length);

    const customerPasswordHash = await bcrypt.hash('demo123', 10);

    await User.insertMany([
      {
        Username: 'ahmet',
        Email: customers[0].Email,
        PasswordHash: customerPasswordHash,
        Role: 'CUSTOMER',
        CustomerID: customers[0]._id
      },
      {
        Username: 'ayse',
        Email: customers[1].Email,
        PasswordHash: customerPasswordHash,
        Role: 'CUSTOMER',
        CustomerID: customers[1]._id
      },
      {
        Username: 'cliente',
        Email: customers[2].Email,
        PasswordHash: await bcrypt.hash('cliente', 10),
        Role: 'CUSTOMER',
        CustomerID: customers[2]._id
      },
      {
        Username: 'admin',
        Email: 'admin@cinebook.local',
        PasswordHash: await bcrypt.hash('admin', 10),
        Role: 'ADMIN'
      },
      {
        Username: 'cajero',
        Email: 'cajero@cinebook.local',
        PasswordHash: await bcrypt.hash('cajero', 10),
        Role: 'CAJERO'
      }
    ]);
    console.log('Seeded users: 5');

    // INSERT MOVIES (with poster URLs and details)
    const movies = await Movie.insertMany([
      {
        MovieName: 'Inception',
        Genre: 'Sci-Fi',
        Duration: 148,
        AgeLimit: 13,
        Description: 'A thief who steals secrets through dreams',
        PosterURL: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        Director: 'Christopher Nolan',
        Cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy'],
        Rating: 8.8,
        TrailerURL: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
      },
      {
        MovieName: 'The Dark Knight',
        Genre: 'Action',
        Duration: 152,
        AgeLimit: 13,
        Description: 'Batman faces the Joker',
        PosterURL: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        Director: 'Christopher Nolan',
        Cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
        Rating: 9.0,
        TrailerURL: 'https://www.youtube.com/watch?v=EXeTwQWrcwY'
      },
      {
        MovieName: 'Interstellar',
        Genre: 'Sci-Fi',
        Duration: 169,
        AgeLimit: 13,
        Description: 'Space exploration through wormhole',
        PosterURL: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        Director: 'Christopher Nolan',
        Cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        Rating: 8.6,
        TrailerURL: 'https://www.youtube.com/watch?v=zSWdZVtXT7E'
      },
      {
        MovieName: 'Dune: Part Two',
        Genre: 'Sci-Fi',
        Duration: 166,
        AgeLimit: 13,
        Description: 'Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family.',
        PosterURL: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        Director: 'Denis Villeneuve',
        Cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
        Rating: 8.5,
        TrailerURL: 'https://www.youtube.com/watch?v=Way9Dexny3w'
      },
      {
        MovieName: 'Oppenheimer',
        Genre: 'Drama',
        Duration: 180,
        AgeLimit: 16,
        Description: 'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
        PosterURL: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        Director: 'Christopher Nolan',
        Cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.', 'Matt Damon'],
        Rating: 8.4,
        TrailerURL: 'https://www.youtube.com/watch?v=uYPbbksJxIg'
      },
      {
        MovieName: 'Spider-Man: Across the Spider-Verse',
        Genre: 'Animation',
        Duration: 140,
        AgeLimit: 7,
        Description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People.',
        PosterURL: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        Director: 'Joaquim Dos Santos',
        Cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Jake Johnson'],
        Rating: 8.7,
        TrailerURL: 'https://www.youtube.com/watch?v=cqGjhVJWtEg'
      },
      {
        MovieName: 'Barbie',
        Genre: 'Comedy',
        Duration: 114,
        AgeLimit: 13,
        Description: 'Barbie suffers a crisis that leads her to question her world and her existence.',
        PosterURL: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
        Director: 'Greta Gerwig',
        Cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Kate McKinnon'],
        Rating: 7.0,
        TrailerURL: 'https://www.youtube.com/watch?v=pBk4NYhWNMM'
      },
      {
        MovieName: 'The Batman',
        Genre: 'Action',
        Duration: 176,
        AgeLimit: 13,
        Description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.',
        PosterURL: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
        Director: 'Matt Reeves',
        Cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano', 'Colin Farrell'],
        Rating: 7.8,
        TrailerURL: 'https://www.youtube.com/watch?v=mqqft2x_Aa4'
      }
    ]);
    console.log('Seeded movies:', movies.length);

    // INSERT HALLS (3 records)
    const halls = await Hall.insertMany([
      {
        HallName: 'Hall A',
        Capacity: 150
      },
      {
        HallName: 'Hall B',
        Capacity: 200
      },
      {
        HallName: 'Hall C',
        Capacity: 100
      }
    ]);
    console.log('Seeded halls:', halls.length);

    // INSERT SEATS - Auto-generate based on hall capacity
    const seatsToInsert = [];
    
    // Function to generate seats for a hall
    const generateSeatsForHall = (hallId, capacity) => {
      const seatsPerRow = 15; // 15 seats per row
      const totalRows = Math.ceil(capacity / seatsPerRow);
      const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const rowLetter = rowLetters[rowIndex] || `${rowLetters[Math.floor(rowIndex / 26)]}${rowLetters[rowIndex % 26]}`;
        const seatsInThisRow = Math.min(seatsPerRow, capacity - (rowIndex * seatsPerRow));
        
        for (let seatNum = 1; seatNum <= seatsInThisRow; seatNum++) {
          // Determine quality based on position
          let viewQuality, acousticQuality;
          
          // Front rows (first 20%)
          if (rowIndex < totalRows * 0.2) {
            viewQuality = seatNum >= 5 && seatNum <= 11 ? 'Good' : 'Average';
            acousticQuality = 'Average';
          }
          // Middle rows (20-70%)
          else if (rowIndex < totalRows * 0.7) {
            if (seatNum >= 4 && seatNum <= 12) {
              viewQuality = 'Excellent';
              acousticQuality = 'Excellent';
            } else if (seatNum >= 3 && seatNum <= 13) {
              viewQuality = 'Good';
              acousticQuality = 'Good';
            } else {
              viewQuality = 'Average';
              acousticQuality = 'Average';
            }
          }
          // Back rows (70-100%)
          else {
            viewQuality = seatNum >= 5 && seatNum <= 11 ? 'Good' : 'Average';
            acousticQuality = seatNum >= 4 && seatNum <= 12 ? 'Good' : 'Average';
          }
          
          seatsToInsert.push({
            HallID: hallId,
            RowNumber: rowLetter,
            SeatNumber: seatNum,
            ScreenViewInfo: viewQuality,
            AcousticProfile: acousticQuality
          });
        }
      }
    };
    
    // Generate seats for each hall
    generateSeatsForHall(halls[0]._id, halls[0].Capacity); // Hall A - 150 seats
    generateSeatsForHall(halls[1]._id, halls[1].Capacity); // Hall B - 200 seats
    generateSeatsForHall(halls[2]._id, halls[2].Capacity); // Hall C - 100 seats
    
    const seats = await Seat.insertMany(seatsToInsert);
    console.log('Seeded seats:', seats.length);

    const getSeatByPosition = (hallId, rowNumber, seatNumber) =>
      seats.find((seat) =>
        seat.HallID.toString() === hallId.toString() &&
        seat.RowNumber === rowNumber &&
        seat.SeatNumber === seatNumber
      );

    // INSERT SESSIONS — generated dynamically across the next 7 days
    // so the catalog always has future functions to choose from.
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    baseDate.setDate(baseDate.getDate() + 1); // start tomorrow

    const buildSession = (dayOffset, hour, minute, movieIdx, hallIdx, price, language = 'Spanish', subtitle = 'None') => {
      const dt = new Date(baseDate);
      dt.setDate(dt.getDate() + dayOffset);
      dt.setHours(hour, minute, 0, 0);
      return {
        MovieID: movies[movieIdx]._id,
        HallID: halls[hallIdx]._id,
        SessionDateTime: dt,
        Price: price,
        Language: language,
        SubtitleInfo: subtitle
      };
    };

    const sessionDefs = [];
    // Day 0 (tomorrow) — first 4 entries kept aligned with the seeded reservations below
    sessionDefs.push(buildSession(0, 14, 0, 0, 0, 50, 'English', 'Spanish')); // [0] Inception / Hall A
    sessionDefs.push(buildSession(0, 17, 0, 1, 1, 60, 'English', 'Spanish')); // [1] Dark Knight / Hall B
    sessionDefs.push(buildSession(0, 20, 0, 2, 0, 55, 'English', 'Spanish')); // [2] Interstellar / Hall A
    sessionDefs.push(buildSession(1, 15, 0, 0, 2, 45, 'Spanish', 'None'));    // [3] Inception / Hall C
    // Extra functions
    sessionDefs.push(buildSession(0, 16, 30, 3, 2, 65, 'English', 'Spanish'));
    sessionDefs.push(buildSession(0, 19, 30, 4, 1, 70, 'English', 'Spanish'));
    sessionDefs.push(buildSession(0, 21, 0, 7, 2, 60, 'English', 'Spanish'));
    // Day 1
    sessionDefs.push(buildSession(1, 13, 0, 5, 0, 45, 'Spanish', 'None'));
    sessionDefs.push(buildSession(1, 15, 30, 6, 1, 50, 'English', 'Spanish'));
    sessionDefs.push(buildSession(1, 16, 0, 0, 2, 50, 'English', 'Spanish'));
    sessionDefs.push(buildSession(1, 18, 0, 3, 0, 65, 'English', 'Spanish'));
    sessionDefs.push(buildSession(1, 19, 30, 4, 1, 70, 'English', 'Spanish'));
    sessionDefs.push(buildSession(1, 21, 30, 1, 2, 60, 'English', 'Spanish'));
    // Day 2
    sessionDefs.push(buildSession(2, 14, 0, 7, 0, 60, 'English', 'Spanish'));
    sessionDefs.push(buildSession(2, 16, 0, 2, 1, 55, 'English', 'Spanish'));
    sessionDefs.push(buildSession(2, 18, 30, 5, 2, 45, 'Spanish', 'None'));
    sessionDefs.push(buildSession(2, 20, 0, 6, 0, 50, 'English', 'Spanish'));
    sessionDefs.push(buildSession(2, 21, 0, 0, 1, 50, 'English', 'Spanish'));
    // Day 3
    sessionDefs.push(buildSession(3, 15, 0, 4, 0, 70, 'English', 'Spanish'));
    sessionDefs.push(buildSession(3, 17, 30, 3, 1, 65, 'English', 'Spanish'));
    sessionDefs.push(buildSession(3, 19, 0, 1, 2, 60, 'English', 'Spanish'));
    sessionDefs.push(buildSession(3, 21, 0, 2, 0, 55, 'English', 'Spanish'));
    // Day 4
    sessionDefs.push(buildSession(4, 14, 30, 6, 0, 50, 'English', 'Spanish'));
    sessionDefs.push(buildSession(4, 17, 0, 7, 1, 60, 'English', 'Spanish'));
    sessionDefs.push(buildSession(4, 20, 0, 0, 2, 50, 'English', 'Spanish'));
    // Day 5
    sessionDefs.push(buildSession(5, 16, 0, 5, 0, 45, 'Spanish', 'None'));
    sessionDefs.push(buildSession(5, 18, 30, 4, 1, 70, 'English', 'Spanish'));
    sessionDefs.push(buildSession(5, 21, 0, 3, 2, 65, 'English', 'Spanish'));
    // Day 6
    sessionDefs.push(buildSession(6, 15, 0, 1, 0, 60, 'English', 'Spanish'));
    sessionDefs.push(buildSession(6, 18, 0, 2, 1, 55, 'English', 'Spanish'));
    sessionDefs.push(buildSession(6, 20, 30, 7, 2, 60, 'English', 'Spanish'));

    const sessions = await MovieSession.insertMany(sessionDefs);
    console.log('Seeded sessions:', sessions.length);

    // INSERT RESERVATIONS (4 records)
    const reservations = await Reservation.insertMany([
      {
        CustomerID: customers[0]._id, // Ahmet
        SessionID: sessions[0]._id, // Inception - Hall A
        SeatIDs: [getSeatByPosition(halls[0]._id, 'A', 1)._id],
        CreationTime: new Date('2025-12-15T10:30:00'),
        Status: 'PAID'
      },
      {
        CustomerID: customers[1]._id, // Ayse
        SessionID: sessions[1]._id, // The Dark Knight - Hall B
        SeatIDs: [
          getSeatByPosition(halls[1]._id, 'A', 1)._id,
          getSeatByPosition(halls[1]._id, 'A', 2)._id
        ],
        CreationTime: new Date('2025-12-16T14:20:00'),
        Status: 'PAID'
      },
      {
        CustomerID: customers[2]._id, // Mehmet
        SessionID: sessions[2]._id, // Interstellar - Hall A
        SeatIDs: [getSeatByPosition(halls[0]._id, 'B', 5)._id],
        CreationTime: new Date('2025-12-17T09:00:00'),
        Status: 'CREATED'
      },
      {
        CustomerID: customers[0]._id, // Ahmet
        SessionID: sessions[3]._id, // Inception - Hall C
        SeatIDs: [getSeatByPosition(halls[2]._id, 'A', 1)._id],
        CreationTime: new Date('2025-12-18T11:00:00'),
        Status: 'PAID'
      }
    ]);
    console.log('Seeded reservations:', reservations.length);

    // INSERT PAYMENTS (3 records - only for PAID reservations)
    const payments = await Payment.insertMany([
      {
        ReservationID: reservations[0]._id,
        PaymentMethod: 'Credit Card',
        Amount: 50,
        PaymentStatus: 'Completed',
        ProcessingTime: new Date('2025-12-15T10:31:00')
      },
      {
        ReservationID: reservations[1]._id,
        PaymentMethod: 'Debit Card',
        Amount: 120, // 2 seats × 60
        PaymentStatus: 'Completed',
        ProcessingTime: new Date('2025-12-16T14:21:00')
      },
      {
        ReservationID: reservations[3]._id,
        PaymentMethod: 'Credit Card',
        Amount: 45,
        PaymentStatus: 'Completed',
        ProcessingTime: new Date('2025-12-18T11:01:00')
      }
    ]);
    console.log('Seeded payments:', payments.length);

    // INSERT TICKETS (4 records) with realistic QR codes
    const QRCode = require('qrcode');

    // Create tickets with detailed QR code data
    const ticketData = [
      {
        ReservationID: reservations[0]._id,
        SeatID: getSeatByPosition(halls[0]._id, 'A', 1)._id,
        CustomerName: customers[0].Name + ' ' + customers[0].Surname,
        MovieName: movies[0].MovieName,
        HallName: halls[0].HallName,
        SeatInfo: 'A1'
      },
      {
        ReservationID: reservations[1]._id,
        SeatID: getSeatByPosition(halls[1]._id, 'A', 1)._id,
        CustomerName: customers[1].Name + ' ' + customers[1].Surname,
        MovieName: movies[1].MovieName,
        HallName: halls[1].HallName,
        SeatInfo: 'A1'
      },
      {
        ReservationID: reservations[1]._id,
        SeatID: getSeatByPosition(halls[1]._id, 'A', 2)._id,
        CustomerName: customers[1].Name + ' ' + customers[1].Surname,
        MovieName: movies[1].MovieName,
        HallName: halls[1].HallName,
        SeatInfo: 'A2'
      },
      {
        ReservationID: reservations[3]._id,
        SeatID: getSeatByPosition(halls[2]._id, 'A', 1)._id,
        CustomerName: customers[0].Name + ' ' + customers[0].Surname,
        MovieName: movies[0].MovieName,
        HallName: halls[2].HallName,
        SeatInfo: 'A1'
      }
    ];

    const ticketsToInsert = [];
    
    for (let i = 0; i < ticketData.length; i++) {
      const data = ticketData[i];
      const ticketCode = generateTicketCode();
      
      // Create comprehensive QR code data
      const qrData = JSON.stringify({
        ticketCode: ticketCode,
        reservationId: data.ReservationID.toString(),
        customer: data.CustomerName,
        movie: data.MovieName,
        hall: data.HallName,
        seat: data.SeatInfo,
        issueDate: new Date().toISOString()
      });
      
      // Generate QR code as base64 image
      const qrCodeImage = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1
      });
      
      ticketsToInsert.push({
        ReservationID: data.ReservationID,
        SeatID: data.SeatID,
        TicketCode: ticketCode,
        QRCode: qrCodeImage,
        CheckInStatus: i === 1 || i === 2 ? true : false
      });
      
      console.log(`Generated ticket: ${ticketCode} for ${data.CustomerName}`);
    }

    const tickets = await Ticket.insertMany(ticketsToInsert);
    console.log('Seeded tickets:', tickets.length);

    const reviews = await Review.insertMany([
      {
        CustomerID: customers[0]._id,
        MovieID: movies[0]._id,
        ReservationID: reservations[0]._id,
        Score: 5,
        Comment: 'Una experiencia increíble. La volvería a ver sin dudarlo.'
      },
      {
        CustomerID: customers[1]._id,
        MovieID: movies[1]._id,
        ReservationID: reservations[1]._id,
        Score: 4,
        Comment: 'Muy buena película y el sonido estuvo excelente.'
      }
    ]);
    console.log('Seeded reviews:', reviews.length);

    await refreshMovieReviewStats(movies[0]._id);
    await refreshMovieReviewStats(movies[1]._id);

    // ─── SNACK CATEGORIES ─────────────────────────────────
    const snackCategories = await SnackCategory.insertMany([
      { Name: 'Bebidas', Description: 'Refrescos, jugos y agua', IsActive: true },
      { Name: 'Palomitas', Description: 'Palomitas de maíz en distintos sabores y tamaños', IsActive: true },
      { Name: 'Dulces', Description: 'Chocolates, gomitas y caramelos', IsActive: true },
      { Name: 'Nachos y Snacks', Description: 'Nachos, papas y botanas saladas', IsActive: true },
      { Name: 'Combos', Description: 'Combos especiales para dos o más personas', IsActive: true }
    ]);
    console.log('Seeded snack categories:', snackCategories.length);

    const [bebidas, palomitas, dulces, nachos, combos] = snackCategories;

    const snackProducts = await SnackProduct.insertMany([
      // Bebidas
      { Name: 'Coca-Cola 600ml', Description: 'Refresco clásico helado', Category: bebidas._id, SalePrice: 45, Stock: 100, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&q=80' },
      { Name: 'Agua Natural 600ml', Description: 'Agua purificada fría', Category: bebidas._id, SalePrice: 25, Stock: 80, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80' },
      { Name: 'Jugo de Naranja', Description: 'Jugo natural 355ml', Category: bebidas._id, SalePrice: 35, Stock: 60, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80' },
      { Name: 'Pepsi 600ml', Description: 'Refresco cola 600ml', Category: bebidas._id, SalePrice: 40, Stock: 90, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=600&q=80' },
      // Palomitas
      { Name: 'Palomitas Chicas', Description: 'Palomitas de mantequilla tamaño chico', Category: palomitas._id, SalePrice: 55, Stock: 50, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&q=80' },
      { Name: 'Palomitas Medianas', Description: 'Palomitas de mantequilla tamaño mediano', Category: palomitas._id, SalePrice: 75, Stock: 50, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&q=80' },
      { Name: 'Palomitas Grandes', Description: 'Palomitas de mantequilla tamaño grande', Category: palomitas._id, SalePrice: 95, Stock: 40, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80' },
      { Name: 'Palomitas Caramelo', Description: 'Palomitas dulces de caramelo', Category: palomitas._id, SalePrice: 85, Stock: 30, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1571846268303-7b1eb2cb8c3e?w=600&q=80' },
      // Dulces
      { Name: 'Chocolate M&Ms', Description: 'Chocolates de colores 200g', Category: dulces._id, SalePrice: 50, Stock: 70, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&q=80' },
      { Name: 'Gomitas Ositos', Description: 'Gomitas multicolor 150g', Category: dulces._id, SalePrice: 35, Stock: 60, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600&q=80' },
      { Name: 'Snickers', Description: 'Barra de chocolate con cacahuate', Category: dulces._id, SalePrice: 30, Stock: 80, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1623941442420-9f95397ec6a5?w=600&q=80' },
      // Nachos
      { Name: 'Nachos con Queso', Description: 'Nachos con salsa de queso caliente', Category: nachos._id, SalePrice: 75, Stock: 40, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=600&q=80' },
      { Name: 'Papas Fritas', Description: 'Papas fritas crujientes saladas', Category: nachos._id, SalePrice: 45, Stock: 50, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80' },
      { Name: 'Hot Dogs', Description: 'Salchicha en pan con salsas', Category: nachos._id, SalePrice: 65, Stock: 35, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1612392062798-2cc2cdcae9b9?w=600&q=80' },
      // Combos
      { Name: 'Combo Pareja', Description: 'Palomitas grandes + 2 refrescos medianos', Category: combos._id, SalePrice: 160, Stock: 25, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&q=80' },
      { Name: 'Combo Familiar', Description: 'Palomitas XL + 4 refrescos + nachos', Category: combos._id, SalePrice: 280, Stock: 20, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1627843240167-b1f9440fc173?w=600&q=80' },
      { Name: 'Combo Personal', Description: 'Palomitas medianas + refresco', Category: combos._id, SalePrice: 110, Stock: 30, IsActive: true,
        ImageURL: 'https://images.unsplash.com/photo-1626423642369-9eaeb723be3a?w=600&q=80' }
    ]);
    console.log('Seeded snack products:', snackProducts.length);

    console.log('\n✅ Database seeded successfully!');
    console.log('-----------------------------------');
    console.log(`Customers: ${customers.length}`);
    console.log(`Movies: ${movies.length}`);
    console.log(`Halls: ${halls.length}`);
    console.log(`Seats: ${seats.length}`);
    console.log(`Sessions: ${sessions.length}`);
    console.log(`Reservations: ${reservations.length}`);
    console.log(`Payments: ${payments.length}`);
    console.log(`Tickets: ${tickets.length}`);
    console.log(`Reviews: ${reviews.length}`);
    console.log(`Snack categories: ${snackCategories.length}`);
    console.log(`Snack products: ${snackProducts.length}`);
    console.log('Admin login: admin / admin');
    console.log('Cajero login: cajero / cajero');
    console.log('Customer login: ahmet / demo123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
