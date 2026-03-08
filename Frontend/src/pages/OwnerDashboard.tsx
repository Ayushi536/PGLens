import { Home, Building, BarChart3, MessageSquare, Plus, User, Star, Edit, Trash2, Eye } from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { pgListings } from "@/lib/pgData";

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/owner" },
  { label: "My Listings", icon: Building, path: "/owner/listings" },
  { label: "Add PG", icon: Plus, path: "/owner/add" },
  { label: "Analytics", icon: BarChart3, path: "/owner/analytics" },
  { label: "Reviews", icon: MessageSquare, path: "/owner/reviews" },
  { label: "Profile", icon: User, path: "/owner/profile" },
];

const OwnerHome = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Listings" value={3} icon={Building} trend="1 new this month" trendUp />
      <StatCard title="Avg Rating" value="4.2" icon={Star} subtitle="Across all PGs" trend="0.3 up" trendUp />
      <StatCard title="Total Views" value={1240} icon={Eye} trend="18% increase" trendUp />
      <StatCard title="Reviews" value={8} icon={MessageSquare} subtitle="2 pending reply" />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Listing Performance</h2>
        <div className="space-y-4">
          {pgListings.slice(0, 3).map((pg) => (
            <div key={pg.id} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
              <div className="flex items-center gap-3">
                <img src={pg.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{pg.name}</p>
                  <p className="text-xs text-muted-foreground">Score: {pg.overallScore}</p>
                </div>
              </div>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Active</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Reviews</h2>
        <div className="space-y-3">
          {[
            { text: "Great place! Clean and well-maintained.", rating: 5, date: "2 days ago" },
            { text: "Good value but food could improve.", rating: 3, date: "5 days ago" },
            { text: "Excellent WiFi and friendly staff.", rating: 4, date: "1 week ago" },
          ].map((r, i) => (
            <div key={i} className="rounded-xl bg-secondary/30 p-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-primary text-primary" : "text-border"}`} />
                ))}
                <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MyListings = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">My PG Listings</h2>
      <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add New PG</Button>
    </div>
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <th className="px-4 py-3 text-left font-semibold text-foreground">PG Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Avg Rating</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Price</th>
            <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pgListings.slice(0, 3).map((pg) => (
            <tr key={pg.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={pg.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="font-medium text-foreground">{pg.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">Approved</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-foreground">{(pg.overallScore / 20).toFixed(1)}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">₹{pg.price.toLocaleString()}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AddPG = () => (
  <div className="max-w-2xl space-y-6">
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground">Add New PG</h2>
      <p className="mt-1 text-sm text-muted-foreground">Fill in the details to list your PG.</p>
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">PG Name</label>
            <input className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Enter PG name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Location</label>
            <input className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Area, City" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Monthly Rent (₹)</label>
            <input type="number" className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="8000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Room Type</label>
            <select className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 text-sm text-foreground focus:border-primary focus:outline-none">
              <option>Single</option><option>Double</option><option>Triple</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Amenities</label>
          <div className="grid grid-cols-3 gap-2">
            {["WiFi", "AC", "Meals", "Laundry", "Parking", "Security", "Gym", "Hot Water", "TV"].map((a) => (
              <label key={a} className="flex items-center gap-2 rounded-lg border border-border p-2 text-sm hover:bg-secondary/30 cursor-pointer transition-colors">
                <input type="checkbox" className="accent-primary" /> {a}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Images</label>
          <div className="rounded-xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center">
            <p className="text-sm text-muted-foreground">Drag & drop images or <span className="text-primary cursor-pointer">browse</span></p>
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full">Submit Listing</Button>
      </form>
    </div>
  </div>
);

const OwnerAnalytics = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard title="Hygiene Trend" value="92%" icon={BarChart3} trend="3% improvement" trendUp />
      <StatCard title="Pricing Badge" value="Fair" icon={Building} subtitle="Competitive pricing" />
      <StatCard title="Complaint Rate" value="2%" icon={MessageSquare} trend="1% down" trendUp />
    </div>
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Rating Breakdown</h2>
      <div className="space-y-3">
        {[
          { label: "Hygiene", value: 92 },
          { label: "Food Quality", value: 85 },
          { label: "Safety", value: 90 },
          { label: "Amenities", value: 82 },
          { label: "Value for Money", value: 88 },
        ].map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{item.label}</span>
              <span className="font-semibold text-foreground">{item.value}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-full rounded-full bg-success"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const OwnerReviews = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Resident Reviews</h2>
    {pgListings[0].reviews.map((r, i) => (
      <div key={i} className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{r.author}</span>
            {r.verified && <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">Verified</span>}
          </div>
          <span className="text-xs text-muted-foreground">{r.date}</span>
        </div>
        <div className="mt-1 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={`h-4 w-4 ${j < r.rating ? "fill-primary text-primary" : "text-border"}`} />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
        {r.ownerReply ? (
          <div className="mt-3 ml-4 rounded-lg border-l-2 border-primary bg-primary/5 p-3">
            <span className="text-xs font-medium text-primary">Your Reply</span>
            <p className="mt-1 text-sm text-muted-foreground">{r.ownerReply}</p>
          </div>
        ) : (
          <div className="mt-3">
            <textarea placeholder="Write a reply..." rows={2} className="w-full rounded-xl border border-border bg-secondary/50 p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            <Button size="sm" className="mt-2">Reply</Button>
          </div>
        )}
      </div>
    ))}
  </div>
);

const OwnerProfile = () => (
  <div className="max-w-lg">
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">O</div>
        <div>
          <h2 className="text-lg font-bold text-foreground">PG Owner</h2>
          <p className="text-sm text-muted-foreground">owner@example.com</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">PG Owner</span>
        </div>
      </div>
    </div>
  </div>
);

const OwnerDashboard = () => (
  <DashboardLayout items={sidebarItems} title="Owner Dashboard">
    <Routes>
      <Route index element={<OwnerHome />} />
      <Route path="listings" element={<MyListings />} />
      <Route path="add" element={<AddPG />} />
      <Route path="analytics" element={<OwnerAnalytics />} />
      <Route path="reviews" element={<OwnerReviews />} />
      <Route path="profile" element={<OwnerProfile />} />
      <Route path="*" element={<Navigate to="/owner" replace />} />
    </Routes>
  </DashboardLayout>
);

export default OwnerDashboard;
