# CI/CD Pipeline Documentation

## Overview

SIMANIS menggunakan GitHub Actions untuk Continuous Integration dan Continuous Deployment. Pipeline ini memastikan kualitas kode, menjalankan tests, dan membuat build artifacts.

## Workflow Structure

File: `.github/workflows/ci.yml`

### Jobs

#### 1. **Lint & Format Check**
- **Purpose**: Memvalidasi code quality dan formatting
- **Tools**: Biome (linter + formatter)
- **Steps**:
  - Checkout code
  - Setup Node.js 20 & pnpm 9
  - Install dependencies
  - Generate Prisma Client
  - Run Biome lint
  - Check Biome format

#### 2. **API Tests & Coverage**
- **Purpose**: Menjalankan unit tests untuk backend API
- **Coverage Target**: 80%+ untuk statements, lines, functions; 75%+ untuk branches
- **Steps**:
  - Checkout code
  - Setup Node.js & pnpm
  - Install dependencies
  - Generate Prisma Client
  - Run tests with coverage (`pnpm --filter @simanis/api test:cov`)
  - Upload coverage to Codecov
  - Save coverage artifacts

**Coverage Metrics:**
- Statements: 85.49% ✅
- Branches: 77.21% ✅
- Functions: 80.76% ✅
- Lines: 85.26% ✅

#### 3. **Web Tests**
- **Purpose**: Menjalankan unit tests untuk frontend
- **Steps**:
  - Checkout code
  - Setup Node.js & pnpm
  - Install dependencies
  - Run tests (`pnpm --filter @simanis/web test`)

#### 4. **Build All Apps**
- **Purpose**: Build production artifacts
- **Dependencies**: Requires lint, test-api, and test-web to pass
- **Steps**:
  - Checkout code
  - Setup Node.js & pnpm
  - Install dependencies
  - Generate Prisma Client
  - Build all apps (`pnpm run build`)
  - Upload API build artifact
  - Upload Web build artifact

## Triggers

Pipeline berjalan pada:
- **Push** ke branch `main` atau `develop`
- **Pull Request** ke branch `main` atau `develop`

## Environment Variables

```yaml
NODE_VERSION: '20'
PNPM_VERSION: '9'
```

## Caching Strategy

Pipeline menggunakan pnpm store cache untuk mempercepat instalasi dependencies:

```yaml
key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
restore-keys: |
  ${{ runner.os }}-pnpm-store-
```

## Artifacts

### Coverage Reports
- **Name**: `api-coverage`
- **Path**: `apps/api/coverage/`
- **Retention**: 7 days

### Build Artifacts
- **API Build**:
  - Name: `api-dist`
  - Path: `apps/api/dist/`
  - Retention: 7 days

- **Web Build**:
  - Name: `web-dist`
  - Path: `apps/web/dist/`
  - Retention: 7 days

## Integration with Codecov

Coverage reports dikirim ke Codecov untuk tracking dan visualization:

```yaml
- name: Upload API coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./apps/api/coverage/lcov.info
    flags: api
    name: api-coverage
    fail_ci_if_error: false
```

## Running Locally

Untuk menjalankan same checks locally sebelum push:

### Lint & Format
```bash
pnpm run lint
pnpm run format:check
```

### Tests
```bash
# API tests with coverage
pnpm --filter @simanis/api test:cov

# Web tests
pnpm --filter @simanis/web test
```

### Build
```bash
pnpm run build
```

## Performance Optimization

1. **Parallel Jobs**: Lint, API tests, dan Web tests berjalan parallel
2. **Dependency Caching**: pnpm store di-cache untuk mempercepat instalasi
3. **Frozen Lockfile**: Menggunakan `--frozen-lockfile` untuk consistency
4. **Artifact Upload**: Hanya artifact yang diperlukan yang di-upload

## Troubleshooting

### Job Failures

#### Lint Job Fails
```bash
# Fix locally
pnpm run lint:fix
pnpm run format
```

#### Test Job Fails
```bash
# Run tests locally
pnpm --filter @simanis/api test:cov
pnpm --filter @simanis/web test
```

#### Build Job Fails
```bash
# Check if Prisma Client is generated
pnpm --filter @simanis/database db:generate

# Try build locally
pnpm run build
```

### Common Issues

1. **Coverage threshold not met**
   - Add more unit tests
   - Target: 80%+ for statements, lines, functions

2. **Prisma Client not found**
   - Ensure `db:generate` runs before build
   - Check `packages/database/prisma/schema.prisma`

3. **pnpm cache issues**
   - Clear cache in GitHub Actions settings
   - Or update cache key in workflow

## Future Improvements

- [ ] Add E2E tests with Playwright
- [ ] Add performance testing
- [ ] Add security scanning (SAST/DAST)
- [ ] Add deployment to staging/production
- [ ] Add release automation
- [ ] Add Dependabot for dependency updates
- [ ] Add code quality badges

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pnpm Action Setup](https://github.com/pnpm/action-setup)
- [Codecov Action](https://github.com/codecov/codecov-action)
- [Turborepo with GitHub Actions](https://turbo.build/repo/docs/ci/github-actions)
