# CINELITH Frontend

The frontend of CINELITH is a high-performance React application designed with a "Cinema-First" philosophy. It uses a sleek dark theme, vibrant yellow accents, and glassmorphism elements to provide a premium user experience.

## ✨ Features

- **Dynamic Homepage**: Hero banners and trending movie sections.
- **Movies Explorer**: Advanced filtering and search for thousands of titles.
- **Actor Profiles**: Detailed filmographies and fan-engagement banners.
- **User Dashboard**: Personalized analytics, watch streaks, and cinephile scoring.
- **Community Hub**: Find users with matching movie tastes using our "Taste Match" algorithm.
- **Social Features**: Notifications, Direct Messaging, and Profile management.

## 🚀 Tech Stack

- **React 18**: Component-based architecture.
- **Vite**: Ultra-fast build tool.
- **Tailwind CSS v4**: Modern, utility-first styling.
- **Lucide-React**: Consistent and beautiful iconography.
- **React Router**: Seamless navigation across 9+ dedicated pages.

## 📦 Project Structure

- `/src/components`: Reusable UI components (Navbar, Footer, Movie Cards).
- `/src/pages`: Top-level page layouts (Home, Dashboard, Movies, etc.).
- `/src/assets`: Images and global styles.
- `/src/index.css`: Global design system and Tailwind directives.

## 🛠️ Development

### Scripts
- `npm run dev`: Starts the development server at `localhost:5173`.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.

### Environment Variables
Ensure you have a `.env` file in this directory if you are connecting to a remote API:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Design System
The app uses a custom dark-themed design system defined in `index.css`:
- **Background**: `#0F0F0F`
- **Primary**: `#F5C518` (Cinelith Yellow)
- **Secondary**: Glassmorphism (`rgba(255, 255, 255, 0.05)`)
- **Typography**: Inter / Sans-serif
