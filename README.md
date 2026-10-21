# Fraudit: A Next.JS Reddit Clone

Fraudit is a web application built with Next.js, a popular React framework, designed to server as a Reddit-like platform for discussing and reviewing all forms of activities across various industries. The application aims to provide a user-friendly interface for users to create and participate in discussions, and access various topics.

### Table of Content

- Features
- Getting Started
- Project Structure
- Code Snippets
- Technologies Used
- Package Managers
- Scripts
- Changelog
- License

### Features

- User Authentication using Clerk
- Creation of new discussion threads with customizable titles and content
- Commenting on existing discussion without nested replies
- User roles and permissions for different levels of access
- Integration with external services for data validation and enrichment

### Getting Started

To get started with Fraudit, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/kourosh-alasti/fraudit.git
```

2. Change into the project directory:

```bash
cd fraudit
```

3. Install the project dependencies:

Use Node.js 22.13 or newer and the pnpm version pinned in `package.json`. The committed pnpm patch is required for the braces security fix.

```bash
corepack enable
pnpm install --frozen-lockfile
```

4. Update your environment variables:

```bash
# .env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # UPDATE THIS
NEXT_PUBLIC_CLERK_URL= # UPDATE THIS

NEXT_PUBLIC_NEON_URL=$NEON_DB_URL
```

```bash
# .env.local
CLERK_SECRET_KEY= #UPDATE THIS
CLERK_WEBHOOK_SECRET= #UPDATE THIS

NEON_DB_URL= #UPDATE THIS
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open your browser and navigate to http://localhost:3000 to see the Fraudit Application in action.

### Project Structure

The project structure is organized as follows:

- `public`: contains static assets like images and icons.
- `src`: contains the main source code directory, contains the following sub-directories:

  - `components`: contains resusable UI components
  - `db`: contains database-related files and schemas
  - `lib`: contains utility functions
  - `app`: contains the pages for the frontend
  - `actions`: contains the Next.js server actions
  - `store`: contains the state management hooks

### Code Snippets

Here's an example of how you can use the `logDir` variable from the provided code snippet:

File: `/src/components/changelog.tsx`

Code:

```typescript
import path from "path";

const logDir = path.join(process.cwd(), "changelogs");

export const Changelog = () => {
  // redacted
};
```

In this example, the logDir variable is used to define the path to the directory containing the changelog files. You can modify this variable to suit you specific project requirements.

### Technologies Used

Fraudit is built using the following technologies:

- Next.js: A React framework for building server-rendered or statis applications
- Clerk: A universal identity and access management platform for web applications
- React: A Javascript library for building User Interfaces
- Drizzle-ORM: A Typescript ORM for PostgreSQL
- TailwindCSS: A utility-first CSS framework for rapid and modern website design
- Typescript: A typed superset of Javascript that compiles to vanilla JS

### Package Managers

The project uses pnpm 12.14.0, pinned in `package.json`. Keep `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `patches/` together so installs apply the security patch and transitive overrides.

### Scripts

The project includes the following scripts:

- `dev`: Starts the Next.js development server
- `build`: Builds the Next.js application for production
- `start`: Starts the Next.js production server
- `lint`: Lints the codebase using ESLint following `eslint.config.mjs`
- `db:studio`: Starts the drizzle-kit studio for managing and visualizing database schema
- `db:push`: Pushes Schema changes to hosted database

### Dependency audit (October 20, 2026)

All retained direct dependencies were checked against npm's latest stable releases, and transitive dependencies were refreshed. The initial audit reported 96 advisories (4 critical, 48 high, 37 moderate, 7 low). The final audit reports only `GHSA-vfj7-8cjw-p6xm` for braces; the registry scanner cannot account for the local patch. No advisory is suppressed.

- `patches/braces@3.0.3.patch` applies the five runtime-file changes from [micromatch/braces PR #72](https://github.com/micromatch/braces/pull/72), including parsing/AST depth limits and cyclic-parent detection. Regression tests resolve the actual transitive braces copy. Remove the patch only after upgrading to an upstream release containing the fix.
- Scoped overrides update esbuild under `@esbuild-kit/core-utils` and postcss-selector-parser under `@tailwindcss/typography`, whose latest parents still pin vulnerable versions. Revisit these overrides when those parents update their requirements.
- TypeScript 7 runs `typecheck`. The `typescript` alias supplies the official TypeScript 6 compatibility API for Next.js and typescript-eslint, following [Microsoft's migration guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).
- ESLint 10 runs successfully, but the current import, JSX accessibility, and React plugins still declare peer ranges through ESLint 9. Existing effect/state and effect-dependency issues remain lint warnings; the new React Compiler effect/state rule is configured as a warning during this dependency migration.
- Next.js 16 uses `src/proxy.ts`, async request APIs, and ESLint's flat config. Clerk 7 uses `Show`; Zod 4 uses `error`; Svix 2 payloads are parsed only after signature verification. Database queries invoked from client components now use server actions.
- Drizzle's CLI uses `push` instead of `push:pg`. The schema is unchanged; no database migration or live schema push is required. Schema generation was checked in a temporary directory.

Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` to verify changes. `pnpm audit` will continue to report the patched braces advisory until upstream publishes a fixed version. Two deprecated Drizzle tooling dependencies (`@esbuild-kit/core-utils` and `@esbuild-kit/esm-loader`) remain in its latest stable release.

### Changelog

The project maintains a detailed changelog in the `changelogs` directory, which contains a series of changelog files. Each file represents a specific version of the application and includes a list of changes, bug fixes, and new features introduced in respective version.

### License

Fraudit is licensed under the MIT License. You can find the full license text in the `LICENSE` file in the root directoy of the project.
