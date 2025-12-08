# Vocal Artist Portfolio - Project Context

## Project Overview
This is a mobile-first Progressive Web App (PWA) designed to showcase a vocal artist's performance repertoire. The site allows the artist to create, manage, and display a comprehensive list of songs they can perform, with rich metadata and organizational features.

## Core Purpose
- **Public-facing**: Display song repertoire and performance history to potential clients/bookers
- **Admin backend**: Authenticated management system for songs, performances, and metadata
- **Mobile-first**: Optimized for mobile devices with PWA capabilities for offline access
- **Installable**: Can be added to home screen as a standalone app

## Key Features

### Public Site
- Browse complete song repertoire with search/filter
- View past performances and setlists
- Filter songs by genre, holiday, mood, and other facets
- Mobile-optimized navigation and UI
- Offline-capable through service worker

### Admin Panel (Authenticated)
- CRUD operations for songs (title, artist, key, tempo, duration, notes)
- Performance tracking with venue, date, and setlist management
- Tag system for organizing songs:
  - Genres (Jazz, Pop, Rock, Classical, etc.)
  - Holidays (Christmas, Halloween, Valentine's Day, etc.)
  - Moods, tempos, eras, and custom facets
- Attach performances to songs (many-to-many relationship)
- Mobile-responsive admin interface

## Technology Stack

### Framework & Language
- **Next.js 16** (App Router with Turbopack)
- **TypeScript** for type safety
- **React 19**

### Styling
- **Tailwind CSS v4** for utility-first styling
- **shadcn/ui** components for consistent UI elements
- Mobile-first responsive design

### Database & ORM
- **PostgreSQL** for relational data
- **Prisma** ORM with full TypeScript support
- Database schema includes:
  - Songs (title, artist, key, tempo, duration, notes)
  - Tags (name, category, color)
  - Performances (venue, date, description)
  - Many-to-many relationships via join tables

### Authentication
- **NextAuth.js v5** (Auth.js) with credentials provider
- JWT session strategy
- Middleware-based route protection for `/admin/*` routes
- bcrypt for password hashing

### PWA Configuration
- **@ducanh2912/next-pwa** for service worker generation
- Web manifest for installability
- Offline caching for song repertoire
- Optimized for mobile devices

## Architecture Decisions

### Route Structure
- **(public)** route group: `/`, `/repertoire`, `/performances`
- **admin** routes: `/admin/dashboard`, `/admin/songs`, `/admin/performances`, `/admin/tags`, `/admin/login`
- Separate layout for login page to avoid authentication loops

### Database Design
- Songs have many tags (genres, holidays, moods)
- Songs appear in many performances (setlists)
- Tags are categorized for easier organization
- All timestamps tracked with createdAt/updatedAt

### Security
- Admin routes protected by middleware
- Passwords hashed with bcrypt (10 rounds)
- JWT sessions with secure secret
- HTTPS required for production PWA features

## Development Workflow
1. Database changes: Update `prisma/schema.prisma` → run `npx prisma generate`
2. Restart TypeScript server for Prisma Client IntelliSense
3. Use shadcn/ui components for consistent admin forms
4. Mobile-first development approach

## Deployment Considerations
- Requires PostgreSQL database (Neon, Supabase, Railway, or self-hosted)
- Environment variables: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`
- Build command: `npm run build`
- PWA features require HTTPS in production
- Consider CDN for static assets and images

## Future Enhancements (Potential)
- Audio samples for songs
- Album art/images for songs
- Public booking/contact form
- Analytics for repertoire views
- Export setlists to PDF
- Lyrics display (with copyright considerations)
- Video performance links
