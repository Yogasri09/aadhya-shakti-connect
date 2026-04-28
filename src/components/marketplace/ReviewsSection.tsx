import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Flag, Trash2, BadgeCheck } from "lucide-react";
import StarRating from "./StarRating";
import RatingSummary from "./RatingSummary";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_reported: boolean;
  created_at: string;
}

interface Props {
  targetId: string;
  targetType: "product" | "service";
}

export default function ReviewsSection({ targetId, targetType }: Props) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibleId, setEligibleId] = useState<string | null>(null); // order_id or booking_id
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoading(false);

    if (user) {
      // Check if already reviewed
      const mine = (data || []).find(r => r.user_id === user.id);
      setHasReviewed(!!mine);

      // Check eligibility
      if (!mine) {
        if (targetType === "product") {
          const { data: o } = await supabase
            .from("orders")
            .select("id")
            .eq("buyer_id", user.id)
            .eq("product_id", targetId)
            .eq("status", "delivered")
            .limit(1)
            .maybeSingle();
          setEligibleId(o?.id ?? null);
        } else {
          const { data: b } = await supabase
            .from("bookings")
            .select("id")
            .eq("buyer_id", user.id)
            .eq("service_id", targetId)
            .eq("status", "completed")
            .limit(1)
            .maybeSingle();
          setEligibleId(b?.id ?? null);
        }
      }
    }
  };

  useEffect(() => { load(); }, [targetId, targetType, user?.id]);

  const submit = async () => {
    if (!user || !eligibleId) return;
    if (!form.body.trim()) {
      toast.error("Please write a review");
      return;
    }
    setSubmitting(true);
    const payload: Record<string, unknown> = {
      user_id: user.id,
      target_type: targetType,
      target_id: targetId,
      rating: form.rating,
      title: form.title.trim() || null,
      body: form.body.trim(),
    };
    if (targetType === "product") payload.order_id = eligibleId;
    else payload.booking_id = eligibleId;

    const { error } = await supabase.from("reviews").insert(payload as never);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Review posted!");
    setShowForm(false);
    setForm({ rating: 5, title: "", body: "" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    toast.success("Review removed");
    load();
  };

  const report = async (id: string) => {
    await supabase.from("reviews").update({ is_reported: true }).eq("id", id);
    toast.success("Reported. Thanks for your feedback.");
    load();
  };

  return (
    <div className="space-y-4">
      <RatingSummary targetId={targetId} targetType={targetType} />

      {user && eligibleId && !hasReviewed && (
        <Card className="border-primary/40">
          <CardContent className="p-4">
            {!showForm ? (
              <Button className="w-full hero-gradient text-primary-foreground" onClick={() => setShowForm(true)}>
                Write a Review
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Your rating</p>
                  <StarRating value={form.rating} size={24} onChange={n => setForm(p => ({ ...p, rating: n }))} />
                </div>
                <Input placeholder="Review title (optional)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} maxLength={100} />
                <Textarea placeholder="Share your experience..." value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={3} maxLength={1000} />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button className="flex-1 hero-gradient text-primary-foreground" onClick={submit} disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Post
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-6">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <Card key={r.id} className="glass-card">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating value={r.rating} size={14} />
                      <Badge variant="outline" className="text-[10px] gap-1"><BadgeCheck className="h-3 w-3 text-success" />Verified</Badge>
                    </div>
                    {r.title && <h4 className="font-semibold text-sm mt-1">{r.title}</h4>}
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.body && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{r.body}</p>}
                <div className="flex gap-2">
                  {user?.id === r.user_id ? (
                    <Button variant="ghost" size="sm" className="text-destructive h-7 text-xs" onClick={() => remove(r.id)}>
                      <Trash2 className="h-3 w-3 mr-1" /> Delete
                    </Button>
                  ) : user && !r.is_reported ? (
                    <Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs" onClick={() => report(r.id)}>
                      <Flag className="h-3 w-3 mr-1" /> Report
                    </Button>
                  ) : r.is_reported ? (
                    <Badge variant="outline" className="text-[10px] text-warm">Reported</Badge>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
