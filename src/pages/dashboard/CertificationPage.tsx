import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgeCheck, XCircle, Search } from "lucide-react";

const mockCerts: Record<string, { name: string; authority: string; status: "Verified" | "Not Verified" }> = {
  "CERT-2025-001": { name: "Priya Sharma", authority: "NSDC – National Skill Development Corporation", status: "Verified" },
  "CERT-2025-002": { name: "Meena Devi", authority: "PMKVY – Kaushal Vikas Yojana", status: "Verified" },
  "CERT-2025-003": { name: "Unknown", authority: "Unknown", status: "Not Verified" },
};

export default function CertificationPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<typeof mockCerts[string] | null>(null);
  const [searched, setSearched] = useState(false);

  const verify = () => {
    if (!certId.trim()) return;
    setResult(mockCerts[certId.trim().toUpperCase()] || { name: "—", authority: "—", status: "Not Verified" });
    setSearched(true);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Certification Verification</h1>
        <p className="text-muted-foreground">Verify the authenticity of any certificate issued through our programs.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Enter Certificate ID (e.g., CERT-2025-001)" value={certId} onChange={e => setCertId(e.target.value)} onKeyDown={e => e.key === "Enter" && verify()} className="pl-9" />
            </div>
            <Button onClick={verify}>Verify</Button>
          </div>

          {searched && result && (
            <div className={`p-4 rounded-lg border ${result.status === "Verified" ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
              <div className="flex items-center gap-2 mb-3">
                {result.status === "Verified" ? <BadgeCheck className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                <span className={`font-semibold ${result.status === "Verified" ? "text-success" : "text-destructive"}`}>{result.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{result.name}</span></div>
                <div><span className="text-muted-foreground">Issuing Authority:</span> <span className="font-medium">{result.authority}</span></div>
              </div>
              {result.status === "Verified" && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => window.open("https://www.nsdcindia.org/verify-certificate", "_blank")}>
                  View Official Verification
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">Try: CERT-2025-001 or CERT-2025-002</p>
        </CardContent>
      </Card>
    </div>
  );
}
