import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, XCircle, Search, History, Upload } from "lucide-react";

interface CertResult {
  name: string;
  authority: string;
  status: "Verified" | "Not Verified";
}

const mockCerts: Record<string, CertResult> = {
  "CERT-2025-001": { name: "Priya Sharma", authority: "NSDC – National Skill Development Corporation", status: "Verified" },
  "CERT-2025-002": { name: "Meena Devi", authority: "PMKVY – Kaushal Vikas Yojana", status: "Verified" },
  "CERT-2025-003": { name: "Unknown", authority: "Unknown", status: "Not Verified" },
  "CERT-2025-004": { name: "Sunita Patil", authority: "KVIC – Khadi Board", status: "Verified" },
  "CERT-2025-005": { name: "Roshni Kumari", authority: "NISE – National Institute of Solar Energy", status: "Verified" },
  "CERT-2026-001": { name: "Kavita Sharma", authority: "Google Digital Marketing", status: "Verified" },
  "CERT-2026-002": { name: "Anjali Devi", authority: "FSSAI – Food Safety Certificate", status: "Verified" },
};

interface HistoryEntry {
  id: string;
  certId: string;
  result: CertResult;
  date: string;
}

export default function CertificationPage() {
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<CertResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const verify = () => {
    if (!certId.trim()) return;
    const upperCertId = certId.trim().toUpperCase();
    const found = mockCerts[upperCertId] || { name: "—", authority: "—", status: "Not Verified" as const };
    setResult(found);
    setSearched(true);
    setHistory(prev => [
      { id: crypto.randomUUID(), certId: upperCertId, result: found, date: new Date().toISOString() },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Certificate Verification</h1>
        <p className="text-muted-foreground">Verify the authenticity of any certificate issued through our programs.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Enter Certificate ID</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter Certificate ID (e.g., CERT-2025-001)"
                  value={certId}
                  onChange={e => setCertId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && verify()}
                  className="pl-9"
                />
              </div>
              <Button onClick={verify} disabled={!certId.trim()}>Verify</Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Upload className="h-3 w-3" />
            <span>Or upload a certificate image for verification (coming soon)</span>
          </div>

          {searched && result && (
            <div className={`p-4 rounded-lg border ${result.status === "Verified" ? "bg-success/5 border-success/20" : "bg-destructive/5 border-destructive/20"}`}>
              <div className="flex items-center gap-2 mb-3">
                {result.status === "Verified" ? <BadgeCheck className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                <span className={`font-semibold ${result.status === "Verified" ? "text-success" : "text-destructive"}`}>{result.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Certificate ID:</span> <span className="font-medium">{certId.trim().toUpperCase()}</span></div>
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{result.name}</span></div>
                <div><span className="text-muted-foreground">Issuing Authority:</span> <span className="font-medium">{result.authority}</span></div>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Try: CERT-2025-001, CERT-2025-002, CERT-2026-001, CERT-2026-002
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Verification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No verification history yet. Verify a certificate above.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry, i) => (
                <div key={entry.id}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center gap-3">
                    {entry.result.status === "Verified" ? (
                      <BadgeCheck className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.certId}</p>
                      <p className="text-xs text-muted-foreground truncate">{entry.result.name} · {entry.result.authority}</p>
                    </div>
                    <span className={`text-xs font-medium ${entry.result.status === "Verified" ? "text-success" : "text-destructive"}`}>
                      {entry.result.status === "Verified" ? "Verified ✅" : "Not Verified ❌"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
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
