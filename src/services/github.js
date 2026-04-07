import { GITHUB_API_BASE } from "../utils/constants";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

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
 * Generic GraphQL Fetcher
 */
async function fetchGraphQL(query, variables, token) {
  if (!token) throw new Error("GraphQL requires an authentication token");
  
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      ...buildHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  
  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }
  
  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL errors: ${result.errors.map(e => e.message).join(", ")}`);
  }
  
  return result.data;
}

/**
 * Fetch a GitHub user's public profile.
 */
export async function fetchGitHubUser(username, token = null) {
  try {
    // Attempt GraphQL first (requires token)
    if (token) {
      const query = `
        query($username: String!) {
          user(login: $username) {
            login
            name
            bio
            location
            company
            websiteUrl
            twitterUsername
            avatarUrl
            followers { totalCount }
            following { totalCount }
            repositories(privacy: PUBLIC) { totalCount }
          }
        }
      `;
      const data = await fetchGraphQL(query, { username }, token);
      const user = data.user;
      return {
        login: user.login,
        name: user.name,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.websiteUrl,
        twitter_username: user.twitterUsername,
        avatar_url: user.avatarUrl,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        public_repos: user.repositories.totalCount
      };
    }
  } catch (err) {
    // GraphQL fallback silent trigger
  }

  // Fallback to REST
  const makeRequest = async (retries = 3) => {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
      headers: buildHeaders(token),
    });

    if (response.status === 403 && retries > 0) {
      return handleRateLimit(response, () => makeRequest(retries - 1), retries);
    }

    if (!response.ok) {
      if (response.status === 403) throw new Error("GitHub API rate limit exceeded.");
      throw new Error(`GitHub user "${username}" not found.`);
    }
    return response;
  };
  const response = await makeRequest();
  return response.json();
}

/**
 * Fetch a GitHub user's public repositories.
 */
export async function fetchGitHubRepos(username, perPage = 30, token = null) {
  try {
    if (token) {
      const query = `
        query($username: String!, $first: Int!) {
          user(login: $username) {
            repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC, isFork: false) {
              nodes {
                name
                description
                stargazerCount
                forkCount
                homepageUrl
                updatedAt
                primaryLanguage { name }
                repositoryTopics(first: 5) { nodes { topic { name } } }
                owner { login }
              }
            }
          }
        }
      `;
      const data = await fetchGraphQL(query, { username, first: perPage }, token);
      
      // Map to REST format for frontend compatibility
      return data.user.repositories.nodes.map(repo => ({
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazerCount,
        forks_count: repo.forkCount,
        homepage: repo.homepageUrl,
        updated_at: repo.updatedAt,
        language: repo.primaryLanguage?.name || null,
        topics: repo.repositoryTopics.nodes.map(n => n.topic.name),
        owner: { login: repo.owner.login }
      }));
    }
  } catch (err) {
    // GraphQL fallback silent trigger
  }

  // Fallback to REST
  const makeRequest = async (retries = 3) => {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?per_page=${perPage}&sort=updated&type=owner`,
      { headers: buildHeaders(token) }
    );
    if (response.status === 403 && retries > 0) return handleRateLimit(response, () => makeRequest(retries - 1), retries);
    if (!response.ok) throw new Error("Failed to fetch repositories.");
    return response;
  };
  const response = await makeRequest();
  return response.json();
}

/**
 * Fetch the content of a user's profile README.
 */
