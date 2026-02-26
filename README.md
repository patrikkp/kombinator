# KOMBINATOR

Garant warranty tracker with Rokko visual style (black-red theme + particles background).

## Features
- 📱 Receipt tracking with warranty expiration
- 🎨 Modern black-red UI with particles background
- 🔐 Supabase authentication
- 📸 Image upload to Supabase Storage
- 🎭 Framer Motion animations
- 📊 QR code sharing
- 📥 PDF/Image download
- 🌍 Multi-language support (HR, EN, SR, DE, SI)
- 🔔 In-app notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Supabase credentials to `.env`

4. Run development server:
```bash
npm run dev
```

## Supabase Schema

### Tables

```sql
-- receipts table
create table receipts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  product_name text not null,
  category text not null,
  warranty_expiration_date date not null,
  image_path text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table receipts enable row level security;

-- RLS Policies
create policy "Users can view own receipts"
  on receipts for select
  using (auth.uid() = user_id);

create policy "Users can insert own receipts"
  on receipts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own receipts"
  on receipts for delete
  using (auth.uid() = user_id);
```

### Storage

Create a `receipts` bucket with public access for authenticated users.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- shadcn/ui components
- React Router
- QRCode.js