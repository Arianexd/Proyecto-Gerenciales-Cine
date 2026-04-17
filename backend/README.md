# Backend API - Cinema Booking System

Express.js REST API backend for the CinemaBook cinema ticket booking system.

## Overview

The backend provides a complete RESTful API for managing all aspects of the cinema booking system, including customers, movies, halls, seats, sessions, reservations, payments, and tickets.

## Tech Stack

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **qrcode** - QR code generation for tickets

## Installation

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp env.example .env
```

4. **Edit `.env` file**
```env
MONGODB_URI=mongodb://localhost:27017/cinema_booking
PORT=3000
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cinema_booking
```

5. **Start MongoDB** (if running locally)
```bash
mongod
```

## Database Setup

### MongoDB Connection

The backend automatically connects to MongoDB on startup. Ensure MongoDB is running or your MongoDB Atlas connection string is correct.

### Database Seeding

The `seed.js` script populates the database with sample data for testing and development.

#### Running the Seed Script

```bash
npm run seed
```

#### What Gets Seeded

The seed script creates the following sample data:

1. **3 Customers**
   - Ahmet Yilmaz
   - Ayse Kaya
   - Mehmet Demir

2. **3 Movies** (with full details)
   - Inception (Sci-Fi, 148 min, Rating: 8.8)
   - The Dark Knight (Action, 152 min, Rating: 9.0)
   - Interstellar (Sci-Fi, 169 min, Rating: 8.6)
   - Includes poster URLs, director, cast, and trailer links

3. **3 Halls**
   - Hall A (150 seats)
   - Hall B (200 seats)
   - Hall C (100 seats)

4. **Auto-Generated Seats**
   - Seats are automatically generated based on hall capacity
   - 15 seats per row
   - Quality assigned based on position:
     - Front rows (first 20%): Average/Good quality
     - Middle rows (20-70%): Excellent/Good quality (center seats)
     - Back rows (70-100%): Good/Average quality
   - Each seat has `ScreenViewInfo` and `AcousticProfile` ratings

5. **4 Movie Sessions**
   - Various times and dates
   - Different halls and prices
   - Multiple languages and subtitle options

6. **4 Reservations**
   - Mix of CREATED and PAID statuses
   - Linked to customers and sessions

7. **3 Payments**
   - Only for PAID reservations
   - Various payment methods (Credit Card, Debit Card)
   - Different amounts

8. **4 Tickets with QR Codes**
   - Unique ticket codes (format: `TKT-{timestamp}-{random}`)
   - QR codes generated as base64 images
   - Contains ticket information in JSON format
   - Some tickets marked as checked in

#### Seed Script Details

The seed script (`seed.js`) performs the following operations:

1. **Connects to MongoDB** using the connection string from `.env`
2. **Clears all existing data** from all collections
3. **Inserts sample data** in the correct order (respecting foreign key relationships)
4. **Generates seats automatically** using the `generateSeatsForHall` function:
   - Calculates number of rows based on capacity
   - Assigns row letters (A, B, C, etc.)
   - Determines seat quality based on position
   - Creates seat records with quality ratings
5. **Generates QR codes** for tickets using the `qrcode` package
6. **Outputs summary** of all created records

#### Customizing Seed Data

To modify the seed data, edit `seed.js`:

- Change customer information in the `customers` array
- Modify movie details in the `movies` array
- Adjust hall capacities in the `halls` array
- Modify seat generation logic in `generateSeatsForHall` function
- Update session dates, times, and prices
- Change reservation and payment data

## Running the Server

### Development Mode
```bash
npm run dev
```
Uses `nodemon` for automatic server restart on file changes.

### Production Mode
```bash
npm start
```
Runs the server using `node server.js`.

The server will start on port 3000 (or the port specified in `.env`).

### Health Check

Test if the server is running:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Cinema Booking API is running"
}
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all movies |
| GET | `/api/movies/:id` | Get movie by ID |
| POST | `/api/movies` | Create new movie |
| PUT | `/api/movies/:id` | Update movie |
| DELETE | `/api/movies/:id` | Delete movie |

**Movie Schema:**
```javascript
{
  MovieName: String (required),
  Genre: String (required),
  Duration: Number (required, min: 1),
  AgeLimit: Number (required, min: 0),
  Description: String (required),
  PosterURL: String (required),
  Director: String (required),
  Cast: [String] (required),
  Rating: Number (required, min: 0, max: 10),
  TrailerURL: String (optional)
}
```

### Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | Get all sessions (populated) |
| GET | `/api/sessions/:id` | Get session by ID |
| POST | `/api/sessions` | Create new session |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |

**Session Schema:**
```javascript
{
  MovieID: ObjectId (required, ref: 'Movie'),
  HallID: ObjectId (required, ref: 'Hall'),
  SessionDateTime: Date (required),
  Price: Number (required),
  Language: String (required),
  SubtitleInfo: String (required)
}
```

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reservations` | Get all reservations (populated) |
| GET | `/api/reservations/:id` | Get reservation by ID |
| POST | `/api/reservations` | Create new reservation |
| PUT | `/api/reservations/:id` | Update reservation |
| DELETE | `/api/reservations/:id` | Delete reservation |

