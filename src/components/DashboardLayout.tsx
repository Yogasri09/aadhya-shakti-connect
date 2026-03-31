import { Link, Outlet } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, GraduationCap, Landmark, ShoppingBag, CalendarDays,
  BadgeCheck, Users, Bot, MessageSquare, Bell, FileText, Trophy, LogOut, Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Training & Courses", url: "/dashboard/courses", icon: GraduationCap },
  { title: "Government Schemes", url: "/dashboard/schemes", icon: Landmark },
  { title: "Marketplace", url: "/dashboard/marketplace", icon: ShoppingBag },
  { title: "Events & Expo", url: "/dashboard/events", icon: CalendarDays },
  { title: "Certification", url: "/dashboard/certification", icon: BadgeCheck },
  { title: "Mentorship", url: "/dashboard/mentorship", icon: Users },
  { title: "AI Assistant", url: "/dashboard/ai-assistant", icon: Bot },
  { title: "Community", url: "/dashboard/community", icon: MessageSquare },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Documents", url: "/dashboard/documents", icon: FileText },
  { title: "Achievements", url: "/dashboard/achievements", icon: Trophy },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { hasRole } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm font-serif">A</span>
            </div>
            {!collapsed && <span className="font-serif text-lg">Aadhya</span>}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/dashboard"} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {hasRole("admin") && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/dashboard/admin" className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <Shield className="mr-2 h-4 w-4" />
                      {!collapsed && <span>Admin Panel</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <LogoutButton collapsed={collapsed} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

function LogoutButton({ collapsed }: { collapsed: boolean }) {
  const { signOut } = useAuth();
  return (
    <button onClick={signOut} className="flex items-center w-full text-muted-foreground hover:text-foreground">
      <LogOut className="mr-2 h-4 w-4" />
      {!collapsed && <span>Log Out</span>}
    </button>
  );
}

export default function DashboardLayout() {
  const { profile } = useAuth();
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <span className="font-serif text-lg">Aadhya</span>
            <div className="ml-auto flex items-center gap-3">
              <Link to="/dashboard/notifications" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">3</span>
              </Link>
              <Link to="/dashboard/profile" className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">{initials}</Link>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
