const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Call the Groq API with a prompt and get a text response.
 * @param {string} prompt - The prompt to send to Groq
 * @returns {Promise<string>} The generated text response
 */
async function callGroqAI(prompt) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured in environment variables.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error("Groq API request failed.");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Generate a professional bio/summary from GitHub profile data.
 * @param {Object} profileData - GitHub user profile object
 * @returns {Promise<string>} AI-generated professional summary
 */
export async function generateBio(profileData) {
  const prompt = `Based on this GitHub developer profile, generate a concise, professional 2-3 sentence bio for a portfolio website. Keep it in third person.

Name: ${profileData.name || profileData.login}
Bio: ${profileData.bio || "N/A"}
Location: ${profileData.location || "N/A"}
Company: ${profileData.company || "N/A"}
Public Repos: ${profileData.public_repos}
Followers: ${profileData.followers}

Return only the bio text, no quotes or labels.`;

  return callGroqAI(prompt);
}

/**
 * Generate polished project descriptions from repository data.
 * @param {Array} repos - Array of GitHub repository objects
 * @returns {Promise<Array>} Array of { name, description } objects with AI-enhanced descriptions
 */
export async function generateProjectDescriptions(repos) {
  const repoSummaries = repos
    .slice(0, 10) // Limit to top 10 repos
    .map(
      (r) =>
        `- ${r.name}: ${r.description || "No description"} (${r.language || "Unknown"}, ${r.stargazers_count} stars)`
    )
    .join("\n");

  const prompt = `For each GitHub repository below, generate a concise 1-2 sentence professional description suitable for a developer portfolio. Keep descriptions technical but accessible.

Repositories:
${repoSummaries}

Return a JSON array of objects with "name" and "description" fields. Return only valid JSON, no markdown formatting at all.`;

  const result = await callGroqAI(prompt);

  try {
    // Attempt to strip any markdown backticks if the model returned them
    const cleanedResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedResult);
  } catch {
    // If parsing fails, return the repos with original descriptions
    return repos.slice(0, 10).map((r) => ({
      name: r.name,
      description: r.description || "A GitHub repository.",
    }));
  }
}

/**
 * Extract and categorize skills from repository data.
 * @param {Array} repos - Array of GitHub repository objects
 * @returns {Promise<Array>} Array of skill strings
 */
export async function extractSkills(repos) {
  const languages = [
    ...new Set(repos.map((r) => r.language).filter(Boolean)),
  ];
  const topics = [
    ...new Set(repos.flatMap((r) => r.topics || [])),
  ];

  const prompt = `Based on these GitHub repository languages and topics, generate a categorized list of technical skills for a developer portfolio.

Languages: ${languages.join(", ")}
Topics: ${topics.join(", ")}

Return a JSON array of skill strings (e.g., ["JavaScript", "React", "Node.js", "REST APIs"]). Include frameworks, tools, and technologies that can be inferred. Return only valid JSON, no markdown formatting at all.`;

  const result = await callGroqAI(prompt);

  try {
    const cleanedResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedResult);
  } catch {
    // Fallback to raw languages
    return languages;
  }
}

/**
 * Parse a GitHub profile README and extract structured sections.
 * @param {string} readmeContent - Raw README markdown content
 * @returns {Promise<Object>} Extracted sections { education, achievements, experience, ... }
 */
export async function parseProfileReadme(readmeContent) {
  if (!readmeContent) return null;

  const prompt = `Parse this GitHub profile README and extract any structured information into sections. Look for education, achievements, experience, certifications, and any other notable sections.

README content:
${readmeContent.substring(0, 3000)}

Return a JSON object with keys like "education", "achievements", "experience", "certifications" where each value is an array of items. If a section doesn't exist, omit it. Return only valid JSON, no markdown formatting at all.`;

  const result = await callGroqAI(prompt);

  try {
    const cleanedResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedResult);
  } catch {
    return null;
  }
}

