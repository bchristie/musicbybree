# Vocal Artist Portfolio Setup

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vocal_portfolio?schema=public"
AUTH_SECRET="your-secret-key-change-this-in-production"
AUTH_URL="http://localhost:3000"
```

**Note:** Generate a secure `AUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### 3. Set Up Database
Run Prisma migrations to create tables:
```bash
npm run db:push
```

Or for production-ready migrations:
```bash
npm run db:migrate
```

### 4. Create Admin User
Run the seed script to create an admin account:
```bash
npm run db:seed
```

Default credentials:
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Important:** Change these credentials after first login!

### 5. Run Development Server
```bash
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Create and run migrations (prod)
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Create admin user

## Project Structure

```
app/
├── (public)/          # Public-facing routes
│   ├── page.tsx       # Homepage
│   ├── repertoire/    # Song listings
│   └── performances/  # Performance history
├── admin/             # Protected admin routes
│   ├── dashboard/     # Admin overview
│   ├── songs/         # Manage songs
│   ├── performances/  # Manage performances
│   ├── tags/          # Manage genres/facets
│   └── login/         # Admin login
└── api/
    └── auth/          # NextAuth endpoints

prisma/
└── schema.prisma      # Database schema

lib/
└── prisma.ts          # Prisma client singleton
```

## Features

### Public Site
- Mobile-first responsive design
- PWA installable (when deployed with HTTPS)
- Browse song repertoire
- View performance history
- Filter by genre, holiday, etc.

### Admin Panel
- Secure authentication
- CRUD operations for songs
- Performance tracking with setlists
- Tag management (genres, holidays, moods)
- Mobile-responsive admin interface

## Database Schema

- **Songs**: Title, artist, key, tempo, duration, notes
- **Tags**: Name, category (genre/holiday/mood), color
- **Performances**: Venue, date, description, notes
- **Relationships**: Many-to-many between songs/tags and songs/performances

## PWA Configuration

The app is configured as a Progressive Web App:
- Service worker for offline caching
- Web manifest for installability
- Optimized for mobile devices
- Add to home screen support

**Note:** PWA features require HTTPS in production.

## Production Deployment

1. Set secure environment variables
2. Run database migrations: `npm run db:migrate`
3. Build the app: `npm run build`
4. Deploy to your hosting platform (Vercel, Railway, etc.)

### Recommended Hosting
- **App**: Vercel (optimized for Next.js)
- **Database**: Neon, Supabase, or Railway (PostgreSQL)

## Security Notes

- Admin routes protected by middleware
- Passwords hashed with bcrypt
- JWT session strategy
- Change default admin credentials immediately
- Use strong `AUTH_SECRET` in production
- Enable HTTPS in production

## TypeScript

Prisma Client is fully typed. After modifying the schema:
```bash
npx prisma generate
```

Then restart the TypeScript server in VS Code:
`Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"
