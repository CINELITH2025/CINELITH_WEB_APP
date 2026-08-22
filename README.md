# CINELITH — Premium Cinematic Exploration & Social Platform

CINELITH is a premium, community-driven cinematic exploration platform and pre-launch waitlist web application.

- **Live Production URL**: [https://cinelith.com](https://cinelith.com)
- **GitHub Repository**: [https://github.com/CINELITH2025/CINELITH_WEB_APP](https://github.com/CINELITH2025/CINELITH_WEB_APP)

---

## 🛠️ Complete Tech Stack & Infrastructure

| Layer | Technology Used | Description |
| :--- | :--- | :--- |
| **Frontend UI** | React 18 + Vite | Modern SPA with Framer Motion animations & Canvas-Confetti |
| **Styling** | Vanilla CSS + TailwindCSS | Dark glassmorphic design system (`#090909`, `#151515`, `#FACC15`) |
| **Backend API** | Node.js + Express | RESTful API with Serverless Vercel Function routing (`/api/*`) |
| **Database** | MongoDB Atlas Cloud | Cloud database connected via Mongoose ODM |
| **Transactional Email** | Resend API SDK | Verified domain email delivery (`CINELITH <team@cinelith.com>`) |
| **Security** | Helmet + Rate Limit | HTTP security headers, payload controls, 10-attempt OTP rate limiters |
| **CDN & Hosting** | Vercel Serverless | Unified deployment for Frontend & Express Serverless Functions |
| **Domain & DNS** | Namecheap | Custom domain `cinelith.com` with A and CNAME DNS routing |
| **CI/CD Pipeline** | GitHub Actions | Automated build verification pipeline (`.github/workflows/deploy.yml`) |

---

## 🔑 Environment Variables Reference

Below is the complete list of environment variables required for running the project locally and in production on Vercel:

### 1. Backend (`backend/.env`)

| Variable Name | Required | Default / Format | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` / `development` | Environment mode |
| `PORT` | Yes | `5050` | Server listening port |
| `MONGO_URI` | Yes | `mongodb+srv://...` | MongoDB Atlas Cloud database connection URI |
| `JWT_SECRET` | Yes | String | Secret key for JWT authentication tokens |
| `RESEND_API_KEY` | Yes | `re_...` | Resend API Key for 6-digit OTP email delivery |
| `RESEND_FROM_EMAIL` | Optional | `CINELITH <team@cinelith.com>` | Verified Resend sender email identity |
| `SMTP_HOST` | Optional | `smtp.gmail.com` | Nodemailer fallback SMTP host |
| `SMTP_PORT` | Optional | `587` | Nodemailer fallback SMTP port |
| `EMAIL_USER` | Optional | `team@cinelith.com` | Nodemailer fallback username |
| `EMAIL_PASS` | Optional | String | Nodemailer fallback password |

### 2. Frontend (`frontend/.env`)

| Variable Name | Required | Default / Format | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Optional | Blank on Vercel | Production API base URL (`/api` when hosted on Vercel) |

---

## 🗄️ Database Schema (`Waitlist` Model)

The MongoDB `Waitlist` schema ([Waitlist.js](file:///Users/vaibhavagrawal/CINELITH_WEB_APP/backend/src/models/Waitlist.js)) stores early-access registrations with atomic zero-collision persistence:

```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  country: { type: String, trim: true, default: "" },
  favoriteMovie: { type: String, trim: true, default: "" },
  otp: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  passId: { type: String, unique: true, sparse: true, default: null },        // e.g. "CINELITH-385"
  queuePosition: { type: Number, unique: true, sparse: true, default: null }  // e.g. 385
}
```

### 🔒 Zero-Collision Atomic Algorithm
To prevent duplicate Pass IDs under concurrent traffic, `passId` and `queuePosition` are indexed with `unique: true, sparse: true`. If a race condition occurs, the backend automatically catches MongoDB error `E11000`, increments the queue counter, and retries until a unique Pass ID is assigned.

---

## 🚀 Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/CINELITH2025/CINELITH_WEB_APP.git
   cd CINELITH_WEB_APP
   ```

2. **Install Root & Subproject Dependencies**:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Configure Environment File**:
   Copy `backend/.env.example` to `backend/.env` and add your database and Resend API key:
   ```env
   PORT=5050
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key
   RESEND_API_KEY=re_your_resend_api_key
   RESEND_FROM_EMAIL=CINELITH <team@cinelith.com>
   ```

4. **Launch Local Servers**:
   - Backend Dev Server: `npm start` (Runs on `http://localhost:5050`)
   - Frontend Dev Client: `npm run dev` (Runs on `http://localhost:3000`)

---

## 🌐 Production Deployment Architecture (Vercel)

The application is deployed on Vercel as a single monorepo:
- **Root `vercel.json`**: Routes `/api/(.*)` to Express Serverless Function (`api/index.js`) and all other routes to Vite static build (`frontend/dist`).
- **Domain DNS**:
  - `A Record`: `@` ➔ `76.76.21.21` (Vercel IP)
  - `CNAME Record`: `www` ➔ `cname.vercel-dns.com.`
