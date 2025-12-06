/**
 * Danger JS Configuration for SIMANIS
 *
 * Automated code review checks for Pull Requests
 * Docs: https://danger.systems/js/
 */

import { danger, fail, markdown, message, warn } from 'danger'

// =============================================================================
// Configuration
// =============================================================================

const PR_SIZE_LIMIT = 500 // Lines changed
const PR_FILES_LIMIT = 20 // Number of files
const DESCRIPTION_MIN_LENGTH = 20

// =============================================================================
// Helper Functions
// =============================================================================

const getModifiedFiles = (pattern: RegExp) =>
  danger.git.modified_files.filter((file) => pattern.test(file))

const getCreatedFiles = (pattern: RegExp) =>
  danger.git.created_files.filter((file) => pattern.test(file))

const getAllChangedFiles = (pattern: RegExp) => [
  ...getModifiedFiles(pattern),
  ...getCreatedFiles(pattern),
]

// =============================================================================
// PR Metadata Checks
// =============================================================================

// Check PR description
if (
  !danger.github.pr.body ||
  danger.github.pr.body.length < DESCRIPTION_MIN_LENGTH
) {
  fail('❌ Tolong tambahkan deskripsi PR yang jelas (minimal 20 karakter)')
}

// Check PR title format (conventional commits)
const prTitle = danger.github.pr.title
const conventionalCommitRegex =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+/
if (!conventionalCommitRegex.test(prTitle)) {
  warn(
    '⚠️ Judul PR sebaiknya mengikuti format Conventional Commits:\n' +
      '`feat|fix|docs|style|refactor|perf|test|build|ci|chore(scope): description`\n' +
      'Contoh: `feat(auth): add login functionality`'
  )
}

// =============================================================================
// PR Size Checks
// =============================================================================

const linesChanged = danger.github.pr.additions + danger.github.pr.deletions
const filesChanged =
  danger.git.modified_files.length + danger.git.created_files.length

if (linesChanged > PR_SIZE_LIMIT) {
  warn(
    `⚠️ PR ini cukup besar (${linesChanged} baris diubah). ` +
      `Pertimbangkan untuk memecah menjadi PR yang lebih kecil untuk review yang lebih mudah.`
  )
}

if (filesChanged > PR_FILES_LIMIT) {
  warn(
    `⚠️ PR ini mengubah ${filesChanged} file. ` +
      `Pertimbangkan untuk memecah menjadi PR yang lebih kecil.`
  )
}

// =============================================================================
// Code Quality Checks
// =============================================================================

// Files to exclude from code quality checks (to avoid self-detection)
const excludedFiles = ['dangerfile.ts']

// Check for console.log in TypeScript/JavaScript files
// Exclude dangerfile.ts to avoid self-detection
const tsFiles = getAllChangedFiles(/\.(ts|tsx|js|jsx)$/).filter(
  (file) => !excludedFiles.includes(file) && !file.includes('dangerfile')
)

tsFiles.forEach(async (file) => {
  const content = await danger.git.diffForFile(file)
  if (content && content.added.includes('console.log')) {
    warn(
      `⚠️ \`console.log\` ditemukan di \`${file}\`. Pastikan ini intentional atau gunakan logger.`
    )
  }
})

// Check for TODO/FIXME comments (skip dangerfile.ts)
tsFiles.forEach(async (file) => {
  const content = await danger.git.diffForFile(file)
  if (content) {
    if (content.added.includes('TODO')) {
      message(
        `📝 TODO baru ditemukan di \`${file}\`. Pertimbangkan untuk membuat issue.`
      )
    }
    if (content.added.includes('FIXME')) {
      warn(
        `⚠️ FIXME ditemukan di \`${file}\`. Ini sebaiknya diperbaiki sebelum merge.`
      )
    }
  }
})

// Check for debugger statements (skip dangerfile.ts to avoid self-detection)
tsFiles
  .filter((file) => !file.includes('dangerfile'))
  .forEach(async (file) => {
    const content = await danger.git.diffForFile(file)
    // Match lines that start with + and contain standalone debugger keyword
    // Excludes string literals like 'debugger' or "debugger"
    if (
      content &&
      /^\+(?!.*['"`].*debugger.*['"`]).*\bdebugger\s*;?\s*$/m.test(content.diff)
    ) {
      fail(
        `❌ debugger statement ditemukan di \`${file}\`. Tolong hapus sebelum merge.`
      )
    }
  })

// =============================================================================
// File-specific Checks
// =============================================================================

// Check if package.json changed but pnpm-lock.yaml didn't
const packageJsonChanged = danger.git.modified_files.includes('package.json')
const lockfileChanged = danger.git.modified_files.includes('pnpm-lock.yaml')

if (packageJsonChanged && !lockfileChanged) {
  warn(
    '⚠️ `package.json` diubah tapi `pnpm-lock.yaml` tidak. ' +
      'Pastikan untuk menjalankan `pnpm install` dan commit lockfile.'
  )
}

// Check for changes in sensitive files
const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.production',
  'apps/api/.env',
]

sensitiveFiles.forEach((file) => {
  if (
    danger.git.modified_files.includes(file) ||
    danger.git.created_files.includes(file)
  ) {
    fail(
      `❌ File sensitif \`${file}\` tidak boleh di-commit. Gunakan \`.env.example\` sebagai template.`
    )
  }
})

// Check for Prisma schema changes
const prismaSchemaChanged = danger.git.modified_files.some((file) =>
  file.includes('schema.prisma')
)

if (prismaSchemaChanged) {
  message(
    '📊 Prisma schema diubah. Pastikan untuk:\n' +
      '1. Menjalankan `pnpm db:generate`\n' +
      '2. Membuat migration jika diperlukan (`pnpm db:migrate`)\n' +
      '3. Update seed data jika diperlukan'
  )
}

// =============================================================================
// Test Coverage Checks
// =============================================================================

// Check if source files changed but no test files
const sourceFilesChanged = getAllChangedFiles(
  /apps\/(web|api)\/src\/.*\.(ts|tsx)$/
)
const testFilesChanged = getAllChangedFiles(/\.(test|spec)\.(ts|tsx)$/)

if (sourceFilesChanged.length > 0 && testFilesChanged.length === 0) {
  warn(
    '⚠️ File source diubah tapi tidak ada file test yang diubah. ' +
      'Pertimbangkan untuk menambahkan atau update test.'
  )
}

// =============================================================================
// Documentation Checks
// =============================================================================

// Check if API routes changed but no docs update
const apiRoutesChanged = getAllChangedFiles(/apps\/api\/src\/.*routes.*\.(ts)$/)
const docsChanged = getAllChangedFiles(/docs\/.*\.(md)$/)

if (apiRoutesChanged.length > 0 && docsChanged.length === 0) {
  message(
    '📚 API routes diubah. Pertimbangkan untuk update dokumentasi API jika ada perubahan endpoint.'
  )
}

// =============================================================================
// Summary
// =============================================================================

// Add PR summary
markdown(`
## 📊 PR Summary

| Metric | Value |
|--------|-------|
| Files Changed | ${filesChanged} |
| Lines Added | ${danger.github.pr.additions} |
| Lines Removed | ${danger.github.pr.deletions} |
| Total Changes | ${linesChanged} |
`)

// Congratulate on small PRs
if (linesChanged < 100 && filesChanged < 5) {
  message(
    '🎉 PR yang bagus dan fokus! Terima kasih sudah menjaga PR tetap kecil.'
  )
}
