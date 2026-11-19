-- iSense Technologies — run in the Supabase SQL editor
-- Auth-backed admin writes via Row Level Security.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'default',
  whatsapp text not null default '251111114031',
  phone text not null default '+251 11 111 4031',
  email text not null default 'info@isense-tech.com',
  address text not null default 'MK Business Center, Churchill Avenue, 7th Floor, Suites 707–71, Addis Ababa, Ethiopia',
  map_embed_url text,
  hours jsonb not null default '{"weekdays":"Mon–Fri: 8:30am – 5:00pm","saturday":"Sat: 8:30am – 12:30pm","sunday":"Sunday: Closed"}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_content (
  id text primary key,
  locale text not null default 'en',
  title jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category text not null check (category in ('dome','bullet','ptz','nvr','cctv','access','attendance','intrusion','metal','fire','hrm','other')),
  sort_order int not null default 0,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  image_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.packages (
  id text primary key,
  sector text not null check (sector in ('home','office','factory','campus')),
  name jsonb not null default '{}'::jsonb,
  min_cameras int not null default 1,
  max_cameras int not null default 99,
  description jsonb not null default '{}'::jsonb,
  sort_order int not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  tags text[] not null default '{}',
  question jsonb not null default '{}'::jsonb,
  answer jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  published boolean not null default true
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  content jsonb not null default '{}'::jsonb,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migrate legacy blog columns if an older schema exists
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blog_posts' and column_name = 'title'
      and data_type = 'text'
  ) then
    alter table public.blog_posts
      alter column title type jsonb using jsonb_build_object(coalesce(locale, 'en'), title),
      alter column excerpt type jsonb using case when excerpt is null then '{}'::jsonb else jsonb_build_object(coalesce(locale, 'en'), excerpt) end,
      alter column content type jsonb using jsonb_build_object(coalesce(locale, 'en'), content);
    alter table public.blog_posts drop column if exists locale;
    alter table public.blog_posts add column if not exists published_at timestamptz;
  end if;
exception when others then
  null;
end $$;

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('instagram', 'linkedin', 'facebook')),
  url text not null,
  title text,
  thumbnail_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.coverage_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  notes text,
  sector text not null check (sector in ('home','office','factory','campus')),
  layout jsonb not null,
  camera_count int not null default 0,
  coverage_percent numeric(5,2) not null default 0,
  language text not null default 'en',
  status text not null default 'new' check (status in ('new','contacted','closed'))
);

alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.products enable row level security;
alter table public.packages enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_posts enable row level security;
alter table public.social_posts enable row level security;
alter table public.contact_inquiries enable row level security;
alter table public.coverage_requests enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Public read policies
drop policy if exists "Public read settings" on public.site_settings;
create policy "Public read settings" on public.site_settings for select using (true);
drop policy if exists "Admins write settings" on public.site_settings;
create policy "Admins write settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read page content" on public.page_content;
create policy "Public read page content" on public.page_content for select using (true);
drop policy if exists "Admins write page content" on public.page_content;
create policy "Admins write page content" on public.page_content for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select using (published = true or public.is_admin());
drop policy if exists "Admins write products" on public.products;
create policy "Admins write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read packages" on public.packages;
create policy "Public read packages" on public.packages for select using (true);
drop policy if exists "Admins write packages" on public.packages;
create policy "Admins write packages" on public.packages for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read faqs" on public.faqs;
create policy "Public read faqs" on public.faqs for select using (published = true or public.is_admin());
drop policy if exists "Admins write faqs" on public.faqs;
create policy "Admins write faqs" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts"
  on public.blog_posts for select
  using (published = true or public.is_admin());

drop policy if exists "Admins insert posts" on public.blog_posts;
create policy "Admins insert posts" on public.blog_posts for insert with check (public.is_admin());
drop policy if exists "Admins update posts" on public.blog_posts;
create policy "Admins update posts" on public.blog_posts for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete posts" on public.blog_posts;
create policy "Admins delete posts" on public.blog_posts for delete using (public.is_admin());

drop policy if exists "Public can read social posts" on public.social_posts;
create policy "Public can read social posts" on public.social_posts for select using (true);
drop policy if exists "Admins insert social posts" on public.social_posts;
create policy "Admins insert social posts" on public.social_posts for insert with check (public.is_admin());
drop policy if exists "Admins update social posts" on public.social_posts;
create policy "Admins update social posts" on public.social_posts for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete social posts" on public.social_posts;
create policy "Admins delete social posts" on public.social_posts for delete using (public.is_admin());

