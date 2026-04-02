import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, MapPin, Sparkles, Save, Loader2, BadgeCheck, XCircle, ClipboardList, History } from "lucide-react";
import { INDIAN_STATES } from "@/data/locationData";

const MAX_NAME = 100;
const MAX_LOCATION = 150;
const MAX_INTEREST = 500;

interface CertRecord {
  id: string;
  certificate_id: string;
  holder_name: string | null;
  provider: string | null;
  status: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user, profile, roles, questionnaire, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [interest, setInterest] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [certHistory, setCertHistory] = useState<CertRecord[]>([]);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setState(profile.state ?? "");
      setCity(profile.city ?? "");
      setInterest(profile.interest ?? "");
    }
  }, [profile]);

  // Fetch certificate history
  useEffect(() => {
    if (!user) return;
    supabase.from("certificates").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setCertHistory(data as CertRecord[]);
    });
  }, [user]);

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setDirty(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) { toast.error("Name cannot be empty"); return; }
    if (trimmedName.length > MAX_NAME) { toast.error(`Name must be under ${MAX_NAME} characters`); return; }

    setSaving(true);
    await updateProfile({
      full_name: trimmedName,
      location: city ? `${city}, ${state}` : state,
      interest: interest.trim(),
      state,
      city: city.trim(),
    });
    setSaving(false);
    toast.success("Profile updated successfully!");
    setDirty(false);
  };

  const roleLabels: Record<string, string> = { user: "User", seller: "Seller", mentor: "Mentor", admin: "Admin" };

  const questionnaireLabels: Record<string, string> = {
    primaryGoal: "Primary Goal",
    interests: "Interests",
    skillLevel: "Skill Level",
    learningMode: "Learning Mode",
    needMentorship: "Need Mentorship",
    mentorshipArea: "Mentorship Area",
    govSchemeInterest: "Govt Scheme Interest",
    budget: "Budget",
    weeklyTime: "Weekly Time",
    interestedInSelling: "Interested in Selling",
    businessType: "Business Type",
    preferLocal: "Prefer Local",
    motivation: "Motivation",
    needCertification: "Need Certification",
    language: "Language",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information, questionnaire answers, and verification history.</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your name, location, and interests.</CardDescription>
            </div>
            {roles.length > 0 && (
              <div className="flex gap-1.5">
                {roles.map((r) => (
                  <Badge key={r} variant={r === "admin" ? "destructive" : "secondary"} className="capitalize">
                    {roleLabels[r] ?? r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
            <Input id="profile-email" value={user?.email ?? ""} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Full Name
            </Label>
            <Input id="profile-name" value={name} onChange={handleChange(setName)} placeholder="Your full name" maxLength={MAX_NAME} />
            <p className="text-xs text-muted-foreground text-right">{name.length}/{MAX_NAME}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> State</Label>
              <Select value={state} onValueChange={v => { setState(v); setDirty(true); }}>
                <SelectTrigger id="profile-state"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>City</Label>
              <Input id="profile-city" value={city} onChange={handleChange(setCity)} placeholder="Your city" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-interest" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Interests
            </Label>
            <Textarea id="profile-interest" value={interest} onChange={handleChange(setInterest)} placeholder="Tailoring, Business, Digital Marketing..." maxLength={MAX_INTEREST} rows={3} />
            <p className="text-xs text-muted-foreground text-right">{interest.length}/{MAX_INTEREST}</p>
          </div>

          <Button id="profile-save" onClick={handleSave} disabled={saving || !dirty} className="w-full sm:w-auto">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Questionnaire Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Questionnaire Answers
          </CardTitle>
          <CardDescription>Your personalization preferences from the onboarding questionnaire.</CardDescription>
        </CardHeader>
        <CardContent>
          {questionnaire ? (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(questionnaire).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                return (
                  <div key={key} className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {questionnaireLabels[key] || key}
                    </p>
                    <p className="text-sm font-medium">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No questionnaire data yet. Complete the questionnaire from your dashboard.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Certificate Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-primary" />
            Certificate Verification History
          </CardTitle>
          <CardDescription>Your certificate verification records.</CardDescription>
        </CardHeader>
        <CardContent>
          {certHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No certificate verifications yet. Go to Certification page to verify certificates.
            </p>
          ) : (
            <div className="space-y-2">
              {certHistory.map((cert, i) => (
                <div key={cert.id}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center gap-3">
                    {cert.status === "verified" ? (
                      <BadgeCheck className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{cert.certificate_id}</p>
                      <p className="text-xs text-muted-foreground">{cert.holder_name} · {cert.provider}</p>
                    </div>
                    <span className={`text-xs font-medium ${cert.status === "verified" ? "text-success" : "text-destructive"}`}>
                      {cert.status === "verified" ? "✅ Verified" : "❌ Not Verified"}
                    </span>
                    <span className="text-xs text-muted-foreground">{new Date(cert.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
