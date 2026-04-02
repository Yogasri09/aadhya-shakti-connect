import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Landmark, GraduationCap, CalendarDays, ShoppingBag, BadgeCheck, Bot, Sparkles, CheckCheck } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string | null;
  type: string;
  read: boolean;
  created_at: string;
}

const iconMap: Record<string, typeof Bell> = {
  welcome: Sparkles,
  success: BadgeCheck,
  warning: Bell,
  course: GraduationCap,
  scheme: Landmark,
  event: CalendarDays,
  order: ShoppingBag,
  ai: Bot,
  info: Bell,
};

const defaultNotifications = [
  { id: "d1", title: "New Scheme Available", description: "Annapurna Scheme for women in food business — loans up to ₹50,000.", type: "scheme", read: false, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "d2", title: "Course Starting Soon", description: "Beautician Training batch starting April 1. Enroll now!", type: "course", read: false, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "d3", title: "Event Reminder", description: "Women Entrepreneur Expo is in 5 days. Don't forget to register.", type: "event", read: false, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "d4", title: "AI Recommendation", description: "Based on your interests, check out the new Digital Marketing course!", type: "ai", read: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "d5", title: "Application Update", description: "Your PMMY loan application has been reviewed. Check status.", type: "scheme", read: true, created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications(defaultNotifications as Notification[]);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setNotifications(data as Notification[]);
      } else {
        setNotifications(defaultNotifications as Notification[]);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (notifId: string) => {
    // Update local state
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    // Update in DB if real notification
    if (user && !notifId.startsWith("d")) {
      await supabase.from("notifications").update({ read: true }).eq("id", notifId);
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (user) {
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    }
    toast.success("All notifications marked as read");
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on schemes, courses, events, and more.
            {unreadCount > 0 && <span className="text-primary font-medium ml-1">{unreadCount} unread</span>}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <Card
                key={n.id}
                className={`cursor-pointer transition-colors ${!n.read ? "border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04]" : "hover:bg-muted/30"}`}
                onClick={() => markAsRead(n.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.read ? "hero-gradient" : "bg-muted"}`}>
                    <Icon className={`h-4 w-4 ${!n.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
