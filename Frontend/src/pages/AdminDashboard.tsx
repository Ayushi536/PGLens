import { Home, Building, Users, Shield, AlertTriangle, CheckCircle, MessageSquare, Flag, Eye, XCircle } from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { pgListings } from "@/lib/pgData";
import { motion } from "framer-motion";

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/admin" },
  { label: "PG Approvals", icon: CheckCircle, path: "/admin/approvals" },
  { label: "Verify Residents", icon: Users, path: "/admin/residents" },
  { label: "Review Moderation", icon: Flag, path: "/admin/moderation" },
];

const AdminHome = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total PGs" value={pgListings.length} icon={Building} trend="2 new this week" trendUp />
      <StatCard title="Pending Approvals" value={3} icon={AlertTriangle} subtitle="Needs attention" />
      <StatCard title="Verified Residents" value={245} icon={Users} trend="12 this month" trendUp />
      <StatCard title="Flagged Alerts" value={2} icon={Flag} subtitle="Review required" />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Recent PG Submissions</h2>
        <div className="space-y-3">
          {["Green Valley PG", "City Heights", "Campus Corner"].map((name, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">Submitted {i + 1} day(s) ago</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="default" className="h-8 gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-destructive gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Platform Health</h2>
        <div className="space-y-3">
          {[
            { label: "Average PG Score", value: 84, color: "bg-success" },
            { label: "Review Authenticity", value: 96, color: "bg-success" },
            { label: "Price Fairness Index", value: 78, color: "bg-primary" },
            { label: "Response Rate", value: 91, color: "bg-success" },
          ].map((m) => (
            <div key={m.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{m.label}</span>
                <span className="font-semibold text-foreground">{m.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${m.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PGApprovals = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">PG Approval Queue</h2>
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-4 py-3 text-left font-semibold text-foreground">PG Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Owner</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">AI Risk Flag</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "Green Valley PG", owner: "Rajesh Kumar", risk: "Low" },
            { name: "City Heights", owner: "Priya Verma", risk: "Medium" },
            { name: "Campus Corner", owner: "Amit Shah", risk: "High" },
          ].map((pg) => (
            <tr key={pg.name} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{pg.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{pg.owner}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  pg.risk === "Low" ? "bg-success/10 text-success" :
                  pg.risk === "Medium" ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                }`}>{pg.risk}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="h-8">Approve</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-destructive">Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const VerifyResidents = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Residency Verification Requests</h2>
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-4 py-3 text-left font-semibold text-foreground">Student</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">PG Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Proof</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { student: "Student #1042", pg: "Elite Stay", proof: "Rent receipt" },
            { student: "Student #1089", pg: "Metro Living", proof: "Agreement" },
            { student: "Student #1103", pg: "Sunshine PG", proof: "ID + Receipt" },
          ].map((r) => (
            <tr key={r.student} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{r.student}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.pg}</td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-primary"><Eye className="h-3.5 w-3.5" /> View</Button>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" className="h-8">Approve</Button>
                  <Button size="sm" variant="ghost" className="h-8 text-destructive">Reject</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ReviewModeration = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Flagged Reviews</h2>
    {[
      { pg: "GreenView Residency", review: "This place is terrible! Worst experience ever. Don't go here!!!", reason: "Potentially abusive language", author: "Anonymous" },
      { pg: "Cozy Corner PG", review: "Fake PG. They scam students. Complete fraud.", reason: "Unverified claims", author: "Anonymous" },
    ].map((r, i) => (
      <div key={i} className="rounded-2xl border border-destructive/20 bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">{r.pg}</span>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                <Flag className="inline h-3 w-3 mr-1" />Flagged
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">By: {r.author} • Reason: {r.reason}</p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-secondary/30 p-3 text-sm text-muted-foreground italic">"{r.review}"</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="ghost" className="h-8">Keep</Button>
          <Button size="sm" variant="ghost" className="h-8 text-destructive">Remove Review</Button>
          <Button size="sm" variant="ghost" className="h-8 text-warning">Warn User</Button>
        </div>
      </div>
    ))}
  </div>
);

const AdminDashboard = () => (
  <DashboardLayout items={sidebarItems} title="Admin Panel">
    <Routes>
      <Route index element={<AdminHome />} />
      <Route path="approvals" element={<PGApprovals />} />
      <Route path="residents" element={<VerifyResidents />} />
      <Route path="moderation" element={<ReviewModeration />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </DashboardLayout>
);

export default AdminDashboard;