/**
 * Perform a deep, highly-detailed two-pass extraction for filling out a full Resume.
 * Pass 1: Extract Education & Experience from profile README.
 * Pass 2: For each repo (with its own README), generate 3 bullet-point project descriptions.
 *
 * @param {string} profileReadme - Raw profile README markdown
 * @param {Array} repos - Array of GitHub repository objects (each may have a .readme property)
 * @returns {Promise<Object>} { education, experience, achievements, certifications, detailedProjects }
 */
export async function generateDetailedResumeData(profileReadme, repos) {

  // ── Pass 1: Extract structured sections from the profile README ──────────────
  const profilePrompt = `You are an expert technical recruiter parsing a developer's GitHub profile README to build a professional resume.

README content:
${profileReadme ? profileReadme.substring(0, 4000) : "No README found."}

Task: Extract structured resume sections. Return ONLY valid JSON (no markdown, no backticks) with this exact schema:
{
  "education": [
    { "institution": "University Name", "degree": "B.Tech Computer Science", "date": "2020-2024", "gpa": "8.5" }
  ],
  "experience": [
    { "title": "Job Title", "company": "Company Name", "date": "Jan 2023 - Present", "description": ["Bullet 1 with action verb...", "Bullet 2...", "Bullet 3..."] }
  ],
  "achievements": ["Achievement 1", "Achievement 2"],
  "certifications": ["Cert 1", "Cert 2"]
}
Rules:
- If no experience exists, create one entry called "Open Source Developer" with 3-4 strong action-verb bullets based on what you can infer from the README.
- All bullet points must start with a strong action verb (Built, Engineered, Developed, Optimized, Architected, etc.).
- If a section is not found, return an empty array for that key.
- Return ONLY the JSON object, nothing else.`;

  // ── Pass 2: Generate rich project descriptions for each repo ──────────────────
  const projectPrompts = repos.slice(0, 5).map(async (repo) => {
    const repoContext = `
Repository: ${repo.name}
Description: ${repo.description || "No description"}
Language: ${repo.language || "Unknown"}
Stars: ${repo.stargazers_count || 0}
Topics: ${(repo.topics || []).join(", ") || "None"}
README excerpt:
${repo.readme ? repo.readme.substring(0, 1500) : "No README available."}`;

    const prompt = `Write exactly 3 technical, action-verb bullet points for this GitHub repository to put on a resume.
Focus on: what it does, which technologies were used, and what problem it solves or its impact.

${repoContext}

Rules:
- Each bullet must start with a strong action verb (Built, Developed, Implemented, Designed, etc.)
- Use specific technical terms from the repo context
- Keep each bullet to one concise sentence
- Return ONLY a JSON array of 3 strings. Example: ["Built...", "Implemented...", "Designed..."]
- No markdown, no backticks, just the JSON array.`;

    try {
      const result = await callGroqAI(prompt);
      const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const bullets = JSON.parse(cleaned);
      return {
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url || repo.url,
        homepage: repo.homepage || null,
        topics: repo.topics || [],
        description: Array.isArray(bullets) ? bullets : [repo.description || "A GitHub project."],
      };
    } catch {
      return {
        name: repo.name,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url || repo.url,
        homepage: repo.homepage || null,
        topics: repo.topics || [],
        description: [repo.description || "A GitHub project."],
      };
    }
  });

  // Run both passes in parallel
  const [profileResult, detailedProjects] = await Promise.all([
    callGroqAI(profilePrompt).then(result => {
      try {
        const cleaned = result.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse profile sections:", err);
        return { education: [], experience: [], achievements: [], certifications: [] };
      }
    }),
    Promise.all(projectPrompts)
  ]);

  return {
    education: profileResult.education || [],
    experience: profileResult.experience || [],
    achievements: profileResult.achievements || [],
    certifications: profileResult.certifications || [],
    detailedProjects,
  };
}
