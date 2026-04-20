import { supabase } from "@/integrations/supabase/client";

export interface CommunityFeedPost {
  id: string;
  title: string | null;
  content: string;
  media_url: string | null;
  media_type: string | null;
  post_type: string;
  is_news: boolean;
  event_date: string | null;
  event_location: string | null;
  created_at: string;
  author_id: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  savedByMe: boolean;
  likedByMe: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  created_at: string;
}

export async function getSkills() {
  const { data, error } = await supabase.from("skills").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getCommunitiesBySkill(skillId: string) {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("skill_id", skillId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function ensureCommunityForSkill(skillId: string, name: string, description: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");

  const { data: existing } = await supabase
    .from("communities")
    .select("*")
    .eq("skill_id", skillId)
    .limit(1)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("communities")
    .insert({
      skill_id: skillId,
      name,
      description,
      created_by: user.id,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function joinCommunity(communityId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  const { error } = await supabase
    .from("community_members")
    .upsert({ community_id: communityId, user_id: user.id }, { onConflict: "community_id,user_id" });
  if (error) throw error;
}

export async function createPost(payload: {
  communityId: string;
  skillId: string;
  content: string;
  title?: string;
  mediaUrl?: string;
  mediaType?: string;
  postType?: string;
  isNews?: boolean;
  eventDate?: string;
  eventLocation?: string;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  const { error } = await supabase.from("community_posts").insert({
    community_id: payload.communityId,
    skill_id: payload.skillId,
    author_id: user.id,
    title: payload.title ?? null,
    content: payload.content,
    media_url: payload.mediaUrl ?? null,
    media_type: payload.mediaType ?? null,
    post_type: payload.postType ?? "update",
    is_news: payload.isNews ?? false,
    event_date: payload.eventDate ?? null,
    event_location: payload.eventLocation ?? null,
  });
  if (error) throw error;
}

export async function addEvent(payload: {
  communityId: string;
  skillId: string;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  endsAt?: string;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  const { error } = await supabase.from("community_events").insert({
    community_id: payload.communityId,
    skill_id: payload.skillId,
    created_by: user.id,
    title: payload.title,
    description: payload.description ?? null,
    location: payload.location ?? null,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt ?? null,
  });
  if (error) throw error;
}

export async function getPostsBySkill(skillId: string): Promise<CommunityFeedPost[]> {
  const user = (await supabase.auth.getUser()).data.user;
  const userId = user?.id;

  const { data: posts, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("skill_id", skillId)
    .order("created_at", { ascending: false })
    .limit(80);
  if (error) throw error;

  const postIds = (posts ?? []).map((p) => p.id);
  if (postIds.length === 0) return [];

  const [{ data: likes }, { data: comments }, { data: shares }, { data: savedPosts }] = await Promise.all([
    supabase.from("community_likes").select("post_id, user_id").in("post_id", postIds),
    supabase.from("community_comments").select("post_id").in("post_id", postIds),
    supabase.from("community_shares").select("post_id").in("post_id", postIds),
    userId
      ? supabase.from("community_saved_posts").select("post_id").eq("user_id", userId).in("post_id", postIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const likeByPost = new Map<string, number>();
  const likedByMe = new Set<string>();
  (likes ?? []).forEach((item) => {
    likeByPost.set(item.post_id, (likeByPost.get(item.post_id) ?? 0) + 1);
    if (item.user_id === userId) likedByMe.add(item.post_id);
  });

  const commentByPost = new Map<string, number>();
  (comments ?? []).forEach((item) => commentByPost.set(item.post_id, (commentByPost.get(item.post_id) ?? 0) + 1));

  const shareByPost = new Map<string, number>();
  (shares ?? []).forEach((item) => shareByPost.set(item.post_id, (shareByPost.get(item.post_id) ?? 0) + 1));

  const savedByMe = new Set((savedPosts ?? []).map((s) => s.post_id));

  return (posts ?? []).map((post) => ({
    ...post,
    likeCount: likeByPost.get(post.id) ?? 0,
    commentCount: commentByPost.get(post.id) ?? 0,
    shareCount: shareByPost.get(post.id) ?? 0,
    savedByMe: savedByMe.has(post.id),
    likedByMe: likedByMe.has(post.id),
  }));
}

export async function getEventsBySkill(skillId: string): Promise<CommunityEvent[]> {
  const { data, error } = await supabase
    .from("community_events")
    .select("*")
    .eq("skill_id", skillId)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(postId: string, content: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  const { error } = await supabase.from("community_comments").insert({ post_id: postId, user_id: user.id, content });
  if (error) throw error;
}

export async function toggleLike(postId: string, currentlyLiked: boolean) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  if (currentlyLiked) {
    const { error } = await supabase.from("community_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("community_likes").insert({ post_id: postId, user_id: user.id });
  if (error) throw error;
}

export async function toggleSave(postId: string, currentlySaved: boolean) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  if (currentlySaved) {
    const { error } = await supabase.from("community_saved_posts").delete().eq("post_id", postId).eq("user_id", user.id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("community_saved_posts").insert({ post_id: postId, user_id: user.id });
  if (error) throw error;
}

export async function sharePost(postId: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("You must be logged in");
  const { error } = await supabase.from("community_shares").insert({ post_id: postId, user_id: user.id });
  if (error) throw error;
}

export function buildCommunityAiSuggestions(args: {
  skills: { id: string; name: string }[];
  selectedSkillId?: string;
  posts: CommunityFeedPost[];
  userInterests: string[];
}) {
  const skillName = args.skills.find((s) => s.id === args.selectedSkillId)?.name ?? "this community";
  const trending = [...args.posts]
    .sort((a, b) => (b.likeCount + b.commentCount) - (a.likeCount + a.commentCount))
    .slice(0, 3)
    .map((p) => p.title || p.content.slice(0, 60));

  return {
    recommendedCommunity: `Based on your interests (${args.userInterests.slice(0, 2).join(", ") || "general growth"}), stay active in ${skillName}.`,
    trendingDiscussions: trending.length
      ? trending
      : ["No trends yet. Create the first high-value discussion post."],
    guidance: [
      "Post one practical challenge to get targeted advice quickly.",
      "Join upcoming events to build local collaboration opportunities.",
      "Save high-performing posts as your learning playbook.",
    ],
  };
}
