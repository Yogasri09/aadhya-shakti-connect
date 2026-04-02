import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, XCircle, Search, History, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CertRecord {
  id: string;
  certificate_id: string;
  holder_name: string | null;
  provider: string | null;
  status: string;
  verified_at: string | null;
  created_at: string;
}

const mockCerts: Record<string, { name: string; authority: string; status: "Verified" | "Not Verified" }> = {
  "CERT-2025-001": { name: "Priya Sharma", authority: "NSDC – National Skill Development Corporation", status: "Verified" },
  "CERT-2025-002": { name: "Meena Devi", authority: "PMKVY – Kaushal Vikas Yojana", status: "Verified" },
  "CERT-2025-003": { name: "Unknown", authority: "Unknown", status: "Not Verified" },
  "CERT-2025-004": { name: "Sunita Patil", authority: "KVIC – Khadi Board", status: "Verified" },
  "CERT-2025-005": { name: "Roshni Kumari", authority: "NISE – National Institute of Solar Energy", status: "Verified" },
  "CERT-2026-001": { name: "Kavita Sharma", authority: "Google Digital Marketing", status: "Verified" },
  "CERT-2026-002": { name: "Anjali Devi", authority: "FSSAI – Food Safety Certificate", status: "Verified" },
};

export default function CertificationPage() {
  const { user } = useAuth();
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<typeof mockCerts[string] | null>(null);
  const [searched, setSearched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<CertRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch verification history
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setHistory(data as CertRecord[]);
      setLoadingHistory(false);
    };
    fetchHistory();
  }, [user]);

  const verify = async () => {
    if (!certId.trim()) return;
    const upperCertId = certId.trim().toUpperCase();
    const found = mockCerts[upperCertId] || { name: "—", authority: "—", status: "Not Verified" as const };
    setResult(found);
    setSearched(true);

    // Save to database
    if (user) {
      setSaving(true);
      const { error } = await supabase.from("certificates").insert({
        user_id: user.id,
        certificate_id: upperCertId,
        holder_name: found.name,
        provider: found.authority,
        status: found.status === "Verified" ? "verified" : "not_verified",
        verified_at: found.status === "Verified" ? new Date().toISOString() : null,
      });
      if (!error) {
        // Refresh history
        const { data } = await supabase
          .from("certificates")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setHistory(data as CertRecord[]);
        // Add notification
        await supabase.from("notifications").insert({
          user_id: user.id,
          title: found.status === "Verified" ? "Certificate Verified ✅" : "Certificate Not Verified ❌",
          description: `Certificate ${upperCertId} has been ${found.status === "Verified" ? "verified" : "marked as not verified"}.`,
          type: found.status === "Verified" ? "success" : "warning",
        });
        toast.success("Verification result saved to your profile");
      }
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Certificate Verification</h1>
        <p className="text-muted-foreground">Verify the authenticity of any certificate issued through our programs.</p>
      </div>

      {/* Verification Form */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Enter Certificate ID</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cert-verify-input"
                  placeholder="Enter Certificate ID (e.g., CERT-2025-001)"
                  value={certId}
                  onChange={e => setCertId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && verify()}
                  className="pl-9"
                />
              </div>
              <Button id="cert-verify-btn" onClick={verify} disabled={saving || !certId.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
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
              {result.status === "Verified" && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => window.open("https://www.nsdcindia.org/verify-certificate", "_blank")}>
                  View Official Verification
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Try: CERT-2025-001, CERT-2025-002, CERT-2026-001, CERT-2026-002
          </p>
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Verification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No verification history yet. Verify a certificate above.</p>
          ) : (
            <div className="space-y-2">
              {history.map((cert, i) => (
                <div key={cert.id}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center gap-3">
                    {cert.status === "verified" ? (
                      <BadgeCheck className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cert.certificate_id}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {cert.holder_name} · {cert.provider}
                      </p>
                    </div>
                    <span className={`text-xs font-medium ${cert.status === "verified" ? "text-success" : "text-destructive"}`}>
                      {cert.status === "verified" ? "Verified ✅" : "Not Verified ❌"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(cert.created_at).toLocaleDateString()}
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
