import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    // Dashboard will handle first-login questionnaire check via AuthContext
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 hero-gradient items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <h1 className="text-4xl mb-4">Welcome Back to Aadhya</h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Continue your journey towards financial independence with skills, support, and smart opportunities.
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
          <h2 className="text-2xl font-serif mb-2">Log In</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your credentials to access your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button id="login-submit" type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Log In"}</Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
