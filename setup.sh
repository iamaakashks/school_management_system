#!/bin/bash

echo "🚀 Setting up School Student Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not detected. Please ensure MySQL is installed and running."
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️  Setting up database..."
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "✅ Setup completed successfully!"
echo ""
echo "🔑 Demo Credentials:"
echo "Admin: admin@school.com / admin123"
echo "Teacher: teacher@school.com / teacher123"
echo ""
echo "🚀 To start the development server, run:"
echo "npm run dev"
echo ""
echo "📖 Then visit: http://localhost:3000"