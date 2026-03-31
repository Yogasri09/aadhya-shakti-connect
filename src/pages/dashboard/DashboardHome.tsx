import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "./dashboards/UserDashboard";
import SellerDashboard from "./dashboards/SellerDashboard";
import MentorDashboard from "./dashboards/MentorDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

export default function DashboardHome() {
  const { profile, roles } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] || "User";

  // Show highest-priority role dashboard
  if (roles.includes("admin")) return <AdminDashboard name={firstName} />;
  if (roles.includes("mentor")) return <MentorDashboard name={firstName} />;
  if (roles.includes("seller")) return <SellerDashboard name={firstName} />;
  return <UserDashboard name={firstName} />;
}
