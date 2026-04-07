# Setup Guide

## 1. Prerequisites

1. Node.js and npm installed locally.
2. A Firebase project created for authentication and Firestore.
3. A GitHub OAuth app created for GitHub sign-in.
4. A Groq API key for AI generation tasks.
5. A Cloudinary account for image and file storage.

## 2. Create the Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `gitfolio`.
3. Disable Google Analytics if you do not need it.
4. Finish project creation.

## 3. Register the Web App

1. Open the Firebase project dashboard.
2. Add a new web app using the web icon.
3. Name the app `gitfolio-web`.
4. Do not enable Firebase Hosting for the app because deployment will use Vercel.
5. Copy the Firebase config values shown after registration.

The values should map to these environment variables:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 4. Enable Authentication Providers

Open Firebase Console, then go to Authentication and enable the required sign-in providers.

### A. Email and Password

1. Enable Email/Password sign-in.
2. Save the provider settings.

### B. Google

1. Enable Google sign-in.
2. Set the support email.
3. Save the provider settings.

### C. GitHub

1. Enable GitHub sign-in.
2. Copy the Firebase callback URL from the GitHub provider settings.
3. Use that callback URL in your GitHub OAuth app.

## 5. Configure GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth app.
3. Set the application name to `GitFolio`.
4. Set the homepage URL to your local or production site.
5. Paste the Firebase callback URL into the authorization callback URL field.
6. Generate a Client ID and Client Secret.
7. Add the Client ID and Client Secret to the Firebase GitHub provider settings.

## 6. Create the Firestore Database

1. Open Firestore Database in Firebase Console.
2. Create a database in Standard Mode.
3. Choose a region close to your users.
4. Start in test mode during development.
5. Replace test rules with production rules before launch.

## 7. Set Up Cloudinary for Image Storage

Cloudinary handles image uploads for the portfolio (profile images, section images). The project uses Cloudinary's unsigned upload preset approach, which lets the frontend upload images directly without a backend server.

### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/).
2. Sign up for a free account.
3. The free tier includes 25 GB of storage and 25 GB of bandwidth per month, which is enough for development.

### Step 2: Copy Your Cloud Name

1. After logging in, you land on the Dashboard page.
2. Your Cloud Name is displayed at the top left of the dashboard, You can also find it under Settings then Account.
3. Copy this value. You will need it for the `VITE_CLOUDINARY_CLOUD_NAME` environment variable.

### Step 3: Create an Unsigned Upload Preset

An upload preset is a set of predefined upload rules that allow the frontend to upload files directly to Cloudinary without requiring a signed authentication token from a backend server. This is why it is called "unsigned."

1. Go to Settings in the left sidebar.
2. Click the Upload tab.
3. Scroll down to the Upload Presets section.
4. Click Add Upload Preset.
5. Set the Preset Name to `gitfolio_uploads`.
6. Set the Signing Mode dropdown to Unsigned. This is the critical setting. Unsigned means the upload request does not need a signature from the Cloudinary API. This lets the React frontend upload images directly to Cloudinary without needing your API secret exposed in the browser.
7. Set the Folder field to `portfolio` (or leave it empty if you want uploads in the root folder).
8. Click Save.
9. Copy the preset name you just created. You will need it for the `VITE_CLOUDINARY_UPLOAD_PRESET` environment variable.

### Step 4: Understand How It Works in This Project

The project uploads images using Cloudinary's REST upload endpoint directly from the browser:

1. The user selects an image file on the portfolio page (hero section image, for example).
2. The frontend creates a FormData object with the file and the upload preset name.
3. The frontend sends a POST request to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`.
4. Cloudinary stores the image and returns a secure URL.
5. The frontend saves that URL to Firestore as part of the portfolio data.

No backend server is involved. The upload preset's "unsigned" mode is what makes this possible without exposing the Cloudinary API secret in the frontend code.

The relevant code is in `src/services/cloudinary.js` and `src/constants/index.js`.

## 8. Set Up Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Fill in the Firebase values.
3. Add your Groq API key.
4. Add your Cloudinary credentials if the app requires them.

Example structure:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GROQ_API_KEY=your_groq_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 9. Run the Project Locally

1. Install dependencies if needed.
2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown by Vite.

## 10. Verify the Main Flows

1. Open the landing page.
2. Sign in with Google.
3. Sign in with GitHub.
4. Sign in with email and password.
5. Confirm the dashboard loads after authentication.
6. Confirm the portfolio route uses the username-based format.

## 11. Production Deployment Notes

1. Update Firebase authorized domains for the production site.
2. Update the GitHub OAuth homepage URL and callback URL for production.
3. Deploy the frontend on Vercel.
4. Configure wildcard subdomain handling if public portfolio subdomains are enabled.
5. Lock down Firestore security rules before going live.

## 12. Important Environment Notes

1. Keep secret values out of source control.
2. Use separate keys for development and production.
3. Review API quota limits for GitHub and Groq before launch.
4. Cache generated portfolio data in Firestore to reduce repeated API calls.
