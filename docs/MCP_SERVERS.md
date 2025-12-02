# MCP Servers - SIMANIS

> Dokumentasi MCP (Model Context Protocol) servers yang tersedia di project SIMANIS

---

## 📋 Status MCP Servers

Berdasarkan `.kiro/settings/mcp.json`, berikut adalah MCP servers yang dikonfigurasi:

### 🟢 Enabled Servers

| Server | Status | Auto-Approve | Fungsi |
|--------|--------|--------------|--------|
| **sequential-thinking** | ✅ Enabled | Manual | Complex reasoning dan planning |
| **context7** | ✅ Enabled | ✅ Auto | Library documentation |
| **playwright** | ✅ Enabled | Manual | Browser automation & UI testing |
| **TestSprite** | ✅ Enabled | ✅ Auto | Test plan & PRD generation |
| **mysql** | ✅ Enabled | ✅ Auto | Database queries (simanis_dev) |
| **github** | ✅ Enabled | ✅ Auto | GitHub integration |
| **memory** | ✅ Enabled | ✅ Auto | Persistent AI memory |

### 🔴 Disabled Servers

| Server | Status | Reason |
|--------|--------|--------|
| **brave-search** | ❌ Disabled | API key not configured |
| **aws-docs** | ❌ Disabled | Not needed for current phase |

---

## 🧠 Memory MCP

**Status:** ✅ Enabled  
**Storage:** `D:/simanis/.kiro/memory/simanis-memory.jsonl`

### Fungsi
- Menyimpan context antar session AI
- Search knowledge yang sudah tersimpan
- Persistent memory untuk keputusan penting

### Auto-approved Actions
- `search_nodes` - Cari di memory
- `open_nodes` - Buka specific nodes
- `read_graph` - Baca graph structure
- `add_observations` - Tambah observations

### Cara Penggunaan
```text
// Simpan ke memory
"Save to memory: Decision to use camelCase for all properties in SIMANIS"

// Cari dari memory
"Search memory for: coding standards"
"Search memory for: Phase 1 decisions"
```

---

## 🐙 GitHub MCP

**Status:** ✅ Enabled  
**Token:** Configured (ghp_...)

### Fungsi
- Manage GitHub issues
- Create & manage pull requests
- List commits
- Branch management
- File operations

### Auto-approved Actions
- `list_issues`, `list_commits`, `list_pull_requests`
- `create_branch`, `create_pull_request`, `create_issue`
- `get_file_contents`, `create_or_update_file`
- `update_issue`, `update_pull_request_branch`
- `merge_pull_request`, `get_pull_request_status`

### Cara Penggunaan
```text
// List issues
"Show me all open issues"

// Create branch
"Create feature branch for Phase 1 tooling migration"

// Create PR
"Create pull request: feat: migrate to pnpm"
```

---

## 🗄️ MySQL MCP

**Status:** ✅ Enabled  
**Database:** simanis_dev  
**Host:** localhost:3306  
**User:** root

### Fungsi
- Query database langsung
- Inspect schema
- Fetch data untuk analysis

### Auto-approved Actions
- `list_tables` - List all tables
- `describe_table` - Show table structure
- `fetch_data` - Query data (SELECT)
- `execute_query` - Run any query

### Cara Penggunaan
```text
// List tables
"Show all tables in database"

// Describe table
"Describe structure of assets table"

// Query data
"Query assets where kondisi = 'Baik' limit 10"

// Check data
"How many assets in database?"
```

---

## 📚 Context7 MCP

**Status:** ✅ Enabled

### Fungsi
- Akses dokumentasi library terbaru
- Best practices dari official docs
- API reference

### Auto-approved Actions
- `resolve-library-id` - Find library
- `get-library-docs` - Get documentation

### Cara Penggunaan
```text
// Get React docs
"Show me React 19 hooks documentation"

// Get Fastify docs
"Find Fastify authentication best practices"

// Get Prisma docs
"Show Prisma schema migration documentation"
```

---

## 🤔 Sequential Thinking MCP

**Status:** ✅ Enabled

### Fungsi
- Deep analysis dan reasoning
- Complex problem solving
- Step-by-step planning

### Cara Penggunaan
```text
// Complex planning
"Use sequential thinking to plan Phase 1 migration to monorepo"

// Deep analysis
"Analyze the pros and cons of Biome vs ESLint+Prettier"

// Problem solving
"Think through the steps needed to migrate from npm to pnpm"
```

---

## 🎭 Playwright MCP

**Status:** ✅ Enabled

### Fungsi
- Browser automation
- UI testing
- E2E test execution

### Cara Penggunaan
```text
// Test UI
"Use Playwright to test login flow"

// Screenshot
"Take screenshot of asset list page"

// E2E test
"Run end-to-end test for loan creation"
```

---

## 🧪 TestSprite MCP

**Status:** ✅ Enabled  
**API Key:** Configured

### Fungsi
- Generate test plans
- Create standardized PRD
- AI-powered test generation

### Auto-approved Actions
- `testsprite_generate_frontend_test_plan`
- `testsprite_generate_standardized_prd`

### Cara Penggunaan
```text
// Generate test plan
"Generate test plan for asset management feature"

// Create PRD
"Create PRD for Phase 1 tooling migration"
```

---

## 🔧 Verification

### Test MCP Configuration
```bash
# Run test script
node scripts/test-mcp-servers.js
```

### Manual Test Commands

```text
// Test Memory MCP
"Search memory for: SIMANIS"

// Test GitHub MCP
"List open issues in this repository"

// Test MySQL MCP
"Show all tables in simanis_dev database"

// Test Context7 MCP
"Get React documentation for useQuery hook"

// Test Sequential Thinking MCP
"Use sequential thinking to analyze current architecture"
```

---

## 📝 Best Practices

### 1. Memory MCP
- **DO:** Simpan keputusan arsitektur penting
- **DO:** Simpan bug fixes dan solusinya
- **DON'T:** Simpan data temporary/sementara

### 2. GitHub MCP
- **DO:** Create branch sebelum mulai feature
- **DO:** Create PR dengan description lengkap
- **DON'T:** Merge PR tanpa review
- **DON'T:** Commit langsung ke main/develop

### 3. MySQL MCP
- **DO:** Use untuk verify data
- **DO:** Use untuk understand schema
- **DON'T:** Run destructive queries (DELETE, DROP)
- **DON'T:** Modify production data

### 4. Sequential Thinking MCP
- **DO:** Use untuk complex decisions
- **DO:** Use untuk multi-step planning
- **DON'T:** Use untuk simple tasks

---

## 🚨 Security Notes

### GitHub Token
- Token disimpan di `mcp.json` (not committed)
- `.gitignore` sudah exclude `.kiro/settings/mcp.json`
- **JANGAN** commit token ke repository

### MySQL Credentials
- Development database only
- Localhost access only
- Empty password (dev environment)

### Environment Variables
- Sensitive data di environment variables
- Template di `mcp.json.example`
- Actual values di `mcp.json` (ignored by git)

---

## 📚 Related Documentation

- [AI Instructions](./AI_INSTRUCTIONS.md) - General AI behavior rules
- [Current Status](./progress/CURRENT_STATUS.md) - Project status
- [Cursor Rules](../.cursorrules) - Cursor IDE specific rules
- [Claude Rules](../CLAUDE.md) - Claude specific rules

---

## 🔄 Updates

| Date | Change | By |
|------|--------|-----|
| 2025-12-02 | Initial MCP documentation | Rovo Dev |

---

**Next Steps:**
1. Test each MCP server dengan actual commands
2. Verify connectivity to all enabled servers
3. Document any issues or limitations found
