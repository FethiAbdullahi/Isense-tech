# iSense Technologies

Marketing site and admin panel for iSense Technologies, the security division of Ellis Trading House PLC.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, next-intl (English, Amharic, Arabic), Supabase Auth, Postgres, and Storage.

Company copy, phone numbers, address, hours, project list, and the Churchill Avenue map embed are taken from [isense-tech.com](https://www.isense-tech.com), which Ellis Trading House PLC publishes for this business.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor. It creates `blog_posts`, `social_posts`, `contact_inquiries`, and `profiles`, enables row level security so only authenticated admins can write, and creates a public `blog-images` bucket.
3. In Authentication, create an admin user. The signup trigger inserts a matching `profiles` row with role `admin`.
4. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key.
5. Optional: `META_ACCESS_TOKEN` for Instagram and Facebook oEmbed. Without it, paste a title and thumbnail when adding those posts. LinkedIn uses public oEmbed, then Open Graph.
6. Optional: `AI_GATEWAY_API_KEY` for the support chat. Without it, the widget answers from an on-site knowledge base.

```bash
npm install
npm run dev
```

Public site: `http://localhost:3000`  
Admin: `http://localhost:3000/admin`

Arabic (`/ar`) renders right to left. English is the default and is served without a locale prefix.
