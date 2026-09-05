# CodeMerge V2.0 — Submission Management Portal

A production-ready full-stack web application for managing CodeMerge V2.0 PPT Round 1 submissions. Built with React, Express, PostgreSQL (Supabase), and Supabase Storage.

## Architecture

```
React + Vite (Frontend)
       ↓ HTTPS
Express + TypeScript (Backend API)
       ↓
Supabase PostgreSQL  ←→  Supabase Storage (Private Bucket)
```

## Prerequisites

- **Node.js** 20+ and npm
- **Supabase** account and project

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready

### 2. Get Connection Details

From your Supabase Dashboard:

- **Dashboard → Connect → PostgreSQL** → Copy the connection string (Session/Transaction mode)
- **Dashboard → Settings → API** → Copy the **Project URL** and **service_role key** (or secret key)

### 3. Create Storage Bucket

1. Go to **Dashboard → Storage**
2. Click **New bucket**
3. Name: `codemerge-submissions`
4. **Public bucket: OFF** (must be private)
5. Allowed MIME types: `application/pdf`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`
6. File size limit: `10 MB`

### 4. Create Admin User

1. Go to **Dashboard → Authentication → Users**
2. Click **Add user → Create new user**
3. Enter admin email and password
4. This account will be used to access the admin dashboard

### 5. Configure Environment

```bash
cp .env.example server/.env
```

Edit `server/.env` with your values:

```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
SUPABASE_URL=https://[ref].supabase.co
SUPABASE_SECRET_KEY=eyJ...  # service_role key from API settings
SUPABASE_STORAGE_BUCKET=codemerge-submissions
JWT_SECRET=your-random-secret-string
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

### 6. Install Dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 7. Run Database Migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 8. Seed the Database

This creates the CodeMerge V2.0 event, PPT Round 1, and sample teams.

```bash
cd server
npx prisma db seed
```

To customize teams, edit `server/prisma/seed.ts` and re-run the seed.

### 9. Start Development

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- The Vite dev server proxies `/api` requests to the backend

### 10. Test the Flow

1. Open http://localhost:5173
2. Click "Proceed to Submission"
3. Select a team, enter details, upload a PDF/PPTX, review, and submit
4. Verify: check Supabase Dashboard → Table Editor → submissions
5. Verify: check Supabase Dashboard → Storage → codemerge-submissions

## Admin Dashboard

1. Navigate to http://localhost:5173/admin/login
2. Log in with the admin credentials created in Supabase Auth
3. View submissions, search, filter, download files, export to Excel

## API Endpoints

### Public (Participant)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List eligible teams |
| POST | `/api/submissions` | Create submission (multipart) |
| GET | `/api/submissions/:submissionId` | Get submission confirmation |

### Admin (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Admin login |
| POST | `/api/admin/auth/logout` | Admin logout |
| GET | `/api/admin/auth/me` | Current admin info |
| GET | `/api/admin/submissions` | List submissions (paginated) |
| GET | `/api/admin/submissions/:id` | Submission detail |
| GET | `/api/admin/submissions/:id/download` | Get signed download URL |
| PATCH | `/api/admin/submissions/:id/status` | Update submission status |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/export` | Export Excel |

## Production Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ to Vercel
```

Set environment variable in Vercel:
- `VITE_API_URL` = your backend URL (e.g., `https://api.yourdomain.com`)

### Backend (Render/Railway)
- Build command: `cd server && npm install && npx prisma generate && npm run build`
- Start command: `cd server && npx prisma migrate deploy && node dist/index.js`
- Set all environment variables from `.env`
- Ensure `FRONTEND_URL` matches your Vercel deployment URL

### CORS
The backend CORS is configured to allow requests only from `FRONTEND_URL`. Update this for production.

## Security

- All Supabase credentials are server-side only
- Storage bucket is private (signed URLs for downloads)
- Admin routes require Supabase Auth token
- Rate limiting on submission and login endpoints
- File validation: extension, MIME type, size, and magic bytes
- Input validation with Zod on both frontend and backend
- Helmet for secure HTTP headers
- No secrets committed to Git

## Managing Teams

Edit the `teamNames` array in `server/prisma/seed.ts` and re-run:
```bash
cd server
npx prisma db seed
```

Or directly add teams via Supabase Dashboard → Table Editor → teams.

## License

Private — CodeMerge V2.0
