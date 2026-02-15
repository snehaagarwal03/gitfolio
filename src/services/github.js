import { GITHUB_API_BASE } from "../utils/constants";

/**
 * Fetch a GitHub user's public profile.
 * @param {string} username - GitHub username
 * @returns {Promise<Object>} User profile data
 */
export async function fetchGitHubUser(username) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
  if (!response.ok) {
    throw new Error(`GitHub user "${username}" not found.`);
  }
  return response.json();
}

/**
 * Fetch a GitHub user's public repositories.
 * @param {string} username - GitHub username
 * @param {number} perPage - Number of repos to fetch (max 100)
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(username, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&type=owner`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories for "${username}".`);
  }
  return response.json();
}

/**
 * Fetch the content of a user's profile README (username/username repo).
 * @param {string} username - GitHub username
 * @returns {Promise<string|null>} README content as text, or null if not found
 */
export async function fetchProfileReadme(username) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${username}/readme`,
      {
        headers: { Accept: "application/vnd.github.v3.raw" },
      }
    );
    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  }
}

/**
 * Fetch a user's GitHub profile using an OAuth access token (for GitHub OAuth users).
 * This can access more data than the public API.
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Object>} Authenticated user profile data
 */
export async function fetchAuthenticatedUser(accessToken) {
  const response = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch authenticated GitHub user.");
  }
  return response.json();
}

/**
 * Fetch repositories for an authenticated user (includes private repos if scope granted).
 * @param {string} accessToken - GitHub OAuth access token
 * @param {number} perPage - Number of repos to fetch
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchAuthenticatedRepos(accessToken, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/user/repos?per_page=${perPage}&sort=updated&affiliation=owner`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch authenticated user repositories.");
  }
  return response.json();
}
