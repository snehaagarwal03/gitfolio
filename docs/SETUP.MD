# Setup Guide

## 1. Firebase Setup

### A. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or "Add project")
3. Name it something like `gitfolio`
4. Disable Google Analytics (optional, not needed for now)
5. Click Create project

### B. Register a Web App

1. In your Firebase project dashboard, click the web icon (`</>`) to add a web app
2. Name it `gitfolio-web`
3. Don't check "Firebase Hosting" (we're using Vercel)
4. Click Register app
5. You'll see the Firebase config object -- copy these values:

``` bash
apiKey: "AIza..."
authDomain: "your-project.firebaseapp.com"
projectId: "your-project-id"
storageBucket: "your-project.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abc123"
```

### C. Create your `.env` file

In the project root, copy the example and fill in real values:

```bash
cp .env.example .env
```

Then edit `.env`:

``` bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=gitfolio-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gitfolio-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=gitfolio-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### D. Enable Authentication Providers

In Firebase Console -> **Authentication** -> **Sign-in method** tab:

1. **Email/Password**
   - Click it, toggle Enable, save

2. **Google**
   - Click it, toggle Enable
   - Set a project support email (your email)
   - Save

3. **GitHub**
   - Click it, toggle Enable
   - It will show you a callback URL (something like `https://gitfolio-xxxxx.firebaseapp.com/__/auth/handler`) -- copy this, you'll need it next
   - It asks for a Client ID and Client Secret -- you get these from GitHub:

#### GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** `GitFolio`
   - **Homepage URL:** `http://localhost:5173` (for dev, update later for prod)
   - **Authorization callback URL:** Paste the Firebase callback URL you copied above
4. Click Register application
5. Copy the Client ID
6. Generate a Client Secret and copy it
7. Go back to Firebase Console, paste the Client ID and Client Secret
8. Save

### E. Enable Firestore Database

1. In Firebase Console -> **Firestore Database**
2. Click "Create database"
3. Choose "Standard Mode" between standard and enterprise mode
4. Select a Cloud Firestore location closest to your users - asia-south1 (Mumbai) is a good choice for India but in this project I chose asia-south2 (Delhi) as it is the closest region available to me
5. Choose "Start in test mode" (for development -- you'll lock it down later with security rules)
6. Click Enable

---

## 2. Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" in the left sidebar
4. Click "Create API key"
5. Select your Google Cloud project (or create one)
6. Copy the API key
7. Add it to your `.env`:

``` bash
VITE_GEMINI_API_KEY=AIzaSy...your_gemini_key
```

---

## 3. Final `.env` file should look like

``` bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=gitfolio-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gitfolio-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=gitfolio-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_GEMINI_API_KEY=AIzaSy...your_gemini_key
```

---

## 4. Run the project

```bash
npm run dev
```

The app should start at `http://localhost:5173`. You can:

- Visit `/` to see the landing page
- Visit `/login` and test Google, GitHub, or email sign-in
- After login, you'll hit `/dashboard`

---

## Important Notes

- Test mode Firestore is open to all reads/writes for 30 days -- this is fine for development but you'll need to add security rules before production
- The Gemini API has a free tier with generous limits for development
- For production, update the GitHub OAuth App's Homepage URL and callback URL to your real domain (`gitfolio.in`)
