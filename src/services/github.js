import { GITHUB_API } from "../constants";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function getHeaders(oauthToken) {
  const token = oauthToken || GITHUB_TOKEN;
  return {
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchGitHubProfile(username, oauthToken) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        login
        name
        avatarUrl
        bio
        location
        company
        websiteUrl
        twitterUsername
        email
        followers
        following
        publicRepos: repositories(privacy: PUBLIC, first: 0) { totalCount }
        pinnedItems(first: 6) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage { name color }
              topics: repositoryTopics(first: 10) {
                nodes { topic { name } }
              }
            }
          }
        }
        repositories(
          first: 100
          orderBy: { field: UPDATED_AT, direction: DESC }
          privacy: PUBLIC
          ownerAffiliations: OWNER
        ) {
          totalCount
          nodes {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
            updatedAt
            topics: repositoryTopics(first: 10) {
              nodes { topic { name } }
            }
            isFork
            isArchived
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API.GRAPHQL_URL, {
    method: "POST",
    headers: getHeaders(oauthToken),
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user;
}

export async function fetchGitHubProfileREST(username, oauthToken) {
  const response = await fetch(`${GITHUB_API.REST_BASE_URL}/users/${username}`, {
    headers: getHeaders(oauthToken),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchUserRepos(username, oauthToken, page = 1, perPage = 100) {
  const response = await fetch(
    `${GITHUB_API.REST_BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&type=owner`,
    { headers: getHeaders(oauthToken) }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchReadme(username, repoName, oauthToken) {
  try {
    const response = await fetch(
      `${GITHUB_API.REST_BASE_URL}/repos/${username}/${repoName}/readme`,
      { headers: { ...getHeaders(oauthToken), Accept: "application/vnd.github.v3.raw" } }
    );

    if (!response.ok) return null;
    return response.text();
  } catch {
    return null;
  }
}

export function rankRepositories(repos) {
  return repos
    .filter((repo) => !repo.isFork && !repo.isArchived)
    .map((repo) => ({
      ...repo,
      score: (repo.stargazerCount || 0) * 3 +
             (repo.forkCount || 0) * 2 +
             (repo.description ? 5 : 0) +
             (repo.primaryLanguage ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score);
}

export function summarizeReposForAI(repos, maxRepos = 30) {
  const ranked = rankRepositories(repos);
  const selected = ranked.slice(0, maxRepos);

  return selected.map((repo) => ({
    name: repo.name,
    description: repo.description,
    language: repo.primaryLanguage?.name,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    topics: repo.topics?.nodes?.map((n) => n.topic.name) || [],
  }));
}
