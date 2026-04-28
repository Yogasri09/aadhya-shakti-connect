import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  targetId: string;
  targetType: "product" | "service";
  variant?: "icon" | "default";
  className?: string;
}

export default function WishlistButton({ targetId, targetType, variant = "icon", className }: Props) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle()
      .then(({ data }) => setSaved(!!data));
  }, [user, targetId, targetType]);

  const toggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Log in to save items");
      return;
    }
    setLoading(true);
    if (saved) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("target_type", targetType).eq("target_id", targetId);
      setSaved(false);
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, target_type: targetType, target_id: targetId });
      setSaved(true);
      toast.success("Saved to wishlist");
    }
    setLoading(false);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={cn(
          "absolute top-2 right-2 h-8 w-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", saved ? "fill-rose-500 text-rose-500" : "text-muted-foreground")} />
      </button>
    );
  }

  return (
    <Button variant="outline" onClick={toggle} disabled={loading} className={className}>
      <Heart className={cn("h-4 w-4 mr-2", saved && "fill-rose-500 text-rose-500")} />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
