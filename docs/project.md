# GitFolio Project Specification

## 1. Project Overview

GitFolio is an AI-powered GitHub portfolio and resume generator built for developers. The application lets a user sign in with Google, email/password, or GitHub OAuth, collect data from GitHub, refine it with AI, store the result in Firestore, and publish a portfolio website and resume from the same source data.

The product is centered around a single authenticated user experience. Each user can create one portfolio website and later regenerate or update that same portfolio as their GitHub profile changes.

## 2. Product Goals

1. Allow users to authenticate quickly using Google, email/password, or GitHub OAuth.
2. Collect relevant developer data from GitHub automatically when available.
3. Generate a clean portfolio website from that data.
4. Let users customize the portfolio with additional sections and theme controls.
5. Generate a resume from the same profile data.
6. Support editing and exporting the resume as a PDF.
7. Keep portfolio and resume data synchronized through Firestore.

## 3. Primary User Flow

### Step 1: Authentication

1. The user opens the website.
2. The user signs in using Google, email/password, or GitHub OAuth.
3. The app identifies the authenticated user and routes them to the dashboard.

### Step 2: GitHub Data Collection

1. If the user signed in with GitHub OAuth, GitHub profile data is fetched automatically.
2. If the user signed in with Google or email/password, the user is prompted to enter a GitHub username.
3. The app fetches profile data, repositories, pinned or relevant project data, and available README information.
4. The app prepares the fetched data for AI processing.

### Step 3: Portfolio Generation

1. The user reviews the fetched profile card and repository list.
2. The user selects the repositories or project items they want to highlight.
3. The user clicks Generate Portfolio.
4. The app uses AI to shape the data into portfolio content.
5. The generated portfolio is saved to Firestore.
6. The portfolio is published at a clean username-based route.

### Step 4: Portfolio Editing

1. The user opens the portfolio page.
2. The user can toggle light and dark themes on the portfolio only.
3. There is a separate theme selection drop down to apply multiple themes to the portfolio all over.
4. The user can edit hero section image in edit mode.
5. The user can add optional sections such as achievements, education, and experience.
6. The user can regenerate the portfolio to refresh content from updated GitHub data.

### Step 5: Resume Generation

1. The user opens the resume generator.
2. The app creates a resume from the same data source used for the portfolio.
3. The user can edit typography, heading colors, bold and italic styling, and hyperlinks.
4. The user can export the resume as a PDF.

## 4. Authentication Rules

1. Firebase Auth is the main authentication layer.
2. Google sign-in identifies the user through the Firebase account.
3. GitHub OAuth is used to fetch GitHub identity and profile data through Firebase auth integration.
4. Email/password users must provide a GitHub username before portfolio generation.
5. The authenticated user cannot access the login page or landing page once signed in unless they log out.

## 5. Data Sources

### 5.1 GitHub Data

GitHub data is the primary external data source. The app should use GitHub APIs to retrieve:

1. Profile avatar
2. Display name
3. Bio
4. Public repositories
5. Repository metadata such as description, language, stars, forks, and topics
6. Contribution and README-related information where available
7. Any other profile details that help generate portfolio content

### 5.2 Firestore Data

Firestore is used to store:

1. Authentication-linked user profile records
2. Portfolio source data
3. Generated portfolio content
4. Resume data
5. User customizations and selected themes
6. Generation status and timestamps

### 5.3 AI Processing

AI is used to transform raw GitHub data into user-friendly portfolio and resume content. The app should:

1. Reduce unnecessary input before sending data to the model
2. Summarize repository data when the repository count is large
3. Preserve important developer signals such as activity, skill patterns, and project variety
4. Store the generated output for reuse without repeated API calls

## 6. Portfolio Structure

The portfolio is a developer-focused website generated from GitHub and user-provided data.

### Core Sections

1. Hero or profile summary
2. About section
3. Skills section
4. Projects section
5. Experience section
6. Education section
7. Achievements section
8. Contact section

### Optional Section Behavior

1. If GitHub README or profile data contains a relevant section, the app can prefill it.
2. If a section does not exist in GitHub data, the user can create it manually.
3. The section editor should allow adding, editing, and removing custom blocks.

## 7. Portfolio Page Behavior

1. The portfolio route should be `gitfolio.in/username`.
2. The route must remain clean and should not include dashboard prefixes.
3. The portfolio page should support theme switching only on that page.
4. The rest of the site should remain in the default dark visual style.
5. The resume page should remain paper-white to preserve print readability.
6. During generation, the UI should show a loading state with partially visible skeleton content.
7. If the portfolio already exists, the app should show view and regenerate actions instead of creating a second portfolio.

## 8. Portfolio Creation Rules

1. One user can create only one portfolio.
2. A GitHub username can only be used once for portfolio creation.
3. If a username is already linked to a portfolio, the app must show an error that the portfolio already exists.
4. After creation, the user can only update or regenerate the same portfolio.
5. The original Firestore record must be updated rather than duplicated.