export async function fetchProfileReadme(username, token = null) {
  // Readme is often easier via REST raw content, but implementing graphql fallback or vice versa
  try {
    if (token) {
      const query = `
        query($username: String!) {
          repository(owner: $username, name: $username) {
            object(expression: "HEAD:README.md") {
              ... on Blob { text }
            }
          }
        }
      `;
      const data = await fetchGraphQL(query, { username }, token);
      if (data.repository?.object?.text) {
        return data.repository.object.text;
      }
    }
  } catch (err) {
    // GraphQL fallback silent trigger
  }

  // REST Fallback
  try {
    const makeRequest = async (retries = 3) => {
      const headers = buildHeaders(token);
      headers.Accept = "application/vnd.github.v3.raw";
      const response = await fetch(`${GITHUB_API_BASE}/repos/${username}/${username}/readme`, { headers });
      if (response.status === 403 && retries > 0) return handleRateLimit(response, () => makeRequest(retries - 1), retries);
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
 * Fetch an Authenticated User (REST fallback wrapper)
 */
export async function fetchAuthenticatedUser(accessToken) {
  return fetchGitHubUser(null, accessToken).catch(async () => {
    const response = await fetch(`${GITHUB_API_BASE}/user`, { headers: buildHeaders(accessToken) });
    if (!response.ok) throw new Error("Failed to fetch authenticated GitHub user.");
    return response.json();
  });
}

/**
 * Fetch reps for Authenticated User
 */
export async function fetchAuthenticatedRepos(accessToken, perPage = 30) {
  try {
    const query = `
      query($first: Int!) {
        viewer {
          repositories(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}, isFork: false) {
            nodes {
              name
              description
              stargazerCount
              forkCount
              homepageUrl
              updatedAt
              primaryLanguage { name }
              repositoryTopics(first: 5) { nodes { topic { name } } }
              owner { login }
            }
          }
        }
      }
    `;
    const data = await fetchGraphQL(query, { first: perPage }, accessToken);
    return data.viewer.repositories.nodes.map(repo => ({
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazerCount,
      forks_count: repo.forkCount,
      homepage: repo.homepageUrl,
      updated_at: repo.updatedAt,
      language: repo.primaryLanguage?.name || null,
      topics: repo.repositoryTopics.nodes.map(n => n.topic.name),
      owner: { login: repo.owner.login }
    }));
  } catch (err) {
    // GraphQL fallback silent trigger
    const response = await fetch(
      `${GITHUB_API_BASE}/user/repos?per_page=${perPage}&sort=updated&affiliation=owner`,
      { headers: buildHeaders(accessToken) }
    );
    if (!response.ok) throw new Error("Failed auth repo fetch.");
    return response.json();
  }
}

/**
 * Check current GitHub API rate limit status.
 */
export async function checkRateLimit(token = null) {
  const response = await fetch(`${GITHUB_API_BASE}/rate_limit`, { headers: buildHeaders(token) });
  if (!response.ok) throw new Error("Failed to check rate limit.");
  return response.json();
}

/**
 * Fetch languages (GraphQL pulls these efficiently across all repos generally, but keeping REST structure)
 */
export async function fetchRepoLanguages(owner, repo, token = null) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, { headers: buildHeaders(token) });
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}

/**
 * Calculate most used languages across all repositories.
 */
export async function calculateMostUsedLanguages(repos, token = null) {
  try {
    if (token && repos.length > 0 && repos[0].owner?.login) {
      const username = repos[0].owner.login;
      const query = `
        query($username: String!) {
          user(login: $username) {
            repositories(first: 20, ownerAffiliations: OWNER, isFork: false) {
              nodes {
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  edges { size node { name } }
                }
              }
            }
          }
        }
      `;
      const data = await fetchGraphQL(query, { username }, token);
      const languageBytes = {};
      
      data.user.repositories.nodes.forEach(repo => {
        repo.languages?.edges?.forEach(edge => {
          languageBytes[edge.node.name] = (languageBytes[edge.node.name] || 0) + edge.size;
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
  } catch (err) {
    // GraphQL fallback silent trigger
  }

  // REST fallback
  const languageBytes = {};
  const topRepos = repos.slice(0, 20);
  const languagePromises = topRepos.map(async (repo) => {
    if (repo.owner?.login && repo.name) return fetchRepoLanguages(repo.owner.login, repo.name, token);
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

/**
 * Fetch recent user events for legacy REST processing or use GraphQL.
 * Since we rewrite calculateContributionActivity to handle both, we'll return raw GraphQL or REST events here.
 */
export async function fetchUserEvents(username, token = null) {
  try {
    if (token) {
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;
      const data = await fetchGraphQL(query, { username }, token);
      return { _graphQL: true, data: data.user.contributionsCollection.contributionCalendar };
    }
  } catch (err) {
    // GraphQL fallback silent trigger
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=100`, { headers: buildHeaders(token) });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

/**
 * Calculate contribution activity from events or GraphQL payload.
 */
export function calculateContributionActivity(events) {
  // Handle GraphQL Payload specifically mapped from fetchUserEvents
  if (events && events._graphQL && events.data) {
    const calendar = events.data;
    const contributionsByDate = {};
    
    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        if (day.contributionCount > 0) {
          contributionsByDate[day.date] = day.contributionCount;
        }
      });
    });

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
        break;
      }
    }

    return {
      contributionsByDate,
      totalRecent: calendar.totalContributions,
      streakDays,
    };
  }

  // Legacy REST Fallback Handler
  const contributionsByDate = {};
  const eventTypes = ["PushEvent", "PullRequestEvent", "IssuesEvent", "IssueCommentEvent", "CreateEvent", "ReleaseEvent"];

  if (Array.isArray(events)) {
    events.forEach((event) => {
      if (eventTypes.includes(event.type)) {
        const date = event.created_at?.split("T")[0];
        if (date) contributionsByDate[date] = (contributionsByDate[date] || 0) + 1;
      }
    });
  }

  const totalRecent = Object.values(contributionsByDate).reduce((sum, count) => sum + count, 0);
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
      break;
    }
  }

  return { contributionsByDate, totalRecent, streakDays };
}

// Language colors for visualization
export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", "C#": "#239120", Go: "#00ADD8", Rust: "#dea584",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB",
  Scala: "#c22d40", HTML: "#e34c26", CSS: "#563d7c", SCSS: "#c6538c", Shell: "#89e051",
  Vue: "#41b883", Svelte: "#ff3e00", React: "#61dafb", default: "#8b949e",
};
