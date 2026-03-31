import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, MapPin, Sparkles, Save, Loader2 } from "lucide-react";

const MAX_NAME = 100;
const MAX_LOCATION = 150;
const MAX_INTEREST = 500;

export default function ProfilePage() {
  const { user, profile, roles } = useAuth();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setLocation(profile.location ?? "");
      setInterest(profile.interest ?? "");
    }
  }, [profile]);

  const handleChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setDirty(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }
    if (trimmedName.length > MAX_NAME) {
      toast.error(`Name must be under ${MAX_NAME} characters`);
      return;
    }
    if (location.trim().length > MAX_LOCATION) {
      toast.error(`Location must be under ${MAX_LOCATION} characters`);
      return;
    }
    if (interest.trim().length > MAX_INTEREST) {
      toast.error(`Interests must be under ${MAX_INTEREST} characters`);
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: trimmedName,
        location: location.trim(),
        interest: interest.trim(),
      })
      .eq("user_id", user!.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to update profile. Please try again.");
      return;
    }
    toast.success("Profile updated successfully!");
    setDirty(false);
  };

  const roleLabels: Record<string, string> = {
    user: "User",
    seller: "Seller",
    mentor: "Mentor",
    admin: "Admin",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
      </div>

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
            <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label htmlFor="name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleChange(setName)}
              placeholder="Your full name"
              maxLength={MAX_NAME}
            />
            <p className="text-xs text-muted-foreground text-right">{name.length}/{MAX_NAME}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="location" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={handleChange(setLocation)}
              placeholder="City, State"
              maxLength={MAX_LOCATION}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="interest" className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Interests
            </Label>
            <Textarea
              id="interest"
              value={interest}
              onChange={handleChange(setInterest)}
              placeholder="Tailoring, Business, Digital Marketing..."
              maxLength={MAX_INTEREST}
              rows={3}
            />
            <p className="text-xs text-muted-foreground text-right">{interest.length}/{MAX_INTEREST}</p>
          </div>

          <Button onClick={handleSave} disabled={saving || !dirty} className="w-full sm:w-auto">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
