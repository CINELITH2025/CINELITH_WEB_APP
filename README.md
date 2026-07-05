# CINELITH

CINELITH is a premium, community-driven cinematic exploration platform. It allows users to explore movies and series, track their watch history, and connect with a community of cinephiles.

## 🚀 Project Overview

The project is divided into two main parts:
- **Frontend**: A modern React application built with Vite and Tailwind CSS (v4), featuring a dark cinematic aesthetic, interactive onboarding wizard, and interactive analytics.
- **Backend**: A Node.js/Express server integrated with MongoDB and TheTVDB API for real-time cinematic data and social features.

## 📁 Repository Structure

```text
CINELITH_WEB_APP/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Modular UI components
│   │   ├── pages/      # Route-level page components (Auth, Onboarding, Profile, Dashboard, etc.)
│   │   ├── store/      # Local state stores (Zustand)
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
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with localStorage persistence)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **UI Components**: Custom components + Shadcn UI (Radix)

### Backend
- **Runtime**: Node.js
- **Server**: Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Data Source**: TheTVDB (TVDB)

## ✨ Implemented Features: User Onboarding Flow (Step 1)
We have implemented a high-fidelity visual and logical flow for User Onboarding, which works completely client-side in fallback/demo mode:
- **Persisted Session Store**: A Zustand store handles authentication state, custom user parameters, and onboarding selections.
- **Auth Page (`/auth`)**: A glassmorphic screen featuring a sliding quote carousel and split login/signup forms.
- **Onboarding Questionnaire (`/onboarding`)**:
  - **Step 1: Top 5 Favorite Movies**: A selection page with live counting and filter/search capabilities.
  - **Step 2: Movies Watched & Watchlist**: Toggles status on a card catalog to calculate watched numbers and watchlist additions.
  - **Step 3: Top 5 Favorite Actors**: Displays trending stars with circular profiles.
  - **Step 4: Top 5 Favorite Genres**: Selects user genre metrics.
  - **Step 5: Cinema Profile Generation**: Renders a processing loader animation with rolling status messages before redirect.
- **Dynamic Profile & Dashboard Integration**: Links onboarding selections directly to `/profile` tabs (Wishlist, Liked Movies, Rated Movies), summary cards, top ranked selections, and genre distribution charts on the dashboard.

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
