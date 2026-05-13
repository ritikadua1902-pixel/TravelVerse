# TravelVerse - Tour Himachal

A full-stack travel application for exploring Himachal Pradesh, featuring real-time hazard reporting, safe destination tracking, and an admin dashboard.

## Deployment Links

- **Frontend**: [https://travel-verse-sable.vercel.app/](https://travel-verse-sable.vercel.app/)
- **Backend**: [https://travelverse-production.up.railway.app/](https://travelverse-production.up.railway.app/)

## Key Features

- **Real-time Hazard Feed**: Live updates on landslides, floods, and other travel hazards using Socket.io.
- **Destination Map**: Interactive map showing popular spots, hidden gems, and red zones.
- **Admin Dashboard**: Manage users, destinations, and monitor live active users.
- **Weather Integration**: Live weather updates for travel destinations.

## Environment Variables

### Frontend (`/frontend/.env`)
- `VITE_API_BASE_URL`: The URL of the production backend.

### Backend (`/backend/.env`)
- `PORT`: Server port (default: 5000).
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for authentication.
- `FRONTEND_URL`: The URL of the production frontend (for CORS).
- `WEATHER_API_KEY`: OpenWeatherMap API key.
- `imgKitURL`, `ImageKitPrivateKey`, `ImageKitPublicKey`: ImageKit configuration for image uploads.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, JWT.
- **Deployment**: Vercel (Frontend), Railway (Backend).

## Setup and Installation

1. Clone the repository.
2. Install dependencies:
   - `cd frontend && npm install`
   - `cd backend && npm install`
3. Configure environment variables in `.env` files for both frontend and backend.
4. Run locally:
   - Frontend: `npm run dev`
   - Backend: `npm start`
