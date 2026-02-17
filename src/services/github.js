import { GITHUB_API_BASE } from "../utils/constants";

/**
 * Build headers for GitHub API requests
 * @param {string} [token] - Optional GitHub access token
 * @returns {Object} Headers object
 */
function buildHeaders(token) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle rate limit errors with retry logic
 * @param {Response} response - Fetch response
 * @param {Function} retryFn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Response>} Response after potential retry
 */
async function handleRateLimit(response, retryFn, maxRetries = 3) {
  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get("X-RateLimit-Remaining");
    const rateLimitReset = response.headers.get("X-RateLimit-Reset");

    if (rateLimitRemaining === "0" && rateLimitReset) {
      const resetTime = parseInt(rateLimitReset) * 1000;
      const waitTime = Math.min(resetTime - Date.now(), 60000); // Max 60 seconds

      if (waitTime > 0 && maxRetries > 0) {
        console.warn(`Rate limit exceeded. Retrying in ${Math.ceil(waitTime / 1000)}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return retryFn(maxRetries - 1);
      }
    }
  }
  return response;
}

/**
 * Fetch a GitHub user's public profile.
 * @param {string} username - GitHub username
 * @param {string} [token] - Optional GitHub access token for higher rate limits
 * @returns {Promise<Object>} User profile data
 */
export async function fetchGitHubUser(username, token = null) {
  const makeRequest = async (retries = 3) => {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: buildHeaders(token),
    });

    if (response.status === 403 && retries > 0) {
      return handleRateLimit(response, () => makeRequest(retries - 1), retries);
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`GitHub user "${username}" not found.`);
    }
    return response;
  };

  const response = await makeRequest();
  return response.json();
}

/**
 * Fetch a GitHub user's public repositories.
 * @param {string} username - GitHub username
 * @param {number} [perPage=30] - Number of repos to fetch (max 100)
 * @param {string} [token] - Optional GitHub access token for higher rate limits
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchGitHubRepos(username, perPage = 30, token = null) {
  const makeRequest = async (retries = 3) => {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&type=owner`,
      { headers: buildHeaders(token) }
    );

    if (response.status === 403 && retries > 0) {
      return handleRateLimit(response, () => makeRequest(retries - 1), retries);
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch repositories for "${username}".`);
    }
    return response;
  };

  const response = await makeRequest();
  return response.json();
}

/**
 * Fetch the content of a user's profile README (username/username repo).
 * @param {string} username - GitHub username
 * @param {string} [token] - Optional GitHub access token for higher rate limits
 * @returns {Promise<string|null>} README content as text, or null if not found
 */
export async function fetchProfileReadme(username, token = null) {
  try {
    const makeRequest = async (retries = 3) => {
      const headers = buildHeaders(token);
      headers.Accept = "application/vnd.github.v3.raw";

      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${username}/${username}/readme`,
        { headers }
      );

      if (response.status === 403 && retries > 0) {
        return handleRateLimit(response, () => makeRequest(retries - 1), retries);
      }

      if (!response.ok) return null;
      return response;
    };

    const response = await makeRequest();
    return response ? response.text() : null;
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
    headers: buildHeaders(accessToken),
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch authenticated GitHub user.");
  }
  return response.json();
}

/**
 * Fetch repositories for an authenticated user (includes private repos if scope granted).
 * @param {string} accessToken - GitHub OAuth access token
 * @param {number} [perPage=30] - Number of repos to fetch
 * @returns {Promise<Array>} Array of repository objects
 */
export async function fetchAuthenticatedRepos(accessToken, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/user/repos?per_page=${perPage}&sort=updated&affiliation=owner`,
    { headers: buildHeaders(accessToken) }
  );
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch authenticated user repositories.");
  }
  return response.json();
}

/**
 * Check current GitHub API rate limit status.
 * @param {string} [token] - Optional GitHub access token
 * @returns {Promise<Object>} Rate limit information
 */
export async function checkRateLimit(token = null) {
  const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
    headers: buildHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to check rate limit status.");
  }
  return response.json();
}
