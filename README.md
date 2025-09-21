name: Manvith MP
contact: 6361964176
email: manvithmp13@gmail.com

deployed link:https://project-management-three-gilt.vercel.app

wait for 50 seconds for the server to load. 

credentials
admin:
email:manvithmp@example.com
pass:man123

manager:
email:manager@example.com
pass:manager123

developer:
email:catt@example.com
pass:catt123

developer:
email:dogg@example.com
pass:dogg123

# 🚀 AI-Powered Project Management Tool

A comprehensive project management application with AI-powered user story generation, built with React, Node.js, Express, and MySQL.

## ✨ Features

- **User Authentication & Authorization** (JWT-based)
- **Role-based Access Control** (Admin, Manager, Developer)
- **Project Management** (CRUD operations)
- **Task Management** with Kanban board
- **AI User Story Generation** using GROQ API
- **Real-time Statistics & Analytics**
- **Responsive UI** with modern design

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **TanStack Query v5** for data fetching
- **React Router** for navigation
- **React Hook Form** for form handling
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MySQL** database (Aiven Cloud)
- **JWT** for authentication
- **GROQ SDK** for AI integration
- **Bcrypt** for password hashing
- **Helmet** for security

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- GROQ API key

### 1. Clone the Repository
cd server

Install dependencies
npm install

Create .env file
cp .env.example .env

Update .env with your credentials:
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=project_management
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173

Setup database
node setup-aiven-database.js

Start development server
npm run dev

### 3. Frontend Setup
cd client

Install dependencies
npm install

Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

Start development server
npm run dev



## 📚 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/stats/overview` - Get project statistics

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/overview` - Get task statistics

### Users (Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### AI User Stories (Manager/Admin only)
- `POST /api/ai/generate-user-stories` - Generate user stories
- `GET /api/ai/user-stories/:projectId` - Get project user stories

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention

## 🎯 Key Assumptions

1. **Database**: MySQL is used for data persistence
2. **AI Integration**: GROQ API is used for user story generation
3. **Authentication**: JWT tokens with 24-hour expiration
4. **File Storage**: No file upload functionality implemented
5. **Real-time Updates**: Not implemented (uses polling)
6. **Email Notifications**: Not implemented
7. **Multi-tenancy**: Single organization support

## 🚧 Possible Improvements

### Technical Enhancements
1. **Real-time Updates** - Implement WebSocket for live updates
2. **File Upload** - Add file attachment support for projects/tasks
3. **Email Notifications** - Send email alerts for task assignments
4. **Advanced Search** - Full-text search across projects and tasks
5. **Data Export** - Export projects/tasks to PDF/Excel
6. **API Rate Limiting** - More granular rate limiting per user
7. **Caching** - Implement Redis for better performance
8. **Database Migrations** - Automated schema migrations
9. **API Documentation** - Auto-generated Swagger docs
10. **Unit Testing** - Comprehensive test coverage

### Feature Enhancements
1. **Time Tracking** - Track time spent on tasks
2. **Comments System** - Add comments to tasks/projects
3. **Gantt Charts** - Visual project timeline
4. **Calendar Integration** - Sync with Google Calendar
5. **Mobile App** - React Native mobile application
6. **Advanced Analytics** - Detailed reporting and insights
7. **Custom Fields** - User-defined fields for projects/tasks
8. **Template System** - Project and task templates
9. **Integration APIs** - Connect with Slack, Jira, GitHub
10. **Multi-language Support** - Internationalization (i18n)

### UI/UX Improvements
1. **Dark Mode** - Theme switching capability
2. **Drag & Drop** - Enhanced Kanban board interactions
3. **Advanced Filters** - More filtering options
4. **Bulk Operations** - Select and edit multiple items
5. **Keyboard Shortcuts** - Power user functionality
6. **Progressive Web App** - PWA support for offline use
7. **Accessibility** - WCAG compliance improvements
8. **Custom Themes** - User-customizable color schemes

### Infrastructure & DevOps
1. **Docker Support** - Containerization for easy deployment
2. **CI/CD Pipeline** - Automated testing and deployment
3. **Monitoring** - Application performance monitoring
4. **Backup Strategy** - Automated database backups
5. **Load Balancing** - Horizontal scaling capability
6. **Environment Management** - Better env configuration
7. **Logging** - Structured logging with log aggregation
8. **Security Scanning** - Automated vulnerability assessments

## 📝 Development Scripts

### Backend
npm run dev # Start development server
npm run start # Start production server
npm run test # Run tests
npm run lint # Run ESLint


### Frontend
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build
npm run lint # Run ESLint
