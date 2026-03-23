import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", location: "", interest: "", role: "user" });
  const navigate = useNavigate();
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error("Please fill in required fields"); return; }
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
            <div><Label>Full Name *</Label><Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Priya Sharma" /></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
            <div><Label>Password *</Label><Input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" /></div>
            <div><Label>Location</Label><Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="City, State" /></div>
            <div><Label>Interest</Label><Input value={form.interest} onChange={e => set("interest", e.target.value)} placeholder="Tailoring, Business, etc." /></div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => set("role", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
