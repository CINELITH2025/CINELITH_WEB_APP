# CINELITH

CINELITH is a premium, community-driven cinematic exploration platform. It allows users to explore movies and series, track their watch history, and connect with a community of cinephiles.

## 🚀 Project Overview

The project is divided into two main parts:
- **Frontend**: A modern React application built with Vite and Tailwind CSS (v4), featuring a dark cinematic aesthetic and interactive analytics.
- **Backend**: A Node.js/Express server integrated with MongoDB and TheTVDB API for real-time cinematic data and social features.

## 📁 Repository Structure

```text
CINELITH_WEB_APP/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Modular UI components
│   │   ├── pages/      # Route-level page components
│   │   └── App.jsx     # Routing configuration
│   └── public/         # Static assets and images
└── backend/            # Node.js + Express server
    ├── src/
    │   ├── models/     # Mongoose database schemas
    │   ├── routes/     # API endpoints
    │   └── services/   # External API integrations (TVDB)
    └── package.json    # Backend dependencies
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **UI Components**: Custom components + Shadcn UI (Radix)

### Backend
- **Runtime**: Node.js
- **Server**: Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Data Source**: TheTVDB (TVDB)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)
- TVDB API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CINELITH2025/CINELITH_WEB_APP.git
   cd CINELITH_WEB_APP
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create .env and add:
   # PORT=5000
   # MONGO_URI=your_mongo_uri
   # JWT_SECRET=your_secret
   # TVDB_API_KEY=your_tvdb_key
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🤝 Community
Join the conversation! CINELITH is built for cinephiles, by cinephiles. Check out the [Community Page](http://localhost:5173/community) to find users with similar cinematic tastes.
