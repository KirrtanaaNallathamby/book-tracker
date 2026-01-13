# Book Tracker

A mini Saas application to track your reading journey, built with Next.js, Typescript and Supabase.

## Features
- User authentication (email/password)
- Add, view, update and delete books
- Filter books by status (Reading/Completed/Wishlist)
- Search books by title or author
- Secure API with JWT verfication
- Row-level security in database
- Modern, clean UI with sidebar navigation

## Tech Stack
- Frontend : Next.js, App Router, TypeScript, Tailwind css
- Backend : Next.js API Routes
- Database : Supabase (PostgreSQL)
- Auth : Supabase Auth
- Deployment : Vercel

## Security
- JWT verification on all API routes
- Row-level security policies in Supabase
- Environment variables for secret
- User data isolation as users can only access their own books.

## Setup Instruction
### 1. Clone the repo
git clone <repo-url>
cd book-tracker

### 2. Install dependencies
npm install

### 3. Set up Supabase
1. Create a project at [supabase.com](https://supabase.cpm)
2. Go to SQL Editor and run sql code.
3. Get your API keys from Settings > API.

### 4. Configure environment variable. (.env.local)
Create .env.local in the root directory

NEXT_PUBLIC_SUPABASE_URL= <your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY = <your_supabase_anon_key>

### 5. Run development server
npm run dev
Open [http://localhost:300]

### 6. Deploy to Vercel
#### Install Vercel CLI
npm i -g vercel
# Deploy
vercel
#### Add environment variables in Vercel dashboard, then deploy it to production. 
vercel --prod
