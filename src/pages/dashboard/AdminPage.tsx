import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, ShoppingBag, Landmark, Trash2, CheckCircle, XCircle, Search,
  UserCheck, AlertTriangle, MapPin, TrendingUp, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";
import {
  MOCK_USERS, MOCK_SELLERS, MOCK_SCHEMES, MOCK_MENTORS,
  type MockUser, type MockSeller,
} from "@/data/mockDatabase";
import { getDemandByLocation, getSkillDemandForState } from "@/data/demandEngine";
import { INDIAN_STATES } from "@/data/locationData";

const roleColor: Record<string, string> = {
  user: "bg-muted text-muted-foreground",
  seller: "bg-primary/10 text-primary",
  mentor: "bg-accent/10 text-accent",
  admin: "bg-destructive/10 text-destructive",
};

export default function AdminPage() {
  const [users, setUsers] = useState<MockUser[]>([...MOCK_USERS]);
  const [sellers, setSellers] = useState<MockSeller[]>([...MOCK_SELLERS]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [analyticsState, setAnalyticsState] = useState("Tamil Nadu");

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesState = stateFilter === "all" || u.state === stateFilter;
    return matchesSearch && matchesRole && matchesState;
  });

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success("User removed successfully");
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "suspended" as const : "active" as const } : u));
    toast.success("User status updated");
  };

  const approveSeller = (id: string) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status: "approved" as const } : s));
    toast.success("Seller approved");
  };

  const rejectSeller = (id: string) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status: "pending" as const } : s));
    toast.success("Seller rejected");
  };

  const stats = [
    { icon: Users, label: "Total Users", value: users.length, color: "text-primary" },
    { icon: ShoppingBag, label: "Pending Sellers", value: sellers.filter(s => s.status === "pending").length, color: "text-warm" },
    { icon: UserCheck, label: "Active Mentors", value: MOCK_MENTORS.filter(m => m.status === "active").length, color: "text-accent" },
    { icon: AlertTriangle, label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "text-destructive" },
  ];

  const locationDemand = getDemandByLocation().slice(0, 8);
  const skillDemand = getSkillDemandForState(analyticsState);

  // Get unique states from users
  const userStates = Array.from(new Set(users.map(u => u.state))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, sellers, mentors, and view analytics.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sellers">Seller Approvals</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Analytics</TabsTrigger>
        </TabsList>

        {/* ── Users ── */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="State" /></SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="all">All States</SelectItem>
                {userStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                      <TableCell><Badge variant="outline" className={roleColor[u.role]}>{u.role}</Badge></TableCell>
                      <TableCell className="text-sm">{u.city}, {u.state}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.interest}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === "active" ? "default" : "destructive"}>{u.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.joined}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => toggleStatus(u.id)} title={u.status === "active" ? "Suspend" : "Activate"}>
                            {u.status === "active" ? <XCircle className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-accent" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteUser(u.id)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-3 border-t text-xs text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </Card>
        </TabsContent>

        {/* ── Seller Approvals ── */}
        <TabsContent value="sellers" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller Name</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm">{s.businessType}</TableCell>
                      <TableCell className="text-sm">{s.city}, {s.state}</TableCell>
                      <TableCell>{s.productCount}</TableCell>
                      <TableCell>⭐ {s.rating}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "active" ? "default" : s.status === "pending" ? "outline" : "destructive"}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {s.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" onClick={() => approveSeller(s.id)} className="text-accent">
                              <UserCheck className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => rejectSeller(s.id)} className="text-destructive">
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Mentors ── */}
        <TabsContent value="mentors" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mentor Name</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Mentees</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MENTORS.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-sm">{m.expertise}</TableCell>
                      <TableCell className="text-sm">{m.experience} years</TableCell>
                      <TableCell className="text-sm">{m.city}, {m.state}</TableCell>
                      <TableCell>{m.menteeCount}</TableCell>
                      <TableCell>⭐ {m.rating}</TableCell>
                      <TableCell>
                        <Badge variant={m.status === "active" ? "default" : "outline"}>{m.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Schemes ── */}
        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scheme Name</TableHead>
                    <TableHead>Ministry</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SCHEMES.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.ministry}</TableCell>
                      <TableCell className="text-sm">{s.category}</TableCell>
                      <TableCell>{s.applications.toLocaleString()}</TableCell>
                      <TableCell><Badge>{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ── Analytics ── */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-sans flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Location Demand Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={locationDemand.map(d => ({ state: d.state, course: d.courseDemand, product: d.productDemand, mentorship: d.mentorshipDemand }))} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="state" type="category" tick={{ fontSize: 9 }} width={110} />
                    <Tooltip />
                    <Bar dataKey="course" fill="hsl(24,85%,48%)" radius={[0, 2, 2, 0]} name="Courses" stackId="a" />
                    <Bar dataKey="product" fill="hsl(158,45%,42%)" radius={[0, 2, 2, 0]} name="Products" stackId="a" />
                    <Bar dataKey="mentorship" fill="hsl(35,60%,52%)" radius={[0, 4, 4, 0]} name="Mentorship" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-sans flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" /> State Drill-Down
                  </CardTitle>
                  <Select value={analyticsState} onValueChange={setAnalyticsState}>
                    <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {INDIAN_STATES.filter(s => [
                        "Tamil Nadu", "Maharashtra", "Rajasthan", "Gujarat", "Kerala",
                        "Karnataka", "Uttar Pradesh", "West Bengal", "Delhi", "Bihar",
                      ].includes(s)).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillDemand}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                    <XAxis dataKey="skill" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} name="Demand Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Demand Insight Cards */}
          <Card>
            <CardHeader><CardTitle className="text-lg font-sans">📍 Demand Insights by Location</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {locationDemand.slice(0, 6).map(d => (
                  <div key={d.state} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{d.state}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs"><span className="text-muted-foreground">High demand:</span> {d.topSkills[0]}</p>
                      <p className="text-xs"><span className="text-muted-foreground">Trending:</span> {d.topBusinessTypes[0]}</p>
                      <p className="text-xs"><span className="text-muted-foreground">Top course:</span> {d.trendingCourses[0]}</p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">📚 {d.courseDemand}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">🛒 {d.productDemand}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm/10 text-warm">🧑‍🏫 {d.mentorshipDemand}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
