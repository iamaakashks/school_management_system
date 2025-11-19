# School Student Management System (SSMS)

A simple, clean School Student Management System built with Next.js, TypeScript, MySQL, and Prisma ORM.

## 🚀 Features

### Core Modules
- **Authentication & Roles**: Admin and Teacher login with role-based access
- **Student Management**: Create, edit, delete, and view students with detailed profiles
- **Teacher Management**: Manage teacher records and assignments
- **Class Management**: Organize students into classes and sections
- **Attendance System**: Daily attendance marking with status tracking
- **Dashboard**: Basic statistics and overview

### Technical Features
- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, MySQL, Prisma ORM
- **Professional UI**: Tailwind CSS + ShadCN UI components
- **Authentication**: NextAuth.js with JWT sessions
- **Security**: Password hashing, input validation, protected routes
- **Responsive Design**: Mobile-friendly interface
- **Clean Interface**: Simple and intuitive user experience

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MySQL database
- Git

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd school-student-management-system
npm install
```

### Step 2: Database Setup
1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE school_management;
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` file**:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/school_management"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   NODE_ENV="development"
   ```

### Step 3: Database Migration & Seeding
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 4: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 👤 Demo Credentials

### Admin Access
- **Email**: admin@school.com
- **Password**: admin123

### Teacher Access
- **Email**: teacher@school.com
- **Password**: teacher123

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── charts/           # Chart components
├── lib/                   # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication config
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts          # Sample data seeder
├── hooks/                # Custom React hooks
└── public/              # Static assets
```

## 🗄️ Database Schema

### Core Tables
- **Users**: Authentication and user roles
- **Teachers**: Teacher profiles and details
- **Students**: Student records and information
- **Classes**: Class organization
- **Sections**: Class subdivisions (A, B, C)
- **Subjects**: Subject assignments
- **Attendance**: Daily attendance tracking

### Relationships
- One-to-One: User ↔ Teacher
- One-to-Many: Class → Students, Teacher → Subjects
- Many-to-One: Student → Class, Student → Section

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio (database GUI)
npm run lint         # Run ESLint
```

## 📊 Key Modules

### 1. Dashboard
- Student/Teacher count statistics
- Daily attendance overview
- Interactive charts and graphs
- Quick navigation to all modules

### 2. Student Management
- Add/Edit student profiles
- Advanced search and filtering
- Class and section assignment
- Academic information tracking

### 3. Teacher Management
- Teacher profile creation
- Subject assignments
- Class teacher assignments
- Contact information management

### 4. Attendance System
- Daily attendance marking
- Bulk attendance operations
- Attendance history viewing
- Status tracking (Present/Absent/Late/Excused)

### 5. Class Management
- Create and organize classes
- Section management
- Teacher assignments
- Student enrollment tracking

## 🔐 Security Features

- **Authentication**: Secure login with NextAuth.js
- **Authorization**: Role-based access control (Admin/Teacher)
- **Password Security**: bcrypt hashing
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **Protected Routes**: Middleware-based route protection

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile and desktop optimized
- **Loading States**: Skeleton screens and loading indicators
- **Toast Notifications**: Success/error feedback
- **Form Validation**: Real-time input validation
- **Consistent Theme**: Professional color scheme and typography

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-secret-for-production"
NODE_ENV="production"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify MySQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. **Prisma Issues**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Port Already in Use**:
   ```bash
   npm run dev -- -p 3001
   ```

4. **Clear Next.js Cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**