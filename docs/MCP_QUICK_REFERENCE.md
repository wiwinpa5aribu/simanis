# MCP Quick Reference - SIMANIS

> Quick reference guide untuk menggunakan MCP servers di SIMANIS

---

## 🚀 Quick Start

### Verify MCP Configuration
```bash
node scripts/test-mcp-servers.js
```

### Test Individual MCP
```text
// Test Memory
"Search memory for: SIMANIS coding standards"

// Test GitHub
"List all open issues"

// Test MySQL
"Show all tables in database"

// Test Context7
"Get React 19 hooks documentation"
```

---

## 📊 MCP Servers Summary

| MCP | Status | Use Case | Auto-Approve |
|-----|--------|----------|--------------|
| 🧠 **memory** | ✅ | Persistent AI context | ✅ Yes |
| 🐙 **github** | ✅ | Git operations | ✅ Yes |
| 🗄️ **mysql** | ✅ | Database queries | ✅ Yes |
| 📚 **context7** | ✅ | Library docs | ✅ Yes |
| 🤔 **sequential-thinking** | ✅ | Complex reasoning | ❌ Manual |
| 🎭 **playwright** | ✅ | UI testing | ❌ Manual |
| 🧪 **TestSprite** | ✅ | Test generation | ✅ Yes |

---

## 💬 Command Examples

### Memory MCP
```text
✅ "Save to memory: We decided to use camelCase for all properties"
✅ "Search memory for: Phase 1 decisions"
✅ "What did we decide about the monorepo structure?"
```

### GitHub MCP
```text
✅ "List all open issues"
✅ "Create branch: feature/phase-1-tooling"
✅ "Create PR: feat: migrate to pnpm"
✅ "Show recent commits"
❌ "Merge PR without review" (needs manual approval)
```

### MySQL MCP
```text
✅ "Show all tables"
✅ "Describe assets table structure"
✅ "Query assets where kondisi = 'Baik'"
✅ "How many loans are currently active?"
❌ "DELETE from assets" (destructive, be careful)
```

### Context7 MCP
```text
✅ "Get React 19 useQuery documentation"
✅ "Show Fastify plugin best practices"
✅ "Find Prisma migration guide"
✅ "How to use Zod with TypeScript?"
```

### Sequential Thinking MCP
```text
✅ "Use sequential thinking to plan Phase 1 migration"
✅ "Analyze pros and cons of Biome vs ESLint"
✅ "Think through the monorepo migration steps"
```

### Playwright MCP
```text
✅ "Test login flow with Playwright"
✅ "Take screenshot of dashboard page"
✅ "Run E2E test for asset creation"
```

### TestSprite MCP
```text
✅ "Generate test plan for asset management"
✅ "Create PRD for Phase 1 tooling"
```

---

## 🎯 Use Cases by Task

### Starting New Feature
1. **Sequential Thinking:** Plan the feature
2. **Context7:** Check library docs
3. **GitHub:** Create feature branch
4. **Memory:** Save design decisions

### Debugging
1. **MySQL:** Query data to verify
2. **GitHub:** Check related commits
3. **Memory:** Search for similar issues
4. **Sequential Thinking:** Analyze root cause

### Code Review
1. **GitHub:** Get PR details
2. **Context7:** Verify best practices
3. **MySQL:** Test data queries
4. **Playwright:** Test UI changes

### Documentation
1. **Memory:** Retrieve decisions
2. **GitHub:** Check commit history
3. **Sequential Thinking:** Organize content

---

## ⚠️ Important Reminders

### Memory MCP
- ✅ Save important decisions
- ✅ Save bug solutions
- ❌ Don't save temporary data
- ❌ Don't save sensitive info

### GitHub MCP
- ✅ Always create feature branch
- ✅ Write clear PR descriptions
- ❌ Never commit to main/develop
- ❌ Never force push

### MySQL MCP
- ✅ Use for data verification
- ✅ Use for schema inspection
- ❌ Avoid destructive queries
- ❌ Don't modify production data

---

## 📚 Full Documentation

For detailed documentation, see:
- [MCP Servers Full Guide](./MCP_SERVERS.md)
- [AI Instructions](./AI_INSTRUCTIONS.md)
- [Current Status](./progress/CURRENT_STATUS.md)

---

## 🔄 Last Updated

**Date:** 2025-12-02  
**By:** Rovo Dev (Claude)  
**Version:** 1.0