drop policy if exists "Public can submit inquiries" on public.contact_inquiries;
create policy "Public can submit inquiries" on public.contact_inquiries for insert with check (true);
drop policy if exists "Admins read inquiries" on public.contact_inquiries;
create policy "Admins read inquiries" on public.contact_inquiries for select using (public.is_admin());

drop policy if exists "Public submit coverage" on public.coverage_requests;
create policy "Public submit coverage" on public.coverage_requests for insert with check (true);
drop policy if exists "Admins read coverage" on public.coverage_requests;
create policy "Admins read coverage" on public.coverage_requests for select using (public.is_admin());
drop policy if exists "Admins update coverage" on public.coverage_requests;
create policy "Admins update coverage" on public.coverage_requests for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read profiles" on public.profiles;
create policy "Admins read profiles"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images"
  on storage.objects for select
  using (bucket_id = 'blog-images');

drop policy if exists "Admins upload blog images" on storage.objects;
create policy "Admins upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins update blog images" on storage.objects;
create policy "Admins update blog images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins delete blog images" on storage.objects;
create policy "Admins delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and public.is_admin());

-- Seed defaults (safe upserts)
insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

insert into public.packages (id, sector, name, min_cameras, max_cameras, description, sort_order) values
  ('home-essential', 'home', '{"en":"Home Essential","am":"የቤት አስፈላጊ","ar":"المنزل الأساسي"}', 1, 4, '{"en":"Entry coverage for apartments and villas.","am":"ለአፓርታማዎች እና ቪላዎች መግቢያ ሽፋን።","ar":"تغطية المداخل للشقق والفلل."}', 1),
  ('home-plus', 'home', '{"en":"Home Plus","am":"የቤት ፕላስ","ar":"المنزل بلس"}', 5, 12, '{"en":"Perimeter plus living areas.","am":"ድንበር እና የመኖሪያ ቦታዎች።","ar":"المحيط ومناطق المعيشة."}', 2),
  ('office-core', 'office', '{"en":"Office Core","am":"የቢሮ ኮር","ar":"المكتب الأساسي"}', 2, 8, '{"en":"Reception, corridors, and server rooms.","am":"አቀባበል፣ ኮሪደሮች እና የሰርቨር ክፍሎች።","ar":"الاستقبال والممرات وغرف الخوادم."}', 1),
  ('office-campus', 'office', '{"en":"Office Campus","am":"የቢሮ ካምፓስ","ar":"حرم المكتب"}', 9, 40, '{"en":"Multi-floor office coverage with NVR.","am":"ባለብዙ ፎቅ የቢሮ ሽፋን ከNVR ጋር።","ar":"تغطية مكاتب متعددة الطوابق مع NVR."}', 2),
  ('factory-watch', 'factory', '{"en":"Factory Watch","am":"የፋብሪካ ክትትል","ar":"مراقبة المصنع"}', 4, 20, '{"en":"Production lines and loading docks.","am":"የምርት መስመሮች እና የጭነት ቦታዎች።","ar":"خطوط الإنتاج وأرصفة التحميل."}', 1),
  ('factory-secure', 'factory', '{"en":"Factory Secure","am":"የፋብሪካ ደህንነት","ar":"أمن المصنع"}', 21, 80, '{"en":"Full perimeter with PTZ overwatch.","am":"ሙሉ ድንበር ከPTZ ክትትል ጋር።","ar":"محيط كامل مع مراقبة PTZ."}', 2),
  ('campus-guard', 'campus', '{"en":"Campus Guard","am":"የካምፓስ ጥበቃ","ar":"حراسة الحرم"}', 6, 30, '{"en":"Gates, parking, and shared facilities.","am":"በሮች፣ መኪና ማቆሚያ እና የጋራ መገልገያዎች።","ar":"البوابات والمواقف والمرافق المشتركة."}', 1),
  ('campus-command', 'campus', '{"en":"Campus Command","am":"የካምፓስ ትእዛዝ","ar":"قيادة الحرم"}', 31, 120, '{"en":"Command-and-control grade coverage.","am":"የትእዛዝ እና ቁጥጥር ደረጃ ሽፋን።","ar":"تغطية بمستوى القيادة والتحكم."}', 2)
on conflict (id) do nothing;
