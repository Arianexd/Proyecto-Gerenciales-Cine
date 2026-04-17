# Frontend - Cinema Booking System

Next.js 14 frontend application for the CinemaBook cinema ticket booking system with TypeScript and Tailwind CSS.

## Overview

The frontend provides two main interfaces:
1. **Public Booking System** - Customer-facing cinema booking interface
2. **Admin Panel** - Complete management system for cinema operations

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **QRCode** - Client-side QR code generation

## Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp env.local.example .env.local
```

4. **Edit `.env.local` file** (optional)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

If not set, defaults to `http://localhost:3000/api`.

5. **Start development server**
```bash
npm run dev
```

The application will run on **http://localhost:5173**

## Available Scripts

### Development
```bash
npm run dev
```
Starts Next.js development server on port 5173 with hot reload.

### Production Build
```bash
npm run build
```
Creates an optimized production build.

### Start Production Server
```bash
npm start
```
Starts the production server (run `npm run build` first).

### Linting
```bash
npm run lint
```
Runs ESLint to check for code issues.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin panel pages
│   │   ├── customers/      # Customer management
│   │   ├── movies/        # Movie management
│   │   ├── halls/         # Hall management
│   │   ├── sessions/      # Session management
│   │   ├── reservations/  # Reservation management
│   │   ├── payments/      # Payment management
│   │   ├── login/         # Admin login
│   │   └── page.tsx       # Admin dashboard
│   ├── booking/           # Public booking pages
│   │   └── [sessionId]/   # Seat selection page
│   ├── movies/            # Public movie pages
│   │   ├── page.tsx       # Movies list
│   │   └── [id]/          # Movie details
│   ├── payment/           # Payment page
│   │   └── [reservationId]/
│   ├── confirmation/     # Booking confirmation
│   │   └── [reservationId]/
│   ├── my-ticket/         # Individual ticket view
│   │   └── [ticketId]/
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── AdminNavigation.tsx
│   ├── AdminProtectedRoute.tsx
│   ├── ConfirmDialog.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── MovieCard.tsx
│   ├── Navigation.tsx
│   ├── PaymentForm.tsx
│   ├── PublicNavigation.tsx
│   ├── SeatGrid.tsx
│   ├── SeatPreview.tsx
│   ├── SessionCard.tsx
│   └── TicketDisplay.tsx
│
├── lib/                   # Utilities
│   ├── api.ts             # Axios API client
│   └── types.ts           # TypeScript type definitions
│
└── public/                # Static assets
```

## Pages

### Public Pages

#### Homepage (`/`)
- Hero section with cinema branding
- Featured movies showcase (top 6 movies)
- Features section highlighting system capabilities
- Call-to-action buttons

#### Movies List (`/movies`)
- Grid layout of all movies
- Movie cards with posters, ratings, and details
- Genre filtering
- Click to view movie details

#### Movie Details (`/movies/[id]`)
- Large movie poster and backdrop
- Comprehensive movie information:
  - Director, cast, rating, description
  - Genre, duration, age limit
- Available sessions display
- Session cards with booking buttons
- Trailer link (if available)

#### Booking Page (`/booking/[sessionId]`)
- Session information header
- Interactive seat grid with selection
- Real-time seat preview on hover:
  - Screen view preview (viewing angle, distance)
  - Acoustic quality preview (clarity, bass, surround)
- Order summary with total price
- Guest information form (name, surname, email, phone)
- Creates reservation in "CREATED" status
- Stores selected seats in localStorage

#### Payment Page (`/payment/[reservationId]`)
- Reservation summary with movie poster
- Payment form with card inputs:
  - Card number (formatted)
  - Cardholder name
  - Expiry date (MM/YY)
  - CVV
- Demo mode security notice
- Auto-calculates total based on seats and price
- Creates payment record
- Updates reservation to "PAID" status
- Generates tickets with QR codes
- Redirects to confirmation

#### Confirmation Page (`/confirmation/[reservationId]`)
- Success animation
- Movie and session information
- All tickets displayed with QR codes
- Seat quality indicators
- Links to individual ticket views
- Action buttons (browse more movies, back to home)

#### Individual Ticket Page (`/my-ticket/[ticketId]`)
- Full-page ticket display optimized for mobile
- Large QR code for scanning
- All ticket details:
  - Movie name, date, time
  - Hall name and seat information
  - Seat quality indicators
- Check-in status
- Print and download options
- Clean design without navigation

### Admin Pages

#### Admin Login (`/admin/login`)
- Simple login form
- Username: `demo`
- Password: `demo`
- Stores authentication token in localStorage

#### Admin Dashboard (`/admin`)
- Overview statistics for all entities
- Quick access cards to all management pages
- Real-time counts for:
  - Customers
  - Movies
  - Halls
  - Sessions
  - Reservations
  - Payments

#### Customer Management (`/admin/customers`)
- Table view of all customers
- Add new customer (modal form)
- Edit existing customer
- Delete customer (with confirmation)
- Fields: Name, Surname, Email, Phone Number

#### Movie Management (`/admin/movies`)
- Table view of all movies
- Add new movie (modal form)
- Edit existing movie
- Delete movie (with confirmation)
- Fields: Name, Genre, Duration, Age Limit, Description, Poster URL, Director, Cast, Rating, Trailer URL

#### Hall Management (`/admin/halls`)
- Card layout of all halls
- Add new hall (modal form)
- Edit existing hall
- Delete hall (with confirmation)
- View hall seats (`/admin/halls/[id]/seats`)
- Fields: Hall Name, Capacity

#### Session Management (`/admin/sessions`)
- Card layout of all sessions
- Add new session (modal form)
- Edit existing session
- Delete session (with confirmation)
- Populated movie and hall information
- Fields: Movie, Hall, DateTime, Price, Language, Subtitles

#### Reservation Management (`/admin/reservations`)
- Table view of all reservations
- Create new reservation
- Update reservation status
- Delete reservation (with confirmation)
- Status badges: CREATED (yellow), PAID (green), CANCELLED (red)
- Populated customer and session details
- View reservation details (`/admin/reservations/[id]`)

#### Payment Management (`/admin/payments`)
- Table view of all payments
- View payment details
- Filter by status
- Payment method and amount display

## Components

### Navigation Components
- **PublicNavigation.tsx** - Public site navigation with cinema branding
- **AdminNavigation.tsx** - Admin panel navigation
- **Navigation.tsx** - General navigation component

### UI Components
- **Modal.tsx** - Reusable modal component for forms
- **ConfirmDialog.tsx** - Delete confirmation dialog
- **LoadingSpinner.tsx** - Loading indicator

### Feature Components
- **MovieCard.tsx** - Movie card with poster and details
- **SessionCard.tsx** - Session card with booking button
- **SeatGrid.tsx** - Interactive seat selection grid
- **SeatPreview.tsx** - Seat quality preview (visual + acoustic)
- **PaymentForm.tsx** - Payment form with card inputs
- **TicketDisplay.tsx** - Ticket display with QR code

### Security Components
- **AdminProtectedRoute.tsx** - Route protection for admin pages

## API Integration

The frontend uses Axios to communicate with the backend API. All API calls are centralized in `lib/api.ts`.

### API Client Setup

```typescript
import { moviesApi, sessionsApi, reservationsApi } from '@/lib/api';
```

### Example Usage

```typescript
// Get all movies
const response = await moviesApi.getAll();
const movies = response.data;

