import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  size?: number;
  onChange?: (n: number) => void;
  className?: string;
}

export default function StarRating({ value, size = 14, onChange, className }: Props) {
  const interactive = !!onChange;
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(n)}
          className={cn(interactive && "cursor-pointer hover:scale-110 transition-transform")}
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-none text-muted-foreground/40",
            )}
          />
        </button>
      ))}
    </div>
  );
}
