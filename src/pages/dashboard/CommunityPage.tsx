import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Share2, ThumbsUp, Bookmark, CalendarDays, Newspaper, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  addComment,
  addEvent,
  buildCommunityAiSuggestions,
  createPost,
  ensureCommunityForSkill,
  getCommunitiesBySkill,
  getEventsBySkill,
  getPostsBySkill,
  getSkills,
  joinCommunity,
  sharePost,
  toggleLike,
  toggleSave,
  type CommunityEvent,
  type CommunityFeedPost,
} from "@/data/communityApi";

export default function CommunityPage() {
  const { questionnaire } = useAuth();
  const [skills, setSkills] = useState<{ id: string; name: string; description: string | null }[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [communityId, setCommunityId] = useState<string>("");
  const [posts, setPosts] = useState<CommunityFeedPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [newCommentByPost, setNewCommentByPost] = useState<Record<string, string>>({});
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [newsText, setNewsText] = useState("");

  const userInterests = questionnaire?.interests ?? [];

  const aiInsights = useMemo(
    () =>
      buildCommunityAiSuggestions({
        skills: skills.map((s) => ({ id: s.id, name: s.name })),
        selectedSkillId,
        posts,
        userInterests,
      }),
    [skills, selectedSkillId, posts, userInterests]
  );

  const selectedSkillName = skills.find((s) => s.id === selectedSkillId)?.name ?? "Community";
  const upcomingEvents = events.filter((e) => new Date(e.starts_at).getTime() >= Date.now());
  const pastEvents = events.filter((e) => new Date(e.starts_at).getTime() < Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const allSkills = await getSkills();
        setSkills(allSkills);
        if (allSkills[0]) setSelectedSkillId(allSkills[0].id);
      } catch (error) {
        toast.error((error as Error).message || "Failed to load communities");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const loadCommunityData = async () => {
      if (!selectedSkillId) return;
      try {
        setLoading(true);
        const existingCommunities = await getCommunitiesBySkill(selectedSkillId);
        const firstCommunity = existingCommunities[0] ?? await ensureCommunityForSkill(
          selectedSkillId,
          `${skills.find((s) => s.id === selectedSkillId)?.name ?? "Skill"} Community`,
          "Skill-based learning, support, events, and real-time updates."
        );

        setCommunityId(firstCommunity.id);
        await joinCommunity(firstCommunity.id);

        const [feedPosts, feedEvents] = await Promise.all([
          getPostsBySkill(selectedSkillId),
          getEventsBySkill(selectedSkillId),
        ]);
        setPosts(feedPosts);
        setEvents(feedEvents);
      } catch (error) {
        toast.error((error as Error).message || "Failed to load feed");
      } finally {
        setLoading(false);
      }
    };
    void loadCommunityData();
  }, [selectedSkillId, skills]);

  const refreshFeed = async () => {
    if (!selectedSkillId) return;
    const [feedPosts, feedEvents] = await Promise.all([
      getPostsBySkill(selectedSkillId),
      getEventsBySkill(selectedSkillId),
    ]);
    setPosts(feedPosts);
    setEvents(feedEvents);
  };

  const onCreatePost = async () => {
    if (!newPost.trim() || !communityId || !selectedSkillId) return;
    try {
      await createPost({
        communityId,
        skillId: selectedSkillId,
        title: postTitle.trim() || undefined,
        content: newPost.trim(),
        mediaUrl: mediaUrl.trim() || undefined,
        mediaType: mediaUrl.trim() ? "image" : undefined,
        postType: "update",
      });
      setPostTitle("");
      setNewPost("");
      setMediaUrl("");
      await refreshFeed();
      toast.success("Post published");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create post");
    }
  };

  const onCreateNews = async () => {
    if (!newsText.trim() || !communityId || !selectedSkillId) return;
    try {
      await createPost({
        communityId,
        skillId: selectedSkillId,
        title: `${selectedSkillName} News`,
        content: newsText.trim(),
        postType: "news",
        isNews: true,
      });
      setNewsText("");
      await refreshFeed();
      toast.success("News update posted");
    } catch (error) {
      toast.error((error as Error).message || "Failed to create news");
    }
  };

  const onCreateEvent = async () => {
    if (!eventTitle.trim() || !eventDate || !communityId || !selectedSkillId) return;
    try {
      await addEvent({
        communityId,
        skillId: selectedSkillId,
        title: eventTitle.trim(),
        description: eventDescription.trim() || undefined,
        location: eventLocation.trim() || undefined,
        startsAt: new Date(eventDate).toISOString(),
      });
      setEventTitle("");
      setEventDate("");
      setEventLocation("");
      setEventDescription("");
      await refreshFeed();
      toast.success("Event added");
    } catch (error) {
      toast.error((error as Error).message || "Failed to add event");
    }
  };

  const onAddComment = async (postId: string) => {
    const comment = newCommentByPost[postId]?.trim();
    if (!comment) return;
    try {
      await addComment(postId, comment);
      setNewCommentByPost((prev) => ({ ...prev, [postId]: "" }));
      await refreshFeed();
    } catch (error) {
      toast.error((error as Error).message || "Failed to add comment");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Community</h1>
        <p className="text-muted-foreground">Skill-based social learning with posts, events, news, and AI-guided engagement.</p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid gap-2">
            <Label>Select Skill Community</Label>
            <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <Card className="md:col-span-1 bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4" />AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p>{aiInsights.recommendedCommunity}</p>
                {aiInsights.trendingDiscussions.map((item) => (
                  <p key={item} className="text-muted-foreground">• {item}</p>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" />Create Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input placeholder="Post title (optional)" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
                <Textarea
                  placeholder={`Share update in ${selectedSkillName} community...`}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <Input placeholder="Image/video URL (optional)" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
                <Button size="sm" disabled={!newPost.trim() || loading} onClick={onCreatePost}>Post Update</Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-4">
          {posts.filter((p) => !p.is_news).map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{p.title || "Community Update"}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm leading-relaxed">{p.content}</p>
                {p.media_url && (
                  <img
                    src={p.media_url}
                    alt="Post media"
                    className="w-full max-h-72 object-cover rounded-lg border"
                  />
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <button
                    className={`flex items-center gap-1 hover:text-foreground ${p.likedByMe ? "text-primary" : ""}`}
                    onClick={async () => {
                      await toggleLike(p.id, p.likedByMe);
                      await refreshFeed();
                    }}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />{p.likeCount}
                  </button>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{p.commentCount}</span>
                  <button
                    className={`flex items-center gap-1 hover:text-foreground ${p.savedByMe ? "text-primary" : ""}`}
                    onClick={async () => {
                      await toggleSave(p.id, p.savedByMe);
                      await refreshFeed();
                    }}
                  >
                    <Bookmark className="h-3.5 w-3.5" />Save
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={async () => {
                      await sharePost(p.id);
                      await refreshFeed();
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" />{p.shareCount}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newCommentByPost[p.id] || ""}
                    onChange={(e) => setNewCommentByPost((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  />
                  <Button size="sm" variant="outline" onClick={() => onAddComment(p.id)}>Comment</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4" />Add Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input placeholder="Event title" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              <Input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              <Input placeholder="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
              <Textarea placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
              <Button size="sm" onClick={onCreateEvent} disabled={!eventTitle || !eventDate}>Add Event</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events yet.</p>}
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.starts_at).toLocaleString()} • {event.location || "Online/TBD"}
                  </p>
                  {event.description && <p className="text-xs mt-1">{event.description}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Past Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pastEvents.length === 0 && <p className="text-sm text-muted-foreground">No past events yet.</p>}
              {pastEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border bg-muted/30">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.starts_at).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Newspaper className="h-4 w-4" />Post Skill News</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                placeholder={`Share latest news for ${selectedSkillName} community...`}
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
              />
              <Button size="sm" onClick={onCreateNews} disabled={!newsText.trim()}>Publish News</Button>
            </CardContent>
          </Card>

          {posts.filter((p) => p.is_news).map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-medium">{p.title || "News Update"}</p>
                <p className="text-sm">{p.content}</p>
                <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">AI Community Guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          {aiInsights.guidance.map((tip) => (
            <p key={tip}>• {tip}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
