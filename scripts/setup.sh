#!/bin/bash
# SIMANIS Setup Script (Linux/macOS)
# Jalankan: chmod +x scripts/setup.sh && ./scripts/setup.sh

set -e

echo "🚀 Setting up SIMANIS..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

echo "✅ Node.js $(node -v)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Setup backend .env
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating backend .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your database credentials"
fi

# Run database migrations
echo ""
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Seed database
echo ""
echo "🌱 Seeding database..."
npm run prisma:seed

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  Frontend: npm run dev"
echo "  Backend:  cd backend && npm run dev"