// Create a movie
const newMovie = await moviesApi.create({
  MovieName: "New Movie",
  Genre: "Action",
  // ... other fields
});

// Update a movie
await moviesApi.update(movieId, { Rating: 9.0 });

// Delete a movie
await moviesApi.delete(movieId);
```

All API methods return Axios response objects with `data` property containing the response data.

## TypeScript Types

All TypeScript interfaces are defined in `lib/types.ts`:

- `Movie` - Movie data structure
- `Hall` - Hall data structure
- `Customer` - Customer data structure
- `Seat` - Seat data structure
- `MovieSession` - Session data structure
- `Reservation` - Reservation data structure
- `Payment` - Payment data structure
- `Ticket` - Ticket data structure

## Styling

The application uses Tailwind CSS for styling with a custom cinema-themed design:

- **Color Scheme**: Red, yellow, and black gradients (cinema theme)
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Components**: Reusable styled components

### Global Styles

Global styles are defined in `app/globals.css` with Tailwind directives and custom CSS.

## Features

### Public Booking Features
- Browse movies with posters and ratings
- View movie details and available sessions
- Interactive seat selection with quality preview
- Guest checkout (no account required)
- Payment processing (demo mode)
- Digital tickets with QR codes
- Responsive design for all devices

### Admin Panel Features
- Complete CRUD operations for all entities
- Real-time statistics dashboard
- Modal forms for data entry
- Confirmation dialogs for deletions
- Toast notifications for user feedback
- Status badges and indicators
- Protected routes with authentication

### Seat Preview Technology
- **Visual Preview**: Shows viewing angle, distance from screen, quality rating
- **Acoustic Preview**: Displays sound quality, clarity, bass, surround sound
- **Dynamic Adaptation**: Adjusts based on hall size
- **Quality Ratings**: Excellent, Good, Average, Poor

## State Management

The application uses React hooks for state management:
- `useState` - Component-level state
- `useEffect` - Side effects and data fetching
- `useRouter` - Next.js routing
- `useParams` - Dynamic route parameters

## Environment Variables

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Production
```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

## Building for Production

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

The production build will be optimized and minified for best performance.

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- Netlify
- AWS Amplify
- Docker containerization

## Troubleshooting

### API Connection Issues
- Verify backend is running on port 3000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

### Port Already in Use
- Change port in `package.json`: `"dev": "next dev -p 3001"`

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

