# FreelanceHub

A full-stack freelancing platform connecting employers with freelancers. Built with Node.js, Express.js, React, and SQLite.

## Tech Stack

- **Backend**: Node.js, Express.js, Sequelize (ORM), SQLite
- **Frontend**: React (Vite), React Router v6, Axios
- **Authentication**: JWT (access + refresh tokens), bcrypt password hashing
- **Logging**: Morgan (HTTP), Winston (application with file rotation)
- **Validation**: express-validator
- **File Upload**: Multer (resumes/CVs)
- **Rate Limiting**: express-rate-limit
- **Styling**: Custom CSS with Playfair Display + Plus Jakarta Sans

## Features

### Authentication & Authorization
- JWT-based authentication with access + refresh token rotation
- Role-based access control (Employer, Freelancer, Admin)

### Employers
- Post and manage job listings
- View applications from freelancers with cover letters and resumes
- Accept applications to create contracts
- Manage active contracts (complete/terminate)
- Real-time notifications when freelancers apply

### Freelancers
- Browse and search job listings with filters
- Apply for jobs with name, resume/CV upload, and cover letter
- Track application status (pending, accepted, rejected)
- View active contracts
- Receive notifications when applications are accepted

### Admin
- Dashboard with site-wide statistics
- Manage users (view/delete)
- Manage jobs (view/update status)
- Manage categories (CRUD)

### Notifications (In-App)
- Bell icon in navbar with unread count badge
- Dropdown showing recent notifications
- Mark individual or all notifications as read
- Auto-polling every 30 seconds for new notifications
- Notifications for: new application (employer), application accepted (freelancer)

### Extra Features
- 3-tier RBAC (admin, employer, freelancer)
- Refresh token rotation for security
- File upload support for resumes (PDF, DOC, DOCX)
- Input validation & sanitization on every endpoint
- Rate limiting (1000 req/15min in dev, 100 in production)
- Pagination, filtering, and search on job listings
- Winston structured logging with daily file rotation
- Staggered fade-in animations on frontend
- Active nav link highlighting

## Setup & Installation

### Prerequisites
- Node.js (v16+)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/freelancehub.git
cd freelance-platform
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
npm install
```

### 3. Database Setup
SQLite is used — no separate database server needed. The database file is created automatically.
To initialize the schema, run the DDL script:
```bash
sqlite3 database.sqlite < database/ddl.sql
```

Optionally seed with sample data:
```bash
npm run seed
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Environment Variables (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| NODE_ENV | Environment mode | development |
| DATABASE_PATH | SQLite database file path | ./database.sqlite |
| JWT_SECRET | JWT signing secret | (auto-generated) |
| JWT_EXPIRES_IN | Access token expiry | 15m |
| JWT_REFRESH_SECRET | Refresh token secret | (auto-generated) |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry | 7d |
| CORS_ORIGIN | Allowed frontend origin | http://localhost:3000 |
| UPLOAD_DIR | File upload directory | uploads |

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | - |
| POST | /api/auth/login | Login | - |
| POST | /api/auth/refresh | Refresh tokens | - |
| GET | /api/auth/me | Get current user | ✓ |

### Jobs
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/jobs | List open jobs | - | - |
| GET | /api/jobs/:id | Get job details | - | - |
| POST | /api/jobs | Create job | ✓ | employer |
| PUT | /api/jobs/:id | Update job | ✓ | employer |
| DELETE | /api/jobs/:id | Delete job | ✓ | employer |
| GET | /api/jobs/my | Get my jobs | ✓ | employer |

### Applications
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | /api/applications/jobs/:jobId | Apply for job | ✓ | freelancer |
| GET | /api/applications/my | My applications | ✓ | freelancer |
| GET | /api/applications/jobs/:jobId | Job applications | ✓ | employer |
| PATCH | /api/applications/:id/accept | Accept application | ✓ | employer |

### Contracts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/contracts | List my contracts | ✓ |
| GET | /api/contracts/:id | Get contract details | ✓ |
| PATCH | /api/contracts/:id/status | Update contract status | ✓ |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/reviews/contracts/:contractId | Create review | ✓ |
| GET | /api/reviews/users/:userId | Get user reviews | - |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/users/:id | Get user profile | - |
| PUT | /api/users/profile | Update profile | ✓ |

### Categories
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/categories | List categories | - | - |
| POST | /api/categories | Create category | ✓ | admin |
| DELETE | /api/categories/:id | Delete category | ✓ | admin |

### Notifications
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/notifications | Get my notifications | ✓ |
| GET | /api/notifications/unread-count | Get unread count | ✓ |
| PATCH | /api/notifications/:id/read | Mark as read | ✓ |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/admin/stats | Dashboard stats | ✓ |
| GET | /api/admin/users | List all users | ✓ |
| DELETE | /api/admin/users/:id | Delete user | ✓ |
| GET | /api/admin/jobs | List all jobs | ✓ |
| PATCH | /api/admin/jobs/:id/status | Update job status | ✓ |

## Database Schema

The DDL script is located at `backend/database/ddl.sql`.

### Tables
- **users** — User accounts (employer, freelancer, admin)
- **categories** — Job categories (Web Dev, Mobile, Design, etc.)
- **jobs** — Job listings with budget range and status
- **applications** — Freelancer applications with name, resume URL, cover letter
- **contracts** — Contracts between employers and freelancers
- **reviews** — Ratings and reviews for completed contracts
- **notifications** — In-app notifications with read status

### Entity Relationships
- User has many Jobs (as employer)
- User has many Applications (as freelancer)
- Job has many Applications
- Job has one Contract
- Application has one Contract
- Contract has many Reviews

## Project Structure

```
freelance-platform/
├── backend/
│   ├── database/
│   │   └── ddl.sql              # Schema + seed data
│   ├── src/
│   │   ├── app.js               # Express entry point
│   │   ├── config/
│   │   │   ├── db.js            # Sequelize connection
│   │   │   └── env.js           # Environment config
│   │   ├── models/              # Sequelize models
│   │   ├── controllers/         # Route handlers
│   │   ├── routes/              # Express routes
│   │   ├── middleware/          # Auth, validation, upload
│   │   └── utils/              # Logger, JWT, hash
│   ├── seed.js                  # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx             # React entry point
│   │   ├── App.jsx              # Routes
│   │   ├── index.css            # Styling
│   │   ├── components/          # Navbar, Layout, ProtectedRoute
│   │   ├── context/             # AuthContext
│   │   ├── services/            # API service (Axios)
│   │   └── pages/               # Page components
│   └── package.json
├── .gitignore
└── README.md
```
