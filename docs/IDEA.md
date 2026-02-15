# GitFolio - Project Idea Document

## Overview

GitFolio is an AI-powered developer portfolio and resume generator that transforms a user's GitHub profile into a polished, deployable portfolio website and a downloadable, customizable resume. The platform is designed for developers who want a professional online presence without manual effort.

**Live URL pattern:** `gitfolio.in/<username>`

---

## Core Concept

A developer signs in, connects their GitHub profile, and GitFolio automatically fetches their public data (repos, contributions, bio, etc.) via the GitHub REST API, processes it through the Gemini AI API to generate meaningful descriptions and summaries, stores everything in Firestore, and renders a beautiful portfolio website -- all in one flow.

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React.js (JavaScript)               |
| Styling      | Tailwind CSS                        |
| Animations   | Framer Motion                       |
| AI           | Google Gemini API                   |
| Auth         | Firebase Authentication             |
| Database     | Firebase Firestore                  |
| Backend      | Firebase (Cloud Functions / Rules)  |
| Deployment   | Vercel                              |

---

## User Authentication Flow

### Sign-Up / Login Options

1. **Google OAuth** - Sign in with Google account
2. **Email/Password** - Manual account creation
3. **GitHub OAuth** - Sign in with GitHub (preferred path)

### Post-Login Routing

```
User logs in
    |
    +-- Signed in via GitHub OAuth?
    |       |
    |       YES --> Auto-fetch all GitHub data --> Show "Generate Portfolio" screen
    |
    +-- Signed in via Google / Email?
            |
            NO GitHub access --> Prompt user to enter GitHub username manually
                                  --> Fetch public data via GitHub REST API
                                  --> Show "Generate Portfolio" screen
```

**Key distinction:** GitHub OAuth users get automatic data fetching (including access to private repo metadata if granted). Non-GitHub login users provide their username and only public data is fetched.

---

## Data Pipeline

```
GitHub REST API  --->  Raw Data (repos, profile, README, contributions)
       |
       v
   Gemini AI API  --->  Parsed & enhanced data (project descriptions,
       |                 skill extraction, summary generation)
       v
   Firestore DB   --->  Stored user profile + portfolio data
       |
       v
   React UI       --->  Rendered portfolio at gitfolio.in/<username>
```

### Data Fetched from GitHub

- User profile (name, bio, avatar, location, company, blog URL)
- Public repositories (name, description, language, stars, forks, topics)
- Contribution stats
- Profile README content (if exists)
- Pinned repositories (if available)

### AI Processing (Gemini API)

- Generate polished project descriptions from repo metadata
- Extract and categorize skills from repository languages/topics
- Generate a professional bio/summary
- Parse profile README for structured sections (education, achievements, etc.)

---

## Portfolio Website Features

### Auto-Generated Sections

These sections are built automatically from GitHub data:

- **Hero / About** - Name, bio, profile summary (AI-enhanced)
- **Skills** - Extracted from repo languages and topics
- **Projects** - Curated list of repositories with AI-generated descriptions
- **Contributions / Stats** - GitHub activity overview
- **Contact / Links** - Social links, email, blog from GitHub profile

### User-Added Sections

If the user has a detailed profile README, sections like education and achievements are parsed automatically. If not, the user can manually add:

- **Education** - Degree, institution, year
- **Achievements** - Awards, certifications, hackathon wins
- **Experience** - Work history
- **Custom sections** - Any additional section the user wants

Each addable section has a pre-built component. The user fills in the data via a form on the portfolio page itself, and the section renders in the portfolio.

### Theme & Appearance

- **Light / Dark mode toggle** on the portfolio page
- **Multiple themes** - User can switch between different visual themes on the portfolio page (e.g., modern, minimalist, colorful)
- **Default design** - Modern, dark-themed aesthetic for the main GitFolio website itself

### User Avatar

- For the initial version, the user's avatar is the **first letter of their name** (letter avatar)
- GitHub avatar integration can be added later

---

## Resume Generator Features

### Generation

- Resume is generated using the same data (GitHub + user-added sections)
- AI (Gemini) structures the data into a professional resume format

### Customization Options

The resume editor provides full control over styling:

| Feature            | Details                                      |
| ------------------ | -------------------------------------------- |
| Text size          | Adjustable font size for different sections  |
| Font type          | Choose from multiple font families           |
| Heading colors     | Custom color picker for section headings     |
| Text formatting    | Bold, italic, underline                      |
| Hyperlinks         | Add clickable links within resume content    |

### Theme on Resume Page

- The resume **page** supports light/dark mode toggle (for the UI around the resume)
- The resume **paper** itself is always **white** (standard document format)
- PDF export also generates on a white background

### Export

- **Download as PDF** - Clean, white-background PDF ready for job applications

---

## Design Principles

1. **GitFolio website (main platform)** - Dark theme only, modern aesthetic
2. **Portfolio pages** - Support light and dark mode, multiple theme options
3. **Resume page UI** - Supports light and dark mode
4. **Resume document** - Always white paper, both on screen and in PDF
5. **Developer-focused** - Every design decision caters to developers specifically
6. **Minimal friction** - Sign in, generate, customize, done

---

## Page Structure

```
/                     --> Landing page (dark theme, modern design)
/login                --> Authentication page (Google, Email, GitHub)
/dashboard            --> Post-login: generate portfolio / enter GitHub username
/portfolio/:username  --> Generated portfolio (public URL: gitfolio.in/username)
/resume               --> Resume builder and editor
```

---

## Feature Summary

| Feature                         | Status   |
| ------------------------------- | -------- |
| Google OAuth login              | Core     |
| Email/Password login            | Core     |
| GitHub OAuth login              | Core     |
| Auto GitHub data fetch          | Core     |
| Manual GitHub username input    | Core     |
| AI-powered data processing      | Core     |
| Portfolio generation            | Core     |
| Public portfolio URL            | Core     |
| Light / Dark mode (portfolio)   | Core     |
| Theme switching                 | Core     |
| Add custom sections             | Core     |
| Resume generation               | Core     |
| Resume text customization       | Core     |
| Resume PDF download             | Core     |
| Profile README parsing          | Core     |
| Letter avatar                   | Core     |

---

## Future Scope (Post-MVP)

- GitHub avatar as profile picture
- Custom domain support for portfolios
- Analytics dashboard (portfolio views, resume downloads)
- More resume templates
- LinkedIn data import
- Portfolio SEO optimization
- Share portfolio on social media
- Access to private repos data (with GitHub OAuth permissions)
- Collaborative editing / team portfolios
- Blog section auto-populated from dev.to / Hashnode
