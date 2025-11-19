# Quick Setup Instructions

## Prerequisites
1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **MySQL** - Download from [mysql.com](https://www.mysql.com/downloads/)

## Quick Start (Windows/Mac/Linux)

### Option 1: Automatic Setup (Recommended)
```bash
# Make setup script executable (Mac/Linux only)
chmod +x setup.sh

# Run setup script
./setup.sh

# Start the application
npm run dev
```

### Option 2: Manual Setup
1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE school_management;
   exit;
   ```

3. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your MySQL credentials

4. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Access the Application
- **URL**: http://localhost:3000
- **Admin**: admin@school.com / admin123
- **Teacher**: teacher@school.com / teacher123

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # Mac
```

### Port Issues
```bash
# Use different port
npm run dev -- -p 3001
```

### Reset Database
```bash
npm run db:push --force-reset
npm run db:seed
```

## Project Structure
```
📁 school-management-system/
├── 📁 app/                # Next.js pages & API routes
├── 📁 components/         # Reusable UI components  
├── 📁 lib/               # Utilities & configurations
├── 📁 prisma/            # Database schema & seeds
├── 📄 package.json       # Dependencies
└── 📄 README.md          # Full documentation
```

## Key Features Ready to Use
✅ User Authentication (Admin/Teacher)
✅ Student Management (CRUD operations)
✅ Teacher Management
✅ Class & Section Management
✅ Daily Attendance Tracking
✅ Interactive Dashboard with Charts
✅ Responsive Design
✅ Professional UI with ShadCN