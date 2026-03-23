import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

const docs = [
  { name: "NSDC Certificate – Tailoring", type: "Certificate", uploaded: "Jan 15, 2026", verified: true },
  { name: "Aadhaar Card", type: "ID Proof", uploaded: "Dec 10, 2025", verified: true },
  { name: "Business Registration", type: "Document", uploaded: "Feb 5, 2026", verified: false },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your certificates and proofs.</p>
        </div>
        <Button onClick={() => toast.info("File upload coming soon!")}><Upload className="mr-2 h-4 w-4" />Upload</Button>
      </div>

      <div className="space-y-3">
        {docs.map((d, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{d.name}</p>
                  {d.verified && <BadgeCheck className="h-4 w-4 text-success" />}
                </div>
                <p className="text-xs text-muted-foreground">{d.type} · Uploaded {d.uploaded}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${d.verified ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {d.verified ? "Verified" : "Pending"}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