**Reservation Schema:**
```javascript
{
  CustomerID: ObjectId (required, ref: 'Customer'),
  SessionID: ObjectId (required, ref: 'MovieSession'),
  CreationTime: Date (default: Date.now),
  Status: String (enum: ['CREATED', 'PAID', 'CANCELLED'], default: 'CREATED')
}
```

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Get all customers |
| GET | `/api/customers/:id` | Get customer by ID |
| POST | `/api/customers` | Create new customer |
| PUT | `/api/customers/:id` | Update customer |
| DELETE | `/api/customers/:id` | Delete customer |

**Customer Schema:**
```javascript
{
  Name: String (required),
  Surname: String (required),
  Email: String (required),
  PhoneNumber: String (required)
}
```

### Halls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/halls` | Get all halls |
| GET | `/api/halls/:id` | Get hall by ID |
| POST | `/api/halls` | Create new hall |
| PUT | `/api/halls/:id` | Update hall |
| DELETE | `/api/halls/:id` | Delete hall |

**Hall Schema:**
```javascript
{
  HallName: String (required),
  Capacity: Number (required)
}
```

### Seats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seats?hallId=<id>` | Get all seats (optional filter by hall) |
| GET | `/api/seats/:id` | Get seat by ID |
| POST | `/api/seats` | Create new seat |
| PUT | `/api/seats/:id` | Update seat |
| DELETE | `/api/seats/:id` | Delete seat |

**Seat Schema:**
```javascript
{
  HallID: ObjectId (required, ref: 'Hall'),
  RowNumber: String (required),
  SeatNumber: Number (required, min: 1),
  ScreenViewInfo: String (enum: ['Excellent', 'Good', 'Average', 'Poor']),
  AcousticProfile: String (enum: ['Excellent', 'Good', 'Average', 'Poor'])
}
```

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get all payments |
| GET | `/api/payments/:id` | Get payment by ID |
| POST | `/api/payments` | Create new payment |
| PUT | `/api/payments/:id` | Update payment |
| DELETE | `/api/payments/:id` | Delete payment |

**Payment Schema:**
```javascript
{
  ReservationID: ObjectId (required, ref: 'Reservation'),
  PaymentMethod: String (enum: ['Credit Card', 'Debit Card', 'Cash', 'Online']),
  Amount: Number (required),
  PaymentStatus: String (enum: ['Pending', 'Completed', 'Failed', 'Refunded']),
  ProcessingTime: Date (required)
}
```

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets (populated) |
| GET | `/api/tickets/:id` | Get ticket by ID |
| POST | `/api/tickets` | Create new ticket |
| PUT | `/api/tickets/:id` | Update ticket (check-in status) |
| DELETE | `/api/tickets/:id` | Delete ticket |

**Ticket Schema:**
```javascript
{
  ReservationID: ObjectId (required, ref: 'Reservation'),
  SeatID: ObjectId (required, ref: 'Seat'),
  TicketCode: String (required, unique),
  QRCode: String (required, base64 image),
  CheckInStatus: Boolean (default: false)
}
```

## Models

All models are located in the `models/` directory:

1. **Customer.js** - Customer information
2. **Movie.js** - Movie catalog
3. **Hall.js** - Cinema halls
4. **Seat.js** - Hall seats with quality ratings
5. **MovieSession.js** - Scheduled movie screenings
6. **Reservation.js** - Customer bookings
7. **Payment.js** - Payment transactions
8. **Ticket.js** - Generated tickets with QR codes

All models include:
- Mongoose schema definitions
- Field validations
- Timestamps (createdAt, updatedAt)
- References to other models where applicable

## Routes

All routes are located in the `routes/` directory:

- `customers.js` - Customer CRUD operations
- `movies.js` - Movie CRUD operations
- `halls.js` - Hall CRUD operations
- `seats.js` - Seat CRUD operations
- `sessions.js` - Session CRUD operations
- `reservations.js` - Reservation CRUD operations
- `payments.js` - Payment CRUD operations
- `tickets.js` - Ticket CRUD operations

Routes are registered in `server.js` with the prefix `/api`.

## Error Handling

The API includes error handling middleware that:
- Catches all errors
- Returns appropriate HTTP status codes
- Provides error messages in JSON format

Example error response:
```json
{
  "error": "Something went wrong!",
  "message": "Detailed error message"
}
```

## CORS Configuration

CORS is enabled to allow requests from the frontend. The backend accepts requests from:
- `http://localhost:5173` (development)
- `https://sinema.ardademir.com.tr` (production)

## Testing the API

### Using cURL

```bash
# Get all movies
curl http://localhost:3000/api/movies

# Get a specific movie
curl http://localhost:3000/api/movies/{id}

# Create a new movie
curl -X POST http://localhost:3000/api/movies \
  -H "Content-Type: application/json" \
  -d '{
    "MovieName": "Test Movie",
    "Genre": "Action",
    "Duration": 120,
    "AgeLimit": 13,
    "Description": "A test movie",
    "PosterURL": "https://example.com/poster.jpg",
    "Director": "Test Director",
    "Cast": ["Actor 1", "Actor 2"],
    "Rating": 8.5
  }'
```

### Using Postman

Import the API endpoints into Postman and test all CRUD operations.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `.env`
- For MongoDB Atlas, ensure IP whitelist is configured

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 3000

### Module Not Found
- Run `npm install` again
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Configure proper CORS origins
4. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name cinema-api
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

