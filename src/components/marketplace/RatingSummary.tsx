import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StarRating from "./StarRating";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  targetId: string;
  targetType: "product" | "service";
  compact?: boolean;
}

interface Stats {
  avg: number;
  count: number;
  buckets: number[]; // index 0 -> 5 stars
}

export function useRatingStats(targetId: string, targetType: "product" | "service") {
  const [stats, setStats] = useState<Stats | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("reviews")
      .select("rating")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .then(({ data }) => {
        if (cancelled) return;
        const arr = data || [];
        const buckets = [0, 0, 0, 0, 0];
        let total = 0;
        arr.forEach(r => {
          buckets[5 - r.rating] += 1;
          total += r.rating;
        });
        setStats({ avg: arr.length ? total / arr.length : 0, count: arr.length, buckets });
      });
    return () => { cancelled = true; };
  }, [targetId, targetType]);
  return stats;
}

export default function RatingSummary({ targetId, targetType, compact }: Props) {
  const stats = useRatingStats(targetId, targetType);
  if (!stats) return compact ? <Skeleton className="h-4 w-20" /> : <Skeleton className="h-24 w-full" />;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <StarRating value={stats.avg} size={12} />
        <span className="text-muted-foreground">{stats.count > 0 ? `${stats.avg.toFixed(1)} (${stats.count})` : "No reviews"}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-lg bg-muted/30">
      <div className="text-center sm:border-r sm:pr-6">
        <div className="text-4xl font-bold text-primary">{stats.avg.toFixed(1)}</div>
        <StarRating value={stats.avg} size={16} className="justify-center mt-1" />
        <div className="text-xs text-muted-foreground mt-1">{stats.count} review{stats.count === 1 ? "" : "s"}</div>
      </div>
      <div className="flex-1 space-y-1.5">
        {[5, 4, 3, 2, 1].map((star, i) => {
          const c = stats.buckets[i];
          const pct = stats.count ? (c / stats.count) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3">{star}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-right text-muted-foreground">{c}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
