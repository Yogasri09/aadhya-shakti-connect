import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Landmark, GraduationCap, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Recommendation {
  kind: "scheme" | "course" | "product";
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  state: string | null;
  reason: string;
  matchedOn: string[];
}

const kindMeta = {
  scheme: { icon: Landmark, label: "Scheme", to: "/dashboard/schemes", color: "text-primary" },
  course: { icon: GraduationCap, label: "Course", to: "/dashboard/courses", color: "text-accent" },
  product: { icon: ShoppingBag, label: "Marketplace", to: "/dashboard/marketplace", color: "text-warm" },
} as const;

export function RecommendedForYou() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("ai-recommendations");
        if (cancelled) return;
        if (error) throw error;
        setItems(data?.recommendations || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Could not load recommendations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg font-sans flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Recommended for You
          <Badge variant="secondary" className="ml-2 text-xs">AI personalized</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> Tailoring picks based on your profile…
          </div>
        )}
        {error && !loading && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Couldn't load picks right now. {error}
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Complete your profile and questionnaire to get personalized picks.
          </p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, i) => {
            const meta = kindMeta[item.kind];
            const Icon = meta.icon;
            return (
              <motion.div
                key={`${item.kind}-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Link to={meta.to}>
                  <div className="p-4 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all h-full flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${meta.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {meta.label}
                      </div>
                      {item.state && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-3 w-3" />{item.state}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm leading-snug line-clamp-2">{item.title}</h4>
                    <div className="mt-auto pt-2 border-t">
                      <p className="text-xs text-primary/80 italic leading-snug">
                        ✨ {item.reason}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        {!loading && items.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => { setLoading(true); setError(null); supabase.functions.invoke("ai-recommendations").then(({ data, error }) => { if (error) setError(error.message); else setItems(data?.recommendations || []); setLoading(false); }); }}>
              Refresh picks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
