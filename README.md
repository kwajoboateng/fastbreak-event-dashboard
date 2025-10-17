# Sports Event Management Dashboard

A full-stack sports event management application built with Next.js, Supabase, and Shadcn UI. Users can create, view, and manage sports events with venue information.

## Features

- **Authentication**: Email/password and Google OAuth sign-in
- **Event Management**: Create, read, update, and delete sports events
- **Multiple Venues**: Support for multiple venues per event
- **Search & Filter**: Search events by name and filter by sport type
- **Responsive Design**: Netflix-style grid layout that works on all devices
- **Real-time UI**: Toast notifications and loading states
- **Protected Routes**: All routes require authentication
- **Comprehensive Documentation**: Thoroughly commented codebase for easy maintenance

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **Form Handling**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd fastbreak-event-dashboard
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Set up Database

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  date timestamp with time zone not null,
  sport_type text not null,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create event_venues table
create table event_venues (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references events(id) on delete cascade,
  venue_name text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table events enable row level security;
alter table event_venues enable row level security;

-- Create RLS policies
create policy "Allow authenticated users to read events" on events
  for select using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert events" on events
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update events" on events
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete events" on events
  for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated users to read event_venues" on event_venues
  for select using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert event_venues" on event_venues
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update event_venues" on event_venues
  for update using (auth.role() = 'authenticated');

create policy "Allow authenticated users to delete event_venues" on event_venues
  for delete using (auth.role() = 'authenticated');
```

### 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google OAuth provider
3. Add your OAuth redirect URL: `http://localhost:3000/auth/callback` (for development)
4. For production, add: `https://yourdomain.com/auth/callback`

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── actions/           # Server Actions
│   │   ├── auth.ts       # Authentication actions
│   │   └── events.ts     # Event CRUD actions
│   ├── auth/             # OAuth callback and error handling
│   │   ├── auth-code-error/  # OAuth error page
│   │   └── callback/     # OAuth callback route
│   ├── dashboard/        # Dashboard pages
│   ├── events/           # Event pages
│   │   ├── [id]/        # Event details and edit
│   │   └── create/       # Create event form
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/
│   ├── dashboard/        # Dashboard components
│   │   ├── EventCard.tsx
│   │   ├── EventsGrid.tsx
│   │   └── SearchAndFilter.tsx
│   └── ui/              # Shadcn UI components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── lib/
│   ├── supabase/        # Supabase configuration
│   ├── validations/     # Zod schemas
│   ├── action-response.ts
│   ├── error-handler.ts
│   └── utils.ts
└── types/
    └── database.ts      # TypeScript types
```

## Key Features Implementation

### Server-Side Architecture
- All database operations use Server Actions
- No direct Supabase client calls from client components
- Consistent error handling with generic helpers
- Type-safe action responses

### Authentication
- Middleware protects all routes except login and OAuth callback
- Automatic redirect to login for unauthenticated users
- Google OAuth and email/password authentication
- Comprehensive OAuth error handling with user-friendly error pages

### Event Management
- Create events with multiple venues
- Search and filter functionality
- Responsive grid layout (Netflix-style)
- Form validation with React Hook Form + Zod

### UI/UX
- Shadcn UI components throughout
- Custom neutral color scheme (#7B9669, #6C8480, #E6E6E6, #BAC8B1, #404E3B)
- Toast notifications for success/error states
- Loading states and error handling
- Mobile-responsive design
- Consistent cursor styling for interactive elements

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

Don't forget to update your Supabase OAuth redirect URLs for production!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License