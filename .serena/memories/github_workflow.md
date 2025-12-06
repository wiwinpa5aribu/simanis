# GitHub Branch Workflow - SIMANIS

## Branch Structure

```
main (ff004cd) ← Production branch
  │
  └── develop (8d194ef) ← Development branch
          │
          └── feature/* / fix/* branches ← Feature/fix branches
```

## Workflow Pattern

### 1. Feature Development
- Create feature branch from `develop`: `feature/*` or `fix/*`
- Work on feature branch
- Create PR to merge into `develop`
- After review, merge to `develop`

### 2. Release to Production
- Create PR from `develop` → `main`
- After review, merge to `main`
- Optionally sync `main` back to `develop`

## Current Branch Status (Dec 7, 2024)

### main (ff004cd)
- Latest commit: "chore: sync develop to main - CI/CD improvements (#45)"
- Date: Dec 6, 2025

### develop (8d194ef)
- Latest commit: "Merge branch 'main' into develop"
- Date: Dec 6, 2025
- Contains: CI/CD improvements, lint fixes

## Open PRs (Dependabot)
- #54: zod 3.25.76 → 4.1.13 (apps/web)
- #53: @sentry/react 10.28.0 → 10.29.0 (apps/web)
- #52: react group updates (apps/web)
- #51: prisma group 6.19.0 → 7.1.0 (packages/database)
- #50: jsonwebtoken 9.0.2 → 9.0.3 (apps/api)
- #49: pdfkit 0.14.0 → 0.17.2 (apps/api)
- #48: fastify group updates (apps/api)

## Local Branch (fix/resolve-main-develop-conflict)
- Contains: Core module system + Self-debugging entity
- Status: Committed locally, needs push via GitHub MCP
- Target: develop

## Push Strategy
Since git push fails with auth error, use GitHub MCP to:
1. Create branch via `mcp_github_create_branch`
2. Push files via `mcp_github_push_files`
3. Create PR via `mcp_github_create_pull_request`
