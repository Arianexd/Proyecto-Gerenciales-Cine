# 🎬 CinemaBook - Cinema Ticket Booking System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green.svg)](https://www.mongodb.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)

> **🌐 Live Site**: [https://sinema.ardademir.com.tr/](https://sinema.ardademir.com.tr/)  
> **📦 Repository**: [https://github.com/ArdaDDemir/CinemaBook](https://github.com/ArdaDDemir/CinemaBook)

A full-stack cinema ticket booking management system with advanced seat preview technology. Built with Next.js, Express.js, MongoDB, TypeScript, and Tailwind CSS. This project was developed as a homework assignment with assistance from Claude 4.5.

## 🎯 Project Overview

CinemaBook is a comprehensive cinema management system that revolutionizes the booking experience by allowing customers to preview seat quality (both visual and acoustic) before making a reservation. The system includes both a public-facing booking interface and a complete admin panel for cinema management.

### Key Features

- **🎫 Public Booking System**: Browse movies, select sessions, choose seats with quality previews, and complete bookings
- **👨‍💼 Admin Panel**: Complete CRUD operations for customers, movies, halls, sessions, reservations, payments, and tickets
- **👁️ Advanced Seat Preview**: Visual screen view preview and acoustic quality preview for each seat
- **📱 QR Code Tickets**: Automatic QR code generation for digital tickets
- **💳 Payment Processing**: Integrated payment system with reservation status tracking
- **🎨 Modern UI**: Cinema-themed design with responsive layout
- **🔐 Admin Authentication**: Secure admin login system

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ArdaDDemir/CinemaBook.git
cd CinemaBook
```

2. **Setup Backend**
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your MongoDB connection string
npm run seed  # Seed database with sample data
npm run dev   # Start backend server (port 3000)
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
cp env.local.example .env.local
# Edit .env.local with your API URL if needed
npm run dev   # Start frontend server (port 5173)
```

4. **Access the Application**
- **Public Site**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin/login
  - Username: `demo`
  - Password: `demo`
- **Backend API**: http://localhost:3000/health

For detailed setup instructions, see [Backend README](backend/README.md) and [Frontend README](frontend/README.md).

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js       │  HTTP   │   Express.js    │  ORM    │    MongoDB      │
│   Frontend      │ ◄─────► │   Backend       │ ◄─────► │   Database      │
│   Port: 5173    │  Axios  │   Port: 3000    │ Mongoose│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **QRCode** - QR code generation

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **QRCode** - Server-side QR generation

## 📁 Project Structure

```
CinemaBook/
├── backend/
│   ├── models/          # Mongoose schemas (8 collections)
│   ├── routes/          # API routes
│   ├── server.js        # Express server setup
│   ├── seed.js          # Database seeding script
│   └── package.json
│
├── frontend/
│   ├── app/             # Next.js app directory
│   │   ├── admin/       # Admin panel pages
│   │   ├── booking/     # Public booking pages
│   │   ├── movies/      # Movie pages
│   │   └── ...
│   ├── components/      # React components
│   ├── lib/             # Utilities (API client, types)
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

The system uses 8 MongoDB collections:

1. **customers** - Customer information (name, email, phone)
2. **movies** - Movie catalog (name, genre, duration, poster, director, cast, rating)
3. **halls** - Cinema halls (name, capacity)
4. **seats** - Hall seats (row, number, view quality, acoustic profile)
5. **movie_sessions** - Scheduled screenings (movie, hall, datetime, price)
6. **reservations** - Customer bookings (customer, session, status)
7. **payments** - Payment records (reservation, method, amount, status)
8. **tickets** - Generated tickets (reservation, seat, QR code, check-in status)

## 🎨 Features in Detail

### Public Booking Flow
1. Browse movies on homepage
2. View movie details and available sessions
3. Select a session and proceed to booking
4. Choose seats with real-time quality preview (visual + acoustic)
5. Enter guest information
6. Complete payment
7. Receive digital tickets with QR codes

### Admin Panel Features
- **Dashboard**: Overview statistics for all entities
- **Customer Management**: Full CRUD operations
- **Movie Management**: Add/edit movies with posters and details
- **Hall Management**: Create halls and manage seat configurations
- **Session Management**: Schedule movie screenings
- **Reservation Management**: View and manage all bookings
- **Payment Tracking**: Monitor payment transactions
- **Ticket Management**: View and manage all tickets

### Seat Preview Technology
- **Visual Preview**: Shows viewing angle, distance from screen, and quality rating
- **Acoustic Preview**: Displays sound quality, clarity percentage, bass quality, and surround sound support
- **Dynamic Adaptation**: Previews adjust based on hall size (small/medium/large)
- **Quality Ratings**: Excellent, Good, Average, Poor

## 📡 API Endpoints

All endpoints follow RESTful conventions:

| Resource | GET All | GET One | POST | PUT | DELETE |
|----------|---------|----------|------|-----|--------|
| Movies | ✓ | ✓ | ✓ | ✓ | ✓ |
| Sessions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reservations | ✓ | ✓ | ✓ | ✓ | ✓ |
| Customers | ✓ | ✓ | ✓ | ✓ | ✓ |
| Halls | ✓ | ✓ | ✓ | ✓ | ✓ |
| Seats | ✓ | ✓ | ✓ | ✓ | ✓ |
| Payments | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tickets | ✓ | ✓ | ✓ | ✓ | ✓ |

Base URL: `http://localhost:3000/api`

For complete API documentation, see [Backend README](backend/README.md).

## 🧪 Sample Data

The seed script creates:
- 3 customers
- 3 movies (Inception, The Dark Knight, Interstellar)
- 3 halls (A, B, C) with auto-generated seats
- 4 movie sessions
- 4 reservations
- 3 payments
- 4 tickets with QR codes

Run `npm run seed` in the backend directory to populate the database.

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Next.js dev server with hot reload
```

### Database Seeding
```bash
cd backend
npm run seed  # Clear and reseed database
```

## 📦 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/cinema_booking
PORT=3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Arda Demir

## 🙏 Acknowledgments

- Built with modern web technologies
- Developed as a homework assignment
- Created with assistance from Claude 4.5
- Inspired by real-world cinema booking challenges
- Designed to improve user experience in seat selection

## 📧 Contact

For questions or support, please open an issue on [GitHub](https://github.com/ArdaDDemir/CinemaBook/issues).

---

**Made with ❤️ for better cinema experiences**

