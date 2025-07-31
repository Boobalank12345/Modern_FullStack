# Birthday Reminder Tracker Application

A comprehensive birthday tracking and reminder system built with Next.js, MongoDB, and pure CSS (no Tailwind dependencies).

## 🎯 Project Overview

This application allows users to track birthdays, set reminders, and manage birthday-related information with separate interfaces for administrators and regular users.

## 👥 User Types

### Admin Users
- Full access to all features
- Can manage all birthday entries
- Access to analytics and dashboard
- User management capabilities

### Regular Users
- Can view birthday listings
- Access to detailed birthday information
- Profile management
- Terms and conditions access

## 🛣️ Route Structure

### Admin Routes
- `/login` - Admin authentication
- `/add-birthday` - Add birthday entries for users
- `/dashboard` - Main admin dashboard with MENU implementation
  - Edit birthdays
  - Manage birthdays
  - View analytics
  - Send reminders
- `/profile` - Admin profile management

### User Routes
- `/birthday-list` - View all added birthdays
- `/:id` - Detailed view of specific birthday entry
- `/terms-and-conditions` - Static legal content
- `/userLogin` - User authentication/login page
- `/userProfile` - User profile and birthday reminder settings

## 📁 Project Structure

```
birthday-reminder-tracker/
├── 📁 API/                    # All API calls organized by feature
│   ├── authAPI.js            # Authentication API calls
│   ├── birthdayAPI.js        # Birthday-related API calls
│   ├── userAPI.js            # User management API calls
│   └── index.js              # API utilities and exports
├── 📁 components/            # All React components
│   ├── Analytics.js          # Analytics dashboard component
│   ├── BirthdayCard.js       # Birthday display card
│   ├── BirthdayForm.js       # Birthday creation/edit form
│   ├── ConfirmDialog.js      # Confirmation dialog component
│   ├── Dashboard.js          # Main dashboard component
│   ├── ErrorMessage.js       # Error display component
│   ├── Header.js             # Navigation header
│   ├── Layout.js             # Main layout wrapper
│   ├── LoadingSpinner.js     # Loading indicator
│   ├── LoginForm.js          # Reusable login form
│   └── SearchFilter.js       # Search and filter component
├── 📁 lib/                   # Database and utilities
│   └── mongodb.js            # MongoDB connection
├── 📁 models/                # Database schemas
│   ├── Birthday.js           # Birthday model with auto-generated IDs
│   └── User.js               # User model with auto-generated IDs
├── 📁 pages/                 # Next.js pages
│   ├── 📁 api/               # API routes
│   │   ├── 📁 auth/          # Authentication endpoints
│   │   ├── 📁 birthdays/     # Birthday CRUD endpoints
│   │   └── 📁 users/         # User management endpoints
│   ├── add-birthday.js       # Add birthday page
│   ├── birthday-list.js      # Birthday listing page
│   ├── dashboard.js          # Admin dashboard page
│   ├── index.js              # Landing page
│   ├── login.js              # Admin login page
│   ├── profile.js            # Admin profile page
│   ├── terms-and-conditions.js # Terms page
│   ├── userLogin.js          # User login page
│   ├── userProfile.js        # User profile page
│   ├── [id].js               # Dynamic birthday detail page
│   └── _app.js               # App wrapper with authentication
├── 📁 styles/                # Styling
│   └── globals.css           # Pure CSS (no Tailwind)
├── 📁 utils/                 # Utility functions
│   ├── auth.js               # Server-side auth utilities
│   └── clientAuth.js         # Client-side auth helpers
├── .env.local                # Environment variables
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "c:\Users\Aravinendh R\Downloads\birthday-reminder-tracker"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create/update `.env.local` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/birthday-tracker
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/birthday-tracker
   
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Main app: `http://localhost:3000`
   - Admin login: `http://localhost:3000/login`
   - User login: `http://localhost:3000/userLogin`

## 🎨 Styling

This project uses **pure CSS** without any CSS framework dependencies:
- No Tailwind CSS
- No Bootstrap
- Custom CSS utility classes
- Responsive design
- Clean, modern UI

## 🔧 Key Features

### ✅ Authentication System
- Separate admin and user authentication
- JWT token-based security
- Role-based access control
- Secure password handling

### ✅ Birthday Management
- Full CRUD operations
- Auto-generated IDs for all entries
- Relationship categorization
- Gift idea storage
- Reminder settings

### ✅ Dashboard & Analytics
- Admin dashboard with comprehensive overview
- Birthday statistics and insights
- Upcoming birthday notifications
- User activity tracking

### ✅ Performance Optimizations
- Efficient API calls organized in separate folder
- Debounced search functionality
- Lazy loading components
- Optimized database queries
- Client-side caching

### ✅ User Experience
- Responsive design for all devices
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Search and filter capabilities
- Clean, intuitive interface

## 📊 Database Schema

### User Model
- Auto-generated `_id`
- Name, email, password
- Role (admin/user)
- Profile settings
- Timestamps

### Birthday Model
- Auto-generated `_id`
- Person details (name, date of birth, relationship)
- Contact information (email, phone)
- Gift ideas array
- Reminder settings
- User association
- Timestamps

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected API routes
- Role-based access control
- CORS configuration

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/userLogin` - User login/registration

### Birthdays
- `GET /api/birthdays` - Get all birthdays (with filters)
- `POST /api/birthdays/create` - Create new birthday
- `GET /api/birthdays/[id]` - Get specific birthday
- `PUT /api/birthdays/[id]` - Update birthday
- `DELETE /api/birthdays/[id]` - Delete birthday

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Heroku
- AWS
- DigitalOcean

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## 🤝 Contributing

1. Follow the established folder structure
2. Use the API folder for all external API calls
3. Keep components in the components folder
4. Maintain consistent CSS class naming
5. Ensure responsive design
6. Add proper error handling

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ using Next.js, MongoDB, and Pure CSS**