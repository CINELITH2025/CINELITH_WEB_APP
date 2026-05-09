# CINELITH Backend

The backend of CINELITH is a Node.js API that serves as the bridge between our community database and external cinematic data sources.

## 🛠️ Tech Stack

- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) for user data and social connections.
- **JWT & Bcrypt**: Secure authentication and password hashing.
- **Socket.io**: Real-time communication for community chats.
- **Axios**: Handling requests to TheTVDB API.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`: Create a new account.
- `POST /api/auth/login`: Authenticate and receive a JWT.

### Movies & Media
- `GET /api/movies/:type/:id`: Fetch detailed data for a movie or series from TVDB.
- `GET /api/search?q=query`: Search for movies, actors, or users.

### Users & Social
- `GET /api/users/profile`: Get current user profile and library.
- `POST /api/users/watchlist`: Add/Remove items from your watchlist.
- `GET /api/users/friends`: List of community connections.

## 🗄️ Database Schema (User Model)

```javascript
{
  name: String,
  email: String,
  favoriteMovies: [{ tvdbId: Number, title: String, type: String }],
  watchlist: [{ tvdbId: Number, title: String, type: String }],
  ratings: [{ tvdbId: Number, rating: Number }],
  friends: [ObjectId]
}
```

## 🔌 Integration: TheTVDB (TVDB)
The backend integrates with **TheTVDB v4 API**. All movie data is fetched dynamically.
- **Service**: `src/services/tvdb.service.js` handles token management and search queries.
- **Auth**: Automated token refresh using the `TVDB_API_KEY` environment variable.

## 🛠️ Setup

1. Install dependencies: `npm install`
2. Configure `.env` with your MongoDB URI and TVDB API Key.
3. Start the server: `npm start` (Runs on `http://localhost:5000` by default).
