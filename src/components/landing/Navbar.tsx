import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Stories", href: "#stories" },
  { label: "Schemes", href: "#schemes" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg font-serif">A</span>
          </div>
          <span className="font-serif text-xl tracking-tight">Aadhya</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild><Link to="/login">Log In</Link></Button>
          <Button asChild><Link to="/signup">Get Started</Link></Button>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-muted-foreground">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" asChild className="flex-1"><Link to="/login">Log In</Link></Button>
            <Button asChild className="flex-1"><Link to="/signup">Get Started</Link></Button>
          </div>
        </div>
      )}
    </nav>
  );
}
