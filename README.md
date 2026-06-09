# TalentForge - AI Interview Preparation Platform

TalentForge is a production-ready, full-stack AI-powered career and technical interview preparation platform. It helps students and job seekers prepare for technical roles through AI-generated questions, real-time verbal response transcription, resume ATS optimization analysis, DSA practice logs, and custom evaluations.

---

## Technical Stack

### Frontend
- **Framework**: React.js (Vite compiler)
- **Styling**: Tailwind CSS & Vanilla CSS variable grids
- **Animations**: Framer Motion
- **Visual Analytics**: Recharts
- **Icons**: Lucide React
- **Authentication**: React Context API & Google OAuth Client implicit flow integration
- **Networking**: Axios base client (configured with request header token injectors)

### Backend
- **Server**: Node.js & Express.js (MVC Architecture)
- **Database**: MongoDB & Mongoose schemas
- **AI Integrations**: OpenAI API (with JSON-mode instructions)
- **OAuth**: Google OAuth Library token validations
- **Media storage**: Multer & Cloudinary stream integrations
- **Mailing**: Nodemailer SMTP alerts
- **Security**: Helmet, Express Validator schemas, BCrypt hashing, and IP Rate Limiter

---

## Directory Folder Structure

```
├── backend/
│   ├── config/             # DB, Cloudinary, and OpenAI configurations
│   ├── controllers/        # Express API request controllers (MVC)
│   ├── middleware/         # Auth verification, rate limiting, and uploads
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routing paths
│   ├── services/           # OpenAI prompt helpers and Nodemailer dispatches
│   ├── .env.example        # Reference environment keys
│   ├── package.json        # Dependencies definitions
│   └── server.js           # Server startup script
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout cards, sidebars, and navbars
│   │   ├── context/        # Session Auth and Theme context controllers
│   │   ├── pages/          # Dashboard, Mocks, Resumes, and DSA views
│   │   ├── utils/          # Axios HTTP clients and formatters
│   │   ├── App.jsx         # Router switchboard
│   │   ├── index.css       # Core styling & Tailwind v4 theme variables
│   │   └── main.jsx        # App DOM mounter
│   ├── tailwind.config.js  # Content scanner configuration
│   ├── postcss.config.js   # Autoprefixer mapping
│   ├── package.json        # Client dependencies definitions
│   └── .env                # Client-side endpoints configuration
```

---

## Local Setup & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MongoDB** instance (local or Atlas cluster)

### 1. Configure Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your keys:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signing_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_nodemailer_smtp_email
   EMAIL_PASS=your_nodemailer_smtp_password
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 2. Configure Frontend
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure frontend endpoints inside `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## Core REST API Endpoints

### Authentication
- `POST /api/auth/register` - Register standard credentials
- `POST /api/auth/login` - Sign in standard credentials
- `POST /api/auth/google` - Validate Google Client OAuth credentials
- `GET /api/auth/profile` - Fetch current active session profile details
- `PUT /api/auth/profile` - Update user parameters or profile picture

### Resume Analysis
- `POST /api/resumes/upload` - Upload PDF resume for AI parsing and ATS scoring
- `GET /api/resumes/history` - Retrieve resume history list
- `GET /api/resumes/:id` - Fetch details of a single scan analysis report

### Mock Interviews
- `POST /api/interviews/generate` - Seed custom questions based on role filters
- `POST /api/interviews/sessions/:id/submit-answer` - Submit written/verbal transcription answer
- `POST /api/interviews/sessions/:id/evaluate` - Finalize mock run and invoke OpenAI grader reports
- `GET /api/interviews/sessions` - List completed mock sessions list
- `GET /api/interviews/sessions/:id` - Load specific feedback breakdown reports

### DSA Progress
- `GET /api/dsa/progress` - Fetch completed problem checklists
- `POST /api/dsa/progress` - Toggle completion status of a coding problem template

### Daily Challenges & Leaderboard
- `GET /api/challenges/daily` - Retrieve active daily challenge items
- `POST /api/challenges/submit` - Validate submission answers and log points
- `GET /api/leaderboard` - Fetch sorted global points list

### Admin Controls
- `GET /api/admin/users` - Fetch registered users table list
- `GET /api/admin/analytics` - Fetch platform total metrics (resumes scanned, mock frequencies)
- `POST /api/admin/broadcast` - Dispatch push notifications to all users
- `POST /api/admin/challenges` - Create custom daily challenges
