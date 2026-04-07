# GitFolio Firestore Database Design

## 1. Purpose

This document defines the logical Firestore data model for GitFolio. The schema is designed to support one authenticated user, one portfolio per user, editable portfolio sections, resume settings, generated assets, and audit history.

## 2. Design Principles

1. Keep one stable internal user record per person.
2. Store the latest GitHub username as mutable profile data.
3. Keep portfolio ownership separate from rendered content.
4. Store generated content so the app can read without regenerating.
5. Avoid duplicating user portfolio records.

## 3. Top-Level Collections

The recommended Firestore collections are:

1. `users`
2. `portfolios`
3. `portfolio_sections`
4. `resume_configs`
5. `generated_assets`
6. `generation_history`
7. `linked_accounts`

## 4. Collection Definitions

### 4.1 `users`

Stores the authenticated account identity.

Suggested fields:

1. `id` - internal user id
2. `firebaseUid` - Firebase Auth UID
3. `displayName` - user display name
4. `email` - primary email
5. `authProvider` - google, github, or password
6. `profileImage` - current avatar or placeholder
7. `githubUsername` - latest GitHub username if available
8. `createdAt` - account creation timestamp
9. `updatedAt` - last update timestamp

### 4.2 `linked_accounts`

Stores provider mappings for the same person.

Suggested fields:

1. `userId` - reference to `users.id`
2. `provider` - google, github, or password
3. `providerUid` - provider-specific identity id
4. `email` - provider email
5. `createdAt` - link timestamp

### 4.3 `portfolios`

Stores one portfolio per user.

Suggested fields:

1. `id` - portfolio id
2. `userId` - reference to `users.id`
3. `slug` - route username slug
4. `githubUsername` - current GitHub username used for generation
5. `title` - portfolio title
6. `summary` - generated profile summary
7. `themeMode` - light or dark
8. `status` - draft, generated, published, or regenerated
9. `publicUrl` - optional public subdomain URL
10. `isPublic` - public visibility flag
11. `createdAt` - creation timestamp
12. `updatedAt` - last update timestamp
13. `lastGeneratedAt` - regeneration timestamp

### 4.4 `portfolio_sections`

Stores editable content blocks for the portfolio.

Suggested fields:

1. `id` - section id
2. `portfolioId` - reference to `portfolios.id`
3. `type` - about, skills, projects, experience, education, achievements, contact, or custom
4. `title` - section heading
5. `content` - structured section content
6. `order` - display order
7. `enabled` - whether the section is visible
8. `source` - github, ai, or manual
9. `createdAt` - creation timestamp
10. `updatedAt` - last update timestamp

### 4.5 `resume_configs`

Stores resume-specific formatting and content settings.

Suggested fields:

1. `id` - config id
2. `portfolioId` - reference to `portfolios.id`
3. `templateName` - selected resume template
4. `fontFamily` - chosen font family
5. `fontSize` - base font size
6. `headingColor` - heading color
7. `textStyle` - bold, italic, or normal preferences
8. `showHyperlinks` - hyperlink toggle
9. `paperStyle` - white paper export setting
10. `updatedAt` - last update timestamp

### 4.6 `generated_assets`

Stores generated outputs and downloadable files.

Suggested fields:

1. `id` - asset id
2. `portfolioId` - reference to `portfolios.id`
3. `assetType` - portfolio, resume, pdf, image, or preview
4. `storageUrl` - Cloudinary or file URL
5. `format` - html, json, pdf, or image
6. `version` - asset version number
7. `createdAt` - generation timestamp

### 4.7 `generation_history`

Stores logs for generation and regeneration events.

Suggested fields:

1. `id` - history id
2. `portfolioId` - reference to `portfolios.id`
3. `userId` - reference to `users.id`
4. `action` - create, regenerate, update, export, or retry
5. `status` - success, failed, or partial
6. `message` - summary of the result
7. `createdAt` - event timestamp

## 5. Relationship Model

1. One `users` document maps to one primary `portfolios` document.
2. One user can have multiple `linked_accounts` entries.
3. One portfolio can contain many `portfolio_sections` documents.
4. One portfolio can have one `resume_configs` document.
5. One portfolio can have many `generated_assets` entries over time.
6. One portfolio can have many `generation_history` records.

## 6. Uniqueness Rules

1. `users.firebaseUid` must be unique.
2. `users.email` should be unique where possible.
3. `portfolios.userId` must be unique.
4. `portfolios.slug` must be unique.
5. `users.githubUsername` should be unique across active portfolios.

## 7. Username Change Strategy

If GitHub username changes, update the mutable `githubUsername` field while keeping `userId` and `portfolio.id` stable. If possible, retain old slugs as aliases or redirects.

## 8. Public Subdomain Mapping

If public portfolio subdomains are enabled, store:

1. `publicUrl`
2. `slug`
3. `userId`
4. `portfolioId`

This mapping allows the hosting layer to resolve a public portfolio view without exposing edit controls.

## 9. Suggested Firestore Structure Example

```text
users/{userId}
linked_accounts/{accountId}
portfolios/{portfolioId}
portfolio_sections/{sectionId}
resume_configs/{configId}
generated_assets/{assetId}
generation_history/{historyId}
```

## 10. Notes for Implementation

1. Prefer document IDs that are stable and easy to reference.
2. Use timestamps for cache invalidation and regeneration logic.
3. Store AI-generated content separately from raw GitHub data.
4. Keep manual edits isolated from source imports so regeneration does not overwrite user changes unexpectedly.
5. Apply Firestore security rules so users can only read and write their own documents.
