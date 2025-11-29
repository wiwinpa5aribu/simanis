# MCP (Model Context Protocol) Setup - SIMANIS

## Overview
MCP servers memberikan Kiro kemampuan tambahan untuk berinteraksi dengan external services.

## Prasyarat
Install `uv` (Python package manager):
```bash
# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## MCP Servers yang Tersedia

### 1. MySQL Database
Query database SIMANIS langsung dari Kiro.

**Setup:**
1. Set environment variable:
   ```bash
   # Windows
   $env:MYSQL_PASSWORD = "your-mysql-password"
   
   # Linux/macOS
   export MYSQL_PASSWORD="your-mysql-password"
   ```

2. Enable di `.kiro/settings/mcp.json`:
   ```json
   "mysql": {
     "disabled": false
   }
   ```

3. Restart Kiro atau reconnect MCP

**Penggunaan:**
- "Query semua assets dari database"
- "Tampilkan users yang role admin"
- "Cek data loan yang status dipinjam"

---

### 2. GitHub
Manage repository, issues, dan PRs.

**Setup:**
1. Buat Personal Access Token di GitHub:
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Scope: `repo`, `read:org`

2. Set environment variable:
   ```bash
   # Windows
   $env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
   
   # Linux/macOS
   export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
   ```

3. Enable di `.kiro/settings/mcp.json`:
   ```json
   "github": {
     "disabled": false
   }
   ```

**Penggunaan:**
- "Buat issue baru untuk bug login"
- "List semua open PRs"
- "Tutup issue #123"

---

### 3. Brave Search
Cari dokumentasi dan troubleshoot errors.

**Setup:**
1. Daftar di https://brave.com/search/api/ untuk API key

2. Set environment variable:
   ```bash
   # Windows
   $env:BRAVE_API_KEY = "BSA_xxxxxxxxxxxx"
   
   # Linux/macOS
   export BRAVE_API_KEY="BSA_xxxxxxxxxxxx"
   ```

3. Enable di `.kiro/settings/mcp.json`:
   ```json
   "brave-search": {
     "disabled": false
   }
   ```

**Penggunaan:**
- "Cari dokumentasi Prisma untuk soft delete"
- "Bagaimana cara fix error CORS di Fastify"
- "Best practice React Query caching"

---

### 4. AWS Documentation
Akses dokumentasi AWS untuk deployment.

**Setup:**
1. Enable di `.kiro/settings/mcp.json`:
   ```json
   "aws-docs": {
     "disabled": false
   }
   ```

**Penggunaan:**
- "Cara deploy ke AWS EC2"
- "Setup RDS MySQL"
- "Konfigurasi S3 untuk file storage"

---

## Troubleshooting

### MCP tidak connect
1. Pastikan `uv` terinstall: `uv --version`
2. Cek environment variables sudah di-set
3. Restart Kiro
4. Cek MCP Server view di Kiro feature panel

### Error "uvx not found"
Install uv terlebih dahulu (lihat Prasyarat di atas)

### MySQL connection refused
1. Pastikan MySQL server running
2. Cek host, port, user, password
3. Pastikan database `simanis` exists

---

## Security Notes

⚠️ **JANGAN commit credentials ke Git!**

Environment variables yang digunakan:
- `MYSQL_PASSWORD` - Password MySQL
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `BRAVE_API_KEY` - Brave Search API Key

Simpan di:
- Windows: System Environment Variables
- Linux/macOS: `~/.bashrc` atau `~/.zshrc`
- Atau gunakan `.env` file (pastikan ada di `.gitignore`)
