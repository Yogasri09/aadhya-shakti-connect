import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { QuestionnaireAnswers } from "@/data/locationData";

type AppRole = "user" | "seller" | "mentor" | "admin";

interface Profile {
  full_name: string | null;
  location: string | null;
  interest: string | null;
  state: string | null;
  city: string | null;
  first_login: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  questionnaire: QuestionnaireAnswers | null;
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeQuestionnaire: (answers: QuestionnaireAnswers) => Promise<void>;
  updateProfile: (data: Partial<Pick<Profile, "full_name" | "location" | "interest">>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswers | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    const [profileRes, rolesRes, questionnaireRes] = await Promise.all([
      supabase.from("profiles").select("full_name, location, interest").eq("user_id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.from("questionnaire_responses").select("responses").eq("user_id", userId).single(),
    ]);

    if (profileRes.data) {
      const hasQuestionnaire = !!questionnaireRes.data;
      const loc = profileRes.data.location || "";
      const parts = loc.split(",").map(s => s.trim());
      const city = parts.length > 1 ? parts[0] : null;
      const state = parts.length > 1 ? parts[1] : parts[0] || null;
      setProfile({ ...profileRes.data, state, city, first_login: !hasQuestionnaire });
    }
    if (rolesRes.data) setRoles(rolesRes.data.map((r) => r.role));
    if (questionnaireRes.data) setQuestionnaire(questionnaireRes.data.responses as unknown as QuestionnaireAnswers);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => fetchUserData(session.user.id), 0);
      } else {
        setProfile(null);
        setRoles([]);
        setQuestionnaire(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchUserData(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const hasRole = (role: AppRole) => roles.includes(role);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setQuestionnaire(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchUserData(user.id);
  };

  const completeQuestionnaire = async (answers: QuestionnaireAnswers) => {
    if (!user) return;
    await supabase.from("questionnaire_responses").insert({
      user_id: user.id,
      role: "user",
      responses: answers as unknown as import("@/integrations/supabase/types").Json,
    });
    // Add notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Profile Complete! 🎯",
      message: "Your personalized dashboard is ready. Explore recommended courses, schemes, and mentors.",
      type: "success",
    });
    setQuestionnaire(answers);
    setProfile(prev => prev ? { ...prev, first_login: false } : prev);
  };

  const updateProfile = async (data: Partial<Pick<Profile, "full_name" | "location" | "interest">>) => {
    if (!user) return;
    const updateData: Record<string, unknown> = {};
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.interest !== undefined) updateData.interest = data.interest;
    await supabase.from("profiles").update(updateData).eq("user_id", user.id);
    setProfile(prev => prev ? { ...prev, ...data } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, questionnaire, loading, hasRole, signOut, refreshProfile, completeQuestionnaire, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
