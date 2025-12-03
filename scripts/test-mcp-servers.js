#!/usr/bin/env node

/**
 * Script untuk test MCP servers yang tersedia di SIMANIS
 * Usage: node scripts/test-mcp-servers.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Testing SIMANIS MCP Servers Configuration\n')

// Read MCP config
const mcpConfigPath = path.join(__dirname, '../.kiro/settings/mcp.json')

if (!fs.existsSync(mcpConfigPath)) {
  console.error('❌ mcp.json not found at:', mcpConfigPath)
  console.log('💡 Please copy mcp.json.example to mcp.json and configure it.')
  process.exit(1)
}

const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'))

console.log('📋 MCP Servers Configuration:\n')

const servers = mcpConfig.mcpServers
const enabledServers = []
const disabledServers = []

for (const [name, config] of Object.entries(servers)) {
  const status = config.disabled ? '🔴 DISABLED' : '🟢 ENABLED'
  const autoApprove =
    config.autoApprove?.length > 0
      ? `(${config.autoApprove.length} auto-approved actions)`
      : '(manual approval required)'

  console.log(`${status} ${name}`)
  console.log(`   Command: ${config.command} ${config.args?.join(' ') || ''}`)
  console.log(`   Auto-approve: ${autoApprove}`)

  if (config.env) {
    const envVars = Object.keys(config.env).map((key) => {
      const value = config.env[key]
      // Check if env var is set
      const isSet = value && !value.includes('${')
      return `${key}: ${isSet ? '✅ Set' : '❌ Not set'}`
    })
    console.log(`   Environment: ${envVars.join(', ')}`)
  }

  console.log('')

  if (!config.disabled) {
    enabledServers.push(name)
  } else {
    disabledServers.push(name)
  }
}

console.log('\n📊 Summary:')
console.log(`   Total servers: ${Object.keys(servers).length}`)
console.log(
  `   Enabled: ${enabledServers.length} (${enabledServers.join(', ')})`
)
console.log(
  `   Disabled: ${disabledServers.length} (${disabledServers.join(', ')})`
)

console.log('\n💡 MCP Servers Usage Guide:')
console.log('')

if (enabledServers.includes('memory')) {
  console.log('🧠 Memory MCP:')
  console.log('   - Simpan context: "Save to memory: [decision/finding]"')
  console.log('   - Cari context: "Search memory for: [keyword]"')
  console.log('')
}

if (enabledServers.includes('github')) {
  console.log('🐙 GitHub MCP:')
  console.log('   - List issues: "Show me open issues"')
  console.log('   - Create PR: "Create pull request for feature X"')
  console.log('   - List commits: "Show recent commits"')
  console.log('')
}

if (enabledServers.includes('mysql')) {
  console.log('🗄️ MySQL MCP:')
  console.log('   - List tables: "Show all database tables"')
  console.log('   - Describe table: "Describe assets table"')
  console.log('   - Query data: "Query assets where kondisi = Baik"')
  console.log('')
}

if (enabledServers.includes('context7')) {
  console.log('📚 Context7 MCP:')
  console.log('   - Get docs: "Show me React 19 documentation"')
  console.log('   - Get docs: "Find Fastify best practices"')
  console.log('')
}

if (enabledServers.includes('sequential-thinking')) {
  console.log('🤔 Sequential Thinking MCP:')
  console.log('   - Complex planning: "Plan migration to monorepo"')
  console.log('   - Deep analysis: "Analyze architecture issues"')
  console.log('')
}

if (enabledServers.includes('playwright')) {
  console.log('🎭 Playwright MCP:')
  console.log('   - Browser automation: "Test login flow"')
  console.log('   - E2E testing: "Run end-to-end tests"')
  console.log('')
}

console.log('\n✅ MCP Configuration test complete!')
console.log('📝 Note: This only tests configuration, not actual connectivity.')
console.log('💡 To test connectivity, try using MCP commands in your AI tool.')
