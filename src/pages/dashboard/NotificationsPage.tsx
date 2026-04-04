import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell, Landmark, GraduationCap, CalendarDays, ShoppingBag, BadgeCheck, Bot,
  Sparkles, CheckCheck, TrendingUp, Users, Package, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_NOTIFICATIONS } from "@/data/mockDatabase";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
  role?: string;
}

const iconMap: Record<string, typeof Bell> = {
  welcome: Sparkles, success: BadgeCheck, warning: AlertTriangle,
  course: GraduationCap, scheme: Landmark, event: CalendarDays,
  order: ShoppingBag, ai: Bot, info: Bell, demand: TrendingUp,
  mentor: Users, product: Package,
};

function buildNotifications(role: string): Notification[] {
  const mockNotifs = MOCK_NOTIFICATIONS
    .filter(n => n.role === role || n.role === "all")
    .map(n => ({
      id: n.id, title: n.title, message: n.description,
      type: n.type, is_read: n.read, created_at: n.createdAt, role: n.role,
    }));

  const defaults: Notification[] = [
    { id: "d1", title: "New Scheme Available 🏛️", message: "Annapurna Scheme for women in food business — loans up to ₹50,000.", type: "scheme", is_read: false, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: "d2", title: "Course Starting Soon 📚", message: "Beautician Training batch starting April 1. Enroll now!", type: "course", is_read: false, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: "d3", title: "Event Reminder 📅", message: "Women Entrepreneur Expo is in 5 days. Don't forget to register.", type: "event", is_read: false, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: "d4", title: "AI Recommendation 🤖", message: "Based on your interests, check out the new Digital Marketing course!", type: "ai", is_read: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  return [...mockNotifs, ...defaults].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export default function NotificationsPage() {
  const { user, roles } = useAuth();
  const currentRole = roles.includes("admin") ? "admin" : roles.includes("mentor") ? "mentor" : roles.includes("seller") ? "seller" : "user";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications(buildNotifications(currentRole));
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setNotifications([...data as Notification[], ...buildNotifications(currentRole)]);
      } else {
        setNotifications(buildNotifications(currentRole));
      }
      setLoading(false);
    };
    fetchNotifications();
  }, [user, currentRole]);

  const markAsRead = async (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    if (user && !notifId.startsWith("d") && !notifId.startsWith("n")) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notifId);
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    if (user) {
      await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
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

  const filtered = filter === "all" ? notifications
    : filter === "unread" ? notifications.filter(n => !n.is_read)
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="demand">📈 Demand</TabsTrigger>
          <TabsTrigger value="info">ℹ️ Info</TabsTrigger>
          <TabsTrigger value="success">✅ Success</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const Icon = iconMap[n.type] || Bell;
                return (
                  <Card
                    key={n.id}
                    className={`cursor-pointer transition-colors ${!n.is_read ? "border-primary/20 bg-primary/[0.02] hover:bg-primary/[0.04]" : "hover:bg-muted/30"}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.is_read ? "hero-gradient" : "bg-muted"}`}>
                        <Icon className={`h-4 w-4 ${!n.is_read ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-sm ${!n.is_read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                          {n.type === "demand" && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-50 text-purple-600 border-purple-200">
                              Demand Alert
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(n.created_at)}</p>
                      </div>
                      {!n.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                    </CardContent>
                  </Card>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No notifications in this category.</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
