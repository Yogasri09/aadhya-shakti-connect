import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, ShoppingBag, Landmark, Trash2, CheckCircle, XCircle, Search, UserCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "mentor" | "admin";
  status: "active" | "suspended";
  joined: string;
  location: string;
}

interface Seller {
  id: string;
  name: string;
  products: number;
  status: "pending" | "approved" | "rejected";
  applied: string;
}

const mockUsers: User[] = [
  { id: "1", name: "Priya Sharma", email: "priya@email.com", role: "user", status: "active", joined: "2025-11-10", location: "Delhi" },
  { id: "2", name: "Anita Verma", email: "anita@email.com", role: "seller", status: "active", joined: "2025-12-01", location: "Mumbai" },
  { id: "3", name: "Kavitha R", email: "kavitha@email.com", role: "mentor", status: "active", joined: "2026-01-15", location: "Chennai" },
  { id: "4", name: "Meena Devi", email: "meena@email.com", role: "user", status: "active", joined: "2026-02-20", location: "Jaipur" },
  { id: "5", name: "Sunita Yadav", email: "sunita@email.com", role: "user", status: "suspended", joined: "2026-01-05", location: "Lucknow" },
  { id: "6", name: "Rekha Gupta", email: "rekha@email.com", role: "seller", status: "active", joined: "2026-03-01", location: "Kolkata" },
  { id: "7", name: "Lakshmi N", email: "lakshmi@email.com", role: "user", status: "active", joined: "2026-03-10", location: "Hyderabad" },
  { id: "8", name: "Deepa Mishra", email: "deepa@email.com", role: "mentor", status: "active", joined: "2025-10-20", location: "Pune" },
];

const mockSellers: Seller[] = [
  { id: "s1", name: "Anita Verma", products: 8, status: "approved", applied: "2025-12-01" },
  { id: "s2", name: "Rekha Gupta", products: 3, status: "pending", applied: "2026-03-01" },
  { id: "s3", name: "Fatima Khan", products: 0, status: "pending", applied: "2026-03-20" },
  { id: "s4", name: "Geeta Patel", products: 5, status: "rejected", applied: "2026-02-15" },
];

const schemes = [
  { id: "sc1", name: "PMMY - Mudra Loan", status: "active", applications: 234 },
  { id: "sc2", name: "Stand-Up India", status: "active", applications: 189 },
  { id: "sc3", name: "PMEGP", status: "active", applications: 156 },
  { id: "sc4", name: "Startup India", status: "active", applications: 98 },
  { id: "sc5", name: "Mahila E-Haat", status: "active", applications: 312 },
  { id: "sc6", name: "DDU-GKY", status: "active", applications: 145 },
  { id: "sc7", name: "Skill India", status: "active", applications: 267 },
  { id: "sc8", name: "TN Women Dev Scheme", status: "active", applications: 78 },
];

const roleColor: Record<string, string> = {
  user: "bg-muted text-muted-foreground",
  seller: "bg-primary/10 text-primary",
  mentor: "bg-accent/10 text-accent",
  admin: "bg-destructive/10 text-destructive",
};

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers);
  const [sellers, setSellers] = useState(mockSellers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

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
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" as const } : s));
    toast.success("Seller rejected");
  };

  const stats = [
    { icon: Users, label: "Total Users", value: users.length, color: "text-primary" },
    { icon: ShoppingBag, label: "Pending Sellers", value: sellers.filter(s => s.status === "pending").length, color: "text-warm" },
    { icon: Landmark, label: "Active Schemes", value: schemes.length, color: "text-accent" },
    { icon: AlertTriangle, label: "Suspended", value: users.filter(u => u.status === "suspended").length, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users, sellers, and schemes.</p>
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
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sellers">Seller Approvals</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(u => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge variant="outline" className={roleColor[u.role]}>{u.role}</Badge></TableCell>
                      <TableCell>{u.location}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === "active" ? "default" : "destructive"}>
                          {u.status}
                        </Badge>
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
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.products}</TableCell>
                      <TableCell className="text-muted-foreground">{s.applied}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "approved" ? "default" : s.status === "rejected" ? "destructive" : "outline"}>
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

        <TabsContent value="schemes" className="space-y-4">
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scheme Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemes.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><Badge>{s.status}</Badge></TableCell>
                      <TableCell>{s.applications}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
