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

/**
 * Fetch languages used in a specific repository.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} [token] - Optional GitHub access token
 * @returns {Promise<Object>} Object with language names as keys and bytes as values
 */
export async function fetchRepoLanguages(owner, repo, token = null) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
      { headers: buildHeaders(token) }
    );
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}

/**
 * Calculate most used languages across all repositories.
 * @param {Array} repos - Array of repository objects
 * @param {string} [token] - Optional GitHub access token
 * @returns {Promise<Array>} Array of { language, percentage, bytes } sorted by usage
 */
export async function calculateMostUsedLanguages(repos, token = null) {
  const languageBytes = {};

  // Fetch languages for each repo (limit to top 20 repos for performance)
  const topRepos = repos.slice(0, 20);
  const languagePromises = topRepos.map(async (repo) => {
    if (repo.owner?.login && repo.name) {
      const languages = await fetchRepoLanguages(repo.owner.login, repo.name, token);
      return languages;
    }
    return {};
  });

  const allLanguages = await Promise.all(languagePromises);

  // Aggregate language bytes
  allLanguages.forEach((languages) => {
    Object.entries(languages).forEach(([lang, bytes]) => {
      languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
    });
  });

  // Calculate total bytes
  const totalBytes = Object.values(languageBytes).reduce((sum, bytes) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  // Convert to array and calculate percentages
  const languageStats = Object.entries(languageBytes)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 100 * 10) / 10, // Round to 1 decimal
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 10); // Top 10 languages

  return languageStats;
}

/**
 * Fetch recent user events/activity for contribution visualization.
 * @param {string} username - GitHub username
 * @param {string} [token] - Optional GitHub access token
 * @returns {Promise<Array>} Array of event objects
 */
export async function fetchUserEvents(username, token = null) {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`,
      { headers: buildHeaders(token) }
    );
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

/**
 * Calculate contribution activity from events.
 * @param {Array} events - Array of event objects
 * @returns {Object} Contribution data { contributionsByDate, totalRecent, streakDays }
 */
export function calculateContributionActivity(events) {
  const contributionsByDate = {};
  const eventTypes = [
    "PushEvent",
    "PullRequestEvent",
    "IssuesEvent",
    "IssueCommentEvent",
    "CreateEvent",
    "ReleaseEvent",
  ];

  events.forEach((event) => {
    if (eventTypes.includes(event.type)) {
      const date = event.created_at?.split("T")[0];
      if (date) {
        contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
      }
    }
  });

  // Calculate total recent contributions
  const totalRecent = Object.values(contributionsByDate).reduce((sum, count) => sum + count, 0);

  // Calculate streak (consecutive days)
  const sortedDates = Object.keys(contributionsByDate).sort().reverse();
  let streakDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split("T")[0];

    if (contributionsByDate[expectedDateStr]) {
      streakDays++;
    } else if (i > 0) {
      // Allow one day gap, but break on second gap
      break;
    }
  }

  return {
    contributionsByDate,
    totalRecent,
    streakDays,
  };
}

// Language colors for visualization
export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#239120",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Scala: "#c22d40",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  React: "#61dafb",
  default: "#8b949e",
};
