# GitFolio

A portfolio generator that creates beautiful, AI-enhanced developer portfolios from public GitHub data.

**Live Demo:** [gitfolioxx.vercel.app](https://gitfolioxx.vercel.app)

---

## Features

- **GitHub Profile Import** — Fetch public profile, repositories, contributions, and languages
- **AI-Powered Content** — Auto-generate professional summaries and project descriptions using Groq LLM
- **Real-time Portfolio Builder** — Live preview with customizable themes and sections
- **Firestore Persistence** — Save and manage multiple portfolio versions
- **Secure Architecture** — API keys and tokens never exposed to the browser
- **Mobile Responsive** — Works beautifully on all devices

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite + React + Tailwind CSS |
| **Authentication** | Firebase Auth (OAuth 2.0) |
| **Database** | Cloud Firestore |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **AI** | Groq API (Llama 3) |
| **Data Source** | GitHub REST API |
| **Deployment** | Vercel |

---

## Architecture

### Security-First Design

All API calls to GitHub and Groq are proxied through **serverless functions** to keep secrets server-side:

```bash
┌─────────────┐      ┌─────────────────┐      ┌──────────────┐
│   Browser   │ ──▶  │  Vercel /api/*  │ ──▶  │  GitHub API  │
│  (No keys)  │      │  (Secrets here) │      │  Groq API    │
└─────────────┘      └─────────────────┘      └──────────────┘
        │                     │
        │                     │
        ▼                     ▼
   Firebase Auth      Firebase Admin SDK
   (ID Token)         (Token Verification)
```

- **Frontend** never holds `GITHUB_TOKEN` or `GROQ_API_KEY`
- Every API request sends a **Firebase ID token** for authentication
- Serverless functions verify the token via `firebase-admin` before processing

---

## Setup

### Prerequisites

- Node.js 18+
- Firebase project with Authentication enabled
- GitHub Personal Access Token (classic, **no scopes required** for public data)
- Groq API key
- Vercel account (for deployment)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/GitFolio.git
cd GitFolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values
```

### Environment Variables

Create `.env` from `.env.example`:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain (e.g. `your-project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Yes | Firebase Analytics ID |
| `GITHUB_TOKEN` | Yes | GitHub PAT for server-side API calls |
| `GROQ_API_KEY` | Yes | Groq API key for AI features |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes | Firebase Admin SDK service account JSON (for API auth) |

> **Security Note:** `GITHUB_TOKEN` and `GROQ_API_KEY` are used **only** in Vercel serverless functions. They are never bundled into the frontend.

### Running Locally

```bash
# Start both frontend (Vite) and backend (Express)
npm run dev
```

This runs:

- **Vite dev server** on `http://localhost:5173`
- **Express API server** on `http://localhost:3001`
- Vite proxies `/api/*` requests to the Express server

---

## Project Structure

```bash
GitFolio/
├── api/                          # Vercel serverless functions
│   ├── github.js                   # GitHub API proxy (public data only)
│   └── groq.js                     # Groq AI proxy
├── src/
│   ├── components/                 # React components
│   ├── contexts/
│   │   └── AuthContext.jsx         # Firebase auth state management
│   ├── pages/
│   │   ├── Login.jsx               # Auth page (popup flow)
│   │   ├── Dashboard.jsx           # Profile + repo importer
│   │   ├── Resume.jsx              # AI content generator
│   │   └── Portfolio.jsx           # Portfolio builder + preview
│   └── services/
│       ├── firebase.js             # Firebase client init
│       ├── firestore.js            # Firestore CRUD operations
│       ├── github.js               # Client-side GitHub helpers
│       └── groqllm.js              # Groq API client (calls /api/groq)
├── server.js                       # Express server for local dev
├── vite.config.js                  # Vite + proxy config
└── package.json
```

---

## Deployment

### Vercel

1. Push to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add **all** environment variables from `.env`
4. Deploy

### Important Post-Deploy Steps

1. **Add Vercel domain to Firebase Auth authorized domains:**
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add `gitfolioxx.vercel.app` (your production domain)

2. **Verify serverless functions:**
   - Test `/api/github` and `/api/groq` endpoints
   - Check Vercel Functions logs for any errors

---

## Firestore Security Rules

```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Portfolios: public read, owner-only write
    match /portfolios/{portfolioId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## Key Design Decisions

### Why Serverless Functions?

Prevents API key exposure. Unlike client-side GitHub API calls, our serverless proxy:

- Authenticates users via Firebase ID tokens
- Rate-limits requests using the server-side PAT
- Keeps `GITHUB_TOKEN` and `GROQ_API_KEY` out of browser bundles

### Why Firebase Popup Auth?

We use `signInWithPopup` instead of `signInWithRedirect` because:

- **Redirect** requires Firebase Hosting to serve `__/auth/handler`
- **Popup** works on any domain (Vercel, Netlify, localhost) without hosting setup
- The popup briefly shows the Firebase auth domain (`*.firebaseapp.com`) — this is normal

### GitHub OAuth Scopes

We request **only** `user:email` scope:

- No `repo` access (respects user privacy)
- All GitHub data is fetched via PAT on the server (public endpoints only)
- Users don't need to grant repository access

---

## Troubleshooting

### "Firebase App not authorized" on production

- Add your Vercel domain to Firebase Auth authorized domains

### API returns 401 Unauthorized

- Check that `FIREBASE_SERVICE_ACCOUNT_JSON` is set correctly in Vercel env vars
- Verify the Firebase Admin SDK JSON is valid (download from Firebase Console → Project Settings → Service Accounts)

### GitHub API rate limits

- The server-side PAT has its own rate limit (5000 req/hour)
- If hit, the function will return 403; wait or use a different token

---

## License

MIT

---

Built with ❤️ using React, Firebase, and Vercel.
