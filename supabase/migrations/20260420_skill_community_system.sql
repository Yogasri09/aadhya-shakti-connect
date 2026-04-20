-- Skill-based community data model + engagement APIs foundation

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  name text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(skill_id, name)
);

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique(community_id, user_id)
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  media_url text,
  media_type text,
  post_type text not null default 'update',
  event_date timestamptz,
  event_location text,
  is_news boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

create table if not exists public.community_saved_posts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(post_id, user_id)
);

create table if not exists public.community_shares (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_posts_skill_created on public.community_posts(skill_id, created_at desc);
create index if not exists idx_community_events_skill_starts on public.community_events(skill_id, starts_at desc);
create index if not exists idx_community_comments_post_created on public.community_comments(post_id, created_at asc);

alter table public.skills enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_events enable row level security;
alter table public.community_comments enable row level security;
alter table public.community_likes enable row level security;
alter table public.community_saved_posts enable row level security;
alter table public.community_shares enable row level security;

create policy "Anyone can view skills"
on public.skills for select
using (true);

create policy "Authenticated can create skills"
on public.skills for insert
to authenticated
with check (true);

create policy "Anyone can view communities"
on public.communities for select
using (true);

create policy "Authenticated can create communities"
on public.communities for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Anyone can view community members"
on public.community_members for select
using (true);

create policy "Users can join community"
on public.community_members for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can leave own membership"
on public.community_members for delete
using (auth.uid() = user_id);

create policy "Anyone can view posts"
on public.community_posts for select
using (true);

create policy "Authenticated can create posts"
on public.community_posts for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Authors can update own posts"
on public.community_posts for update
using (auth.uid() = author_id);

create policy "Anyone can view events"
on public.community_events for select
using (true);

create policy "Authenticated can create events"
on public.community_events for insert
to authenticated
with check (auth.uid() = created_by);

create policy "Creators can update own events"
on public.community_events for update
using (auth.uid() = created_by);

create policy "Anyone can view comments"
on public.community_comments for select
using (true);

create policy "Authenticated can add comments"
on public.community_comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can edit own comments"
on public.community_comments for update
using (auth.uid() = user_id);

create policy "Anyone can view likes"
on public.community_likes for select
using (true);

create policy "Users can like posts"
on public.community_likes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can unlike own likes"
on public.community_likes for delete
using (auth.uid() = user_id);

create policy "Users can view own saved posts"
on public.community_saved_posts for select
using (auth.uid() = user_id);

create policy "Users can save posts"
on public.community_saved_posts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can unsave own posts"
on public.community_saved_posts for delete
using (auth.uid() = user_id);

create policy "Anyone can view shares"
on public.community_shares for select
using (true);

create policy "Users can share posts"
on public.community_shares for insert
to authenticated
with check (auth.uid() = user_id);

drop trigger if exists update_community_posts_updated_at on public.community_posts;
create trigger update_community_posts_updated_at
before update on public.community_posts
for each row execute function public.update_updated_at_column();

drop trigger if exists update_community_events_updated_at on public.community_events;
create trigger update_community_events_updated_at
before update on public.community_events
for each row execute function public.update_updated_at_column();

drop trigger if exists update_community_comments_updated_at on public.community_comments;
create trigger update_community_comments_updated_at
before update on public.community_comments
for each row execute function public.update_updated_at_column();

insert into public.skills (name, description)
values
  ('Web Development', 'Frontend, backend, and full-stack development learning.'),
  ('Tailoring', 'Design, stitching, boutique, and apparel community.'),
  ('AI', 'AI tools, prompting, automation, and machine intelligence.'),
  ('Farming', 'Agri-practices, productivity, and agri-business support.'),
  ('Women Entrepreneurs', 'Women-led startup and livelihood community.')
on conflict (name) do nothing;
