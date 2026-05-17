import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let firebaseApp;
function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    firebaseApp = initializeApp({ credential: cert(serviceAccount) });
    return firebaseApp;
  }
  firebaseApp = initializeApp({ credential: applicationDefault() });
  return firebaseApp;
}

async function verifyIdToken(req) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/);
  if (!match) {
    throw new Error("Missing Authorization token");
  }
  getFirebaseAdmin();
  return getAuth().verifyIdToken(match[1]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await verifyIdToken(req);
    const { prompt } = req.body || {};
    if (!prompt) {
      res.status(400).json({ error: "Missing prompt" });
      return;
    }
    if (!process.env.GROQ_API_KEY) {
      res.status(500).json({ error: "Groq API key not configured" });
      return;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      res.status(500).json({ error: "Groq API request failed" });
      return;
    }

    const data = await response.json();
    res.status(200).json({ content: data.choices?.[0]?.message?.content || "" });
  } catch (error) {
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
}
