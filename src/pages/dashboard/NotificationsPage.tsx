import { Bell, Landmark, GraduationCap, CalendarDays, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const notifications = [
  { icon: Landmark, title: "New Scheme Available", desc: "Annapurna Scheme for women in food business — loans up to ₹50,000.", time: "2 hours ago", read: false },
  { icon: GraduationCap, title: "Course Starting Soon", desc: "Beautician Training batch starting April 1. Enroll now!", time: "5 hours ago", read: false },
  { icon: CalendarDays, title: "Event Reminder", desc: "Women Entrepreneur Expo is in 5 days. Don't forget to register.", time: "1 day ago", read: false },
  { icon: ShoppingBag, title: "Order Received", desc: "You have a new order for Hand-Embroidered Dupatta.", time: "2 days ago", read: true },
  { icon: Landmark, title: "Application Update", desc: "Your PMMY loan application has been reviewed. Check status.", time: "3 days ago", read: true },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on schemes, courses, events, and orders.</p>
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => (
          <Card key={i} className={!n.read ? "border-primary/20 bg-primary/[0.02]" : ""}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${!n.read ? "hero-gradient" : "bg-muted"}`}>
                <n.icon className={`h-4 w-4 ${!n.read ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
