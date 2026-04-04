import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MapPin, Search, CheckCircle, XCircle, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";
import { MOCK_MENTOR_REQUESTS, type MentorRequest } from "@/data/mockDatabase";

export default function MentorRequestsPage() {
  const [requests, setRequests] = useState<MentorRequest[]>([...MOCK_MENTOR_REQUESTS]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = requests.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userInterest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const acceptRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "accepted" as const } : r));
    toast.success("Mentee request accepted! 🎉");
  };

  const rejectRequest = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r));
    toast.info("Request declined.");
  };

  const pending = requests.filter(r => r.status === "pending").length;
  const accepted = requests.filter(r => r.status === "accepted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Mentee Requests</h1>
        <p className="text-muted-foreground">Review and manage mentorship requests from users.</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-warm">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-accent">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{accepted}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{requests.length}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or interest..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Request Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(req => (
          <Card key={req.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {req.userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{req.userName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {req.userCity}, {req.userState}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={req.status === "accepted" ? "default" : req.status === "rejected" ? "destructive" : "outline"}
                  className="capitalize"
                >
                  {req.status}
                </Badge>
              </div>

              <div className="mb-3">
                <Badge variant="secondary" className="mb-2">{req.userInterest}</Badge>
                <p className="text-sm text-muted-foreground">{req.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{req.createdAt}</span>
                {req.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-accent" onClick={() => acceptRequest(req.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => rejectRequest(req.id)}>
                      <XCircle className="h-4 w-4 mr-1" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No requests found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
