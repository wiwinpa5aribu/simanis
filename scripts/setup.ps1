# SIMANIS Setup Script (Windows PowerShell)
# Jalankan: .\scripts\setup.ps1

Write-Host "🚀 Setting up SIMANIS..." -ForegroundColor Cyan

# Check Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js $(node -v)" -ForegroundColor Green

# Install frontend dependencies
Write-Host "`n📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

# Setup backend .env
if (!(Test-Path .env)) {
    Write-Host "`n📝 Creating backend .env from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please update backend/.env with your database credentials" -ForegroundColor Yellow
}

# Run database migrations
Write-Host "`n🗄️  Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate

# Seed database
Write-Host "`n🌱 Seeding database..." -ForegroundColor Yellow
npm run prisma:seed

Set-Location ..

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nTo start development:" -ForegroundColor Cyan
Write-Host "  Frontend: npm run dev" -ForegroundColor White
Write-Host "  Backend:  cd backend && npm run dev" -ForegroundColor White
