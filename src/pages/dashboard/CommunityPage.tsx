import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ThumbsUp } from "lucide-react";

const posts = [
  { id: 1, author: "Priya Sharma", initials: "PS", content: "Just completed my beautician course! Any tips for starting a home salon? 💇‍♀️", likes: 12, comments: ["Congratulations! Start with basic services and build your clientele.", "Make sure to get FSSAI certification if offering hair treatments."] },
  { id: 2, author: "Meena Devi", initials: "MD", content: "I started selling pickles through Mahila E-Haat last month. Already got 15 orders! The platform is amazing for small sellers. 🥒", likes: 28, comments: ["That's wonderful! How did you register?", "Can you share the link to your products?"] },
  { id: 3, author: "Lakshmi Nair", initials: "LN", content: "Has anyone applied for the Stand-Up India loan? How long does the process take? Need guidance for my handicraft business.", likes: 8, comments: ["It took me about 3 weeks. Make sure your project report is detailed."] },
];

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Community</h1>
        <p className="text-muted-foreground">Connect, share, and learn from fellow women entrepreneurs.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Textarea placeholder="Share your experience or ask a question..." value={newPost} onChange={e => setNewPost(e.target.value)} className="mb-3" />
          <Button size="sm" disabled={!newPost.trim()} onClick={() => setNewPost("")}>Post</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map(p => (
          <Card key={p.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">{p.initials}</div>
                <span className="font-medium text-sm">{p.author}</span>
              </div>
              <p className="text-sm leading-relaxed">{p.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3.5 w-3.5" />{p.likes}</button>
                <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{p.comments.length} replies</span>
              </div>
              {p.comments.map((c, i) => (
                <div key={i} className="ml-12 p-3 rounded-lg bg-muted text-xs">{c}</div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
