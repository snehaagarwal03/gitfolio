import { GROQ_API } from "../constants";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generatePortfolioContent(githubData, selectedRepos) {
  const prompt = buildPortfolioPrompt(githubData, selectedRepos);

  const response = await fetch(`${GROQ_API.BASE_URL}${GROQ_API.CHAT_COMPLETIONS}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_API.DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional portfolio content writer for software developers. Generate clean, well-structured portfolio content based on GitHub profile data. Always respond with valid JSON only, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from Groq API");
  }

  return JSON.parse(content);
}

function buildPortfolioPrompt(githubData, selectedRepos) {
  const profileInfo = `
GitHub Profile:
- Name: ${githubData.name || "Not provided"}
- Username: ${githubData.login}
- Bio: ${githubData.bio || "Not provided"}
- Location: ${githubData.location || "Not provided"}
- Company: ${githubData.company || "Not provided"}
- Website: ${githubData.websiteUrl || "Not provided"}
- Followers: ${githubData.followers || 0}
- Public Repos: ${githubData.publicRepos?.totalCount || 0}
  `.trim();

  const reposInfo = selectedRepos
    .map(
      (repo) =>
        `- ${repo.name}: ${repo.description || "No description"} | Language: ${repo.language || "N/A"} | Stars: ${repo.stars || 0} | Topics: ${(repo.topics || []).join(", ")}`
    )
    .join("\n");

  return `
${profileInfo}

Selected Projects:
${reposInfo}

Generate a developer portfolio in JSON format with the following structure:
{
  "hero": {
    "title": "A professional headline for the developer",
    "subtitle": "A short tagline or mission statement"
  },
  "about": "A 2-3 sentence professional summary based on the GitHub profile",
  "skills": ["List of technical skills inferred from repos and languages"],
  "projects": [
    {
      "name": "project name",
      "description": "A polished project description",
      "tech": ["technologies used"],
      "url": "repo url",
      "stars": number,
      "forks": number
    }
  ],
  "experience": [
    {
      "role": "inferred role or placeholder",
      "company": "inferred company or placeholder",
      "duration": "inferred or placeholder",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "degree": "placeholder degree",
      "institution": "placeholder institution",
      "year": "placeholder year"
    }
  ],
  "achievements": ["List of notable achievements inferred from profile"],
  "contact": {
    "email": "${githubData.email || ""}",
    "github": "https://github.com/${githubData.login}",
    "website": "${githubData.websiteUrl || ""}"
  }
}

Generate realistic content. Use placeholders only where no data can be inferred.
  `.trim();
}

export async function generateResumeContent(portfolioData) {
  const prompt = `
Given this portfolio data, generate a structured resume in JSON format:
${JSON.stringify(portfolioData, null, 2)}

Return JSON with:
{
  "header": {
    "name": "full name",
    "title": "professional title",
    "contact": { "email": "", "github": "", "website": "" }
  },
  "summary": "A professional resume summary, 2-3 sentences",
  "experience": [
    { "role": "", "company": "", "duration": "", "highlights": ["bullet points"] }
  ],
  "education": [
    { "degree": "", "institution": "", "year": "", "details": "" }
  ],
  "skills": { "languages": [], "frameworks": [], "tools": [] },
  "projects": [
    { "name": "", "description": "", "tech": [] }
  ]
}
  `.trim();

  const response = await fetch(`${GROQ_API.BASE_URL}${GROQ_API.CHAT_COMPLETIONS}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_API.DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume writer. Generate clean resume content as valid JSON only, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0]?.message?.content);
}
