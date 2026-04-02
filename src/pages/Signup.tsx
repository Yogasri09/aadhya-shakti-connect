import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { INDIAN_STATES } from "@/data/locationData";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    state: "", city: "", interest: "", role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.state) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.name.trim(),
          location: form.city ? `${form.city}, ${form.state}` : form.state,
          interest: form.interest.trim(),
          state: form.state,
          city: form.city.trim(),
          role: form.role,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! Welcome to Aadhya.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <h1 className="text-4xl mb-4">Join Aadhya Today</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Start your journey towards financial independence. Discover skills, schemes, mentors, and marketplace opportunities.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg font-serif">A</span>
            </div>
            <span className="font-serif text-xl">Aadhya</span>
          </Link>
          <h2 className="text-2xl font-serif mb-2">Create Account</h2>
          <p className="text-sm text-muted-foreground mb-6">Fill in your details to get started.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input id="signup-name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Priya Sharma" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input id="signup-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password *</Label>
              <div className="relative">
                <Input id="signup-password" type={showPassword ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && form.password.length < 6 && (
                <p className="text-xs text-destructive mt-1">Password must be at least 6 characters</p>
              )}
            </div>
            <div>
              <Label>Confirm Password *</Label>
              <div className="relative">
                <Input id="signup-confirm-password" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
            <div>
              <Label>State *</Label>
              <Select value={form.state} onValueChange={v => set("state", v)}>
                <SelectTrigger id="signup-state"><SelectValue placeholder="Select your state" /></SelectTrigger>
                <SelectContent className="max-h-60">
                  {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Input id="signup-city" value={form.city} onChange={e => set("city", e.target.value)} placeholder="Chennai, Coimbatore..." />
            </div>
            <div>
              <Label>Interest</Label>
              <Input id="signup-interest" value={form.interest} onChange={e => set("interest", e.target.value)} placeholder="Tailoring, Business, etc." />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => set("role", v)}>
                <SelectTrigger id="signup-role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button id="signup-submit" type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
