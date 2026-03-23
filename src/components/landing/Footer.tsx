import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { label: "Features", href: "#features" },
    { label: "Training", href: "/dashboard/courses" },
    { label: "Schemes", href: "/dashboard/schemes" },
    { label: "Marketplace", href: "/dashboard/marketplace" },
  ],
  Government: [
    { label: "Skill India", href: "https://www.skillindia.gov.in", ext: true },
    { label: "MUDRA Yojana", href: "https://www.mudra.org.in", ext: true },
    { label: "Stand-Up India", href: "https://www.standupmitra.in", ext: true },
    { label: "Mahila E-Haat", href: "https://mahilaehaat-rmk.gov.in", ext: true },
  ],
  Support: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-secondary/30 py-12">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-serif">A</span>
              </div>
              <span className="font-serif text-lg">Aadhya</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering women through skills, support, and smart opportunities.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    {"ext" in l && l.ext ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </a>
                    ) : l.href.startsWith("/") ? (
                      <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 text-center text-xs text-muted-foreground">
          © 2026 Aadhya. Built for women empowerment. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
