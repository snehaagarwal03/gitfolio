import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const GITHUB_API_BASE = "https://api.github.com";

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

function buildHeaders() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: buildHeaders() });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded.");
    }
    throw new Error(`GitHub request failed: ${response.status}`);
  }
  return response.json();
}

async function fetchText(url, accept) {
  const headers = buildHeaders();
  if (accept) headers.Accept = accept;
  const response = await fetch(url, { headers });
  if (!response.ok) return null;
  return response.text();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await verifyIdToken(req);
    const { username, perPage = 30 } = req.body || {};
    if (!username) {
      res.status(400).json({ error: "Missing username" });
      return;
    }

    const profileUrl = `${GITHUB_API_BASE}/users/${username}`;
    const reposUrl = `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&type=owner`;
    const eventsUrl = `${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`;
    const readmeUrl = `${GITHUB_API_BASE}/repos/${username}/${username}/readme`;

    const [profileData, repos, events, profileReadme] = await Promise.all([
      fetchJson(profileUrl),
      fetchJson(reposUrl),
      fetchJson(eventsUrl).catch(() => []),
      fetchText(readmeUrl, "application/vnd.github.v3.raw"),
    ]);

    const includeRepoReadmes = Boolean(req.body?.includeRepoReadmes);
    let reposWithReadmes = repos;
    if (includeRepoReadmes) {
      reposWithReadmes = await attachRepoReadmes(repos, username, 5);
    }

    const languages = await calculateMostUsedLanguages(repos, username);

    res.status(200).json({
      profileData,
      repos: reposWithReadmes,
      events,
      profileReadme,
      languages,
    });
  } catch (error) {
    res.status(401).json({ error: error.message || "Unauthorized" });
  }
}

async function fetchRepoLanguages(owner, repo) {
  try {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
    return await fetchJson(url);
  } catch {
    return {};
  }
}

async function attachRepoReadmes(repos, username, limit = 5) {
  const topRepos = repos.slice(0, limit);
  const readmes = await Promise.all(
    topRepos.map((repo) =>
      fetchText(
        `${GITHUB_API_BASE}/repos/${username}/${repo.name}/readme`,
        "application/vnd.github.v3.raw"
      )
    )
  );
  return repos.map((repo, index) => {
    if (index < limit) {
      return { ...repo, readme: readmes[index] || null };
    }
    return repo;
  });
}

async function calculateMostUsedLanguages(repos, username) {
  const languageBytes = {};
  const topRepos = repos.slice(0, 20);
  const languagePromises = topRepos.map(async (repo) => {
    if (repo.name) return fetchRepoLanguages(username, repo.name);
    return {};
  });

  const allLanguages = await Promise.all(languagePromises);
  allLanguages.forEach((languages) => {
    Object.entries(languages).forEach(([lang, bytes]) => {
      languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
    });
  });

  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  return Object.entries(languageBytes)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100 * 10) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10);
}
