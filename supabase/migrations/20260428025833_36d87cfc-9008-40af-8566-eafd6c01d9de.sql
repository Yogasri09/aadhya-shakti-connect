
-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins manage skills" ON public.skills FOR ALL USING (has_role(auth.uid(),'admin'));

-- Communities
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view communities" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Auth can create communities" ON public.communities FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Members
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view members" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "Users join" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- Posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  post_type TEXT NOT NULL DEFAULT 'update',
  is_news BOOLEAN NOT NULL DEFAULT false,
  event_date TIMESTAMPTZ,
  event_location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors delete posts" ON public.community_posts FOR DELETE USING (auth.uid() = author_id);

-- Events
CREATE TABLE public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view events" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "Users create events" ON public.community_events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators update events" ON public.community_events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators delete events" ON public.community_events FOR DELETE USING (auth.uid() = created_by);

-- Likes
CREATE TABLE public.community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view likes" ON public.community_likes FOR SELECT USING (true);
CREATE POLICY "Users like" ON public.community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unlike" ON public.community_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments
CREATE TABLE public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view comments" ON public.community_comments FOR SELECT USING (true);
CREATE POLICY "Users comment" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON public.community_comments FOR DELETE USING (auth.uid() = user_id);

-- Shares
CREATE TABLE public.community_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_shares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view shares" ON public.community_shares FOR SELECT USING (true);
CREATE POLICY "Users share" ON public.community_shares FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Saved
CREATE TABLE public.community_saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.community_saved_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own saved" ON public.community_saved_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users save" ON public.community_saved_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unsave" ON public.community_saved_posts FOR DELETE USING (auth.uid() = user_id);
