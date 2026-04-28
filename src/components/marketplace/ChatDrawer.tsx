import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  sellerId: string;
  sellerName?: string;
  productId?: string;
  serviceId?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function ChatDrawer({ open, onOpenChange, sellerId, sellerName, productId, serviceId }: Props) {
  const { user } = useAuth();
  const [convId, setConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Open or create conversation
  useEffect(() => {
    if (!open || !user || user.id === sellerId) return;
    setLoading(true);
    (async () => {
      const query = supabase
        .from("conversations")
        .select("id")
        .eq("buyer_id", user.id)
        .eq("seller_id", sellerId);
      if (productId) query.eq("product_id", productId);
      else query.is("product_id", null);
      if (serviceId) query.eq("service_id", serviceId);
      else query.is("service_id", null);

      const { data: existing } = await query.maybeSingle();
      let id = existing?.id;
      if (!id) {
        const { data: created, error } = await supabase
          .from("conversations")
          .insert({
            buyer_id: user.id,
            seller_id: sellerId,
            product_id: productId ?? null,
            service_id: serviceId ?? null,
          })
          .select("id")
          .single();
        if (error) {
          toast.error("Could not start chat");
          setLoading(false);
          return;
        }
        id = created.id;
      }
      setConvId(id);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      setMessages(msgs || []);
      setLoading(false);
    })();
  }, [open, user, sellerId, productId, serviceId]);

  // Realtime subscription
  useEffect(() => {
    if (!convId) return;
    const channel = supabase
      .channel(`messages:${convId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${convId}` },
        payload => {
          setMessages(prev => [...prev, payload.new as Message]);
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [convId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !convId || !user) return;
    setSending(true);
    const content = input.trim().slice(0, 1000);
    setInput("");
    const { error } = await supabase.from("messages").insert({
      conversation_id: convId,
      sender_id: user.id,
      content,
    });
    if (error) toast.error("Failed to send");
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convId);
    setSending(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="font-serif">{sellerName || "Chat with seller"}</SheetTitle>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : messages.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">Say hi! 👋</p>
          ) : (
            messages.map(m => {
              const mine = m.sender_id === user?.id;
              return (
                <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                    mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card rounded-bl-sm border",
                  )}>
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    <p className={cn("text-[10px] mt-1 opacity-70", mine ? "text-primary-foreground" : "text-muted-foreground")}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-3 border-t flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            maxLength={1000}
          />
          <Button onClick={send} disabled={sending || !input.trim()} className="hero-gradient text-primary-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