## 9. Dashboard Behavior

### First-Time Creation

1. The user enters a GitHub username if it is not already available from OAuth.
2. The app fetches profile information and repository data.
3. The app shows a profile preview card with avatar, name, and bio.
4. The app shows a repository selection list.
5. The user chooses which repositories should appear in the portfolio projects section.
6. The user clicks Generate Portfolio.

### Returning User

1. The dashboard loads the stored portfolio status.
2. If the portfolio already exists, the app shows View Portfolio and Regenerate Portfolio.
3. View Portfolio reads from Firestore without calling GitHub or AI again.
4. Regenerate Portfolio fetches fresh GitHub data and updates the existing Firestore record.

## 10. Resume Behavior

1. Resume generation uses the same user profile and GitHub-derived content as the portfolio.
2. The resume should not include a profile picture.
3. Users should be able to modify the text size, font family, heading colors, bold and italic styling, and hyperlink behavior.
4. The final resume should be exportable as PDF.

## 11. URL and Access Rules

1. The authenticated portfolio route must be `gitfolio.in/username`.
2. If an unauthenticated user visits that route, the app should show a 404 page.
3. If a signed-in user visits a portfolio route that does not belong to them, the app should show a 404 page.
4. Users should only be allowed to access their own editable portfolio.

## 12. Public Portfolio Subdomain Concept

The project also plans a public portfolio URL such as `username.gitfolio.snehaagarwal.me`.

### Intended Behavior

1. The public URL should expose only the portfolio view.
2. It should not expose edit controls or dashboard features.
3. It should be available only after the user creates a portfolio through GitFolio.

### Implementation Direction

1. Store the portfolio slug and ownership mapping in Firestore.
2. Configure wildcard subdomain routing at the hosting layer.
3. Serve a public read-only portfolio view from the subdomain.
4. Reuse the same portfolio data as the authenticated route but hide all editor tools.

## 13. Image and Media Rules

1. If the user signs in with GitHub OAuth, the GitHub avatar should be used as the default profile image.
2. If the user signs in with Google, the profile image can default to the first letter of the name until the user chooses another image.
3. The portfolio page should allow image changes in edit mode.
4. Cloudinary is the intended storage layer for images and file assets.

## 14. API Strategy

### GitHub API Usage

1. Use GitHub GraphQL when fetching structured profile and repository data efficiently.
2. Use GitHub REST where a direct endpoint is simpler or more suitable.
3. Prefer GraphQL for repository filtering and aggregate profile data.
4. Keep a fallback path for requests that are easier through REST.

### AI Request Strategy

1. Do not send every repository blindly to the model when the repository list is large.
2. Rank repositories by relevance, language, recency, stars, and description quality.
3. Pre-summarize repository groups before sending them to the model.
4. Cache generated output in Firestore to reduce repeat AI calls.

## 15. Handling Edge Cases

### Username Changes on GitHub

If a user changes their GitHub username, the app needs a stable ownership strategy because the portfolio route is username-based.

Recommended approach:

1. Store an immutable internal user ID as the source of truth.
2. Store the latest GitHub username as a mutable field.
3. Keep the old username as an alias or redirect where possible.
4. Update the public route mapping when the username changes.
5. Prevent accidental creation of a second portfolio for the same account.

### Multiple Login Providers for the Same Person

If the same person signs in with Google and later with GitHub OAuth using the same email, the system should:

1. Detect matching identity where possible.
2. Link accounts to one internal user record.
3. Avoid creating duplicate portfolios.
4. Reuse the same Firestore portfolio document.

### API and Quota Failures

The system should handle:

1. GitHub API rate limits
2. AI model quota exhaustion
3. Temporary network failures
4. Partial data fetches
5. Large repository lists

Fallback behavior should include cached views, partial generation, retry prompts, and clear error messages.

## 16. Suggested Data Model Direction

The Firestore schema should be designed around these logical entities:

1. Users
2. Portfolios
3. Portfolio sections
4. Repository selections
5. Resume configurations
6. Generated assets
7. Audit or generation history

The detailed table and field mapping should be documented separately in `docs/database.md`.

## 17. Technology Stack

1. ReactJS
2. JavaScript
3. Tailwind CSS
4. Framer Motion
5. Firebase Auth
6. Firestore
7. Firebase backend services
8. Groq API for AI tasks
9. Cloudinary for media storage
10. Vercel for deployment

## 18. Delivery Priorities

1. Authentication and access control
2. GitHub data fetching
3. Portfolio generation
4. Portfolio editing and regeneration
5. Resume generation and PDF export
6. Public portfolio subdomain support
7. Quota handling and failure recovery

## 19. Future Enhancements

1. Better GitHub username change handling
2. Stronger account linking across providers
3. Smarter repository ranking for AI input reduction
4. More portfolio themes and section templates
5. Public read-only subdomain publishing
6. Advanced resume templates
