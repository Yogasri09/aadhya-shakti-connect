import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalMentors: number;
  totalAdmins: number;
  totalProducts: number;
  totalCourses: number;
  totalSchemes: number;
  loading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalSellers: 0, totalMentors: 0, totalAdmins: 0,
    totalProducts: 0, totalCourses: 0, totalSchemes: 0, loading: true,
  });

  useEffect(() => {
    const fetch = async () => {
      const [rolesRes, productsRes, coursesRes, schemesRes] = await Promise.all([
        supabase.from("user_roles").select("role"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("schemes").select("id", { count: "exact", head: true }),
      ]);

      const roles = rolesRes.data || [];
      const totalUsers = roles.filter(r => r.role === "user").length;
      const totalSellers = roles.filter(r => r.role === "seller").length;
      const totalMentors = roles.filter(r => r.role === "mentor").length;
      const totalAdmins = roles.filter(r => r.role === "admin").length;

      setStats({
        totalUsers: totalUsers + totalSellers + totalMentors + totalAdmins,
        totalSellers,
        totalMentors,
        totalAdmins,
        totalProducts: productsRes.count ?? 0,
        totalCourses: coursesRes.count ?? 0,
        totalSchemes: schemesRes.count ?? 0,
        loading: false,
      });
    };
    fetch();
  }, []);

  return stats;
}

export interface SellerStats {
  totalProducts: number;
  pendingProducts: number;
  approvedProducts: number;
  totalViews: number;
  loading: boolean;
}

export function useSellerStats(sellerId?: string): SellerStats {
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0, pendingProducts: 0, approvedProducts: 0, totalViews: 0, loading: true,
  });

  useEffect(() => {
    if (!sellerId) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("products")
        .select("status, views_count")
        .eq("seller_id", sellerId);

      const products = data || [];
      setStats({
        totalProducts: products.length,
        pendingProducts: products.filter(p => p.status === "pending").length,
        approvedProducts: products.filter(p => p.status === "approved").length,
        totalViews: products.reduce((sum, p) => sum + (p.views_count || 0), 0),
        loading: false,
      });
    };
    fetch();
  }, [sellerId]);

  return stats;
}

export interface MentorStats {
  totalMentees: number;
  pendingRequests: number;
  completedSessions: number;
  totalHours: number;
  loading: boolean;
}

export function useMentorStats(mentorId?: string): MentorStats {
  const [stats, setStats] = useState<MentorStats>({
    totalMentees: 0, pendingRequests: 0, completedSessions: 0, totalHours: 0, loading: true,
  });

  useEffect(() => {
    if (!mentorId) return;
    const fetch = async () => {
      const [requestsRes, sessionsRes] = await Promise.all([
        supabase.from("mentor_requests").select("status").eq("mentor_id", mentorId),
        supabase.from("mentor_sessions").select("status, duration_minutes").eq("mentor_id", mentorId),
      ]);

      const requests = requestsRes.data || [];
      const sessions = sessionsRes.data || [];
      const completed = sessions.filter(s => s.status === "completed");

      setStats({
        totalMentees: requests.filter(r => r.status === "accepted").length,
        pendingRequests: requests.filter(r => r.status === "pending").length,
        completedSessions: completed.length,
        totalHours: Math.round(completed.reduce((sum, s) => sum + (s.duration_minutes || 60), 0) / 60),
        loading: false,
      });
    };
    fetch();
  }, [mentorId]);

  return stats;
}
