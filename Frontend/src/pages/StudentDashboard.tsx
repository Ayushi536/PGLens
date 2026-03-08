import { Home, Heart, CheckCircle, MessageSquare, Search, User } from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { pgListings } from "@/lib/pgData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Saved PGs", icon: Heart, path: "/dashboard/saved" },
  { label: "Verify Residency", icon: CheckCircle, path: "/dashboard/verify" },
  { label: "Write Review", icon: MessageSquare, path: "/dashboard/review" },
  { label: "Profile", icon: User, path: "/dashboard/profile" },
];

const StudentHome = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Saved PGs" value={3} icon={Heart} subtitle="2 new this week" trend="50% more" trendUp />
      <StatCard title="Reviews Written" value={2} icon={MessageSquare} subtitle="Last review 3 days ago" />
      <StatCard title="Residency Status" value="Verified" icon={CheckCircle} subtitle="Since Jan 2024" />
      <StatCard title="PGs Explored" value={18} icon={Search} trend="12 this month" trendUp />
    </div>

    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Quick Search</h2>
        <Link to="/explore">
          <Button size="sm" variant="default">Explore All</Button>
        </Link>
      </div>
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search PGs near you..."
          className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Recently Viewed</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pgListings.slice(0, 3).map((pg) => (
          <motion.div key={pg.id} whileHover={{ y: -4 }} className="rounded-xl border border-border overflow-hidden transition-shadow hover:shadow-md">
            <img src={pg.images[0]} alt={pg.name} className="h-32 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{pg.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {pg.location}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-bold text-foreground">₹{pg.price.toLocaleString()}</span>
                <Link to={`/pg/${pg.id}`}>
                  <Button size="sm" variant="default">View</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const SavedPGs = () => (
  <div className="space-y-4">
    <h2 className="text-lg font-bold text-foreground">Your Saved PGs</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pgListings.slice(0, 3).map((pg) => (
        <motion.div key={pg.id} whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all">
          <div className="relative">
            <img src={pg.images[0]} alt={pg.name} className="h-40 w-full object-cover" />
            <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-destructive">
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-foreground">{pg.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {pg.location}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-extrabold text-foreground">₹{pg.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
              <Link to={`/pg/${pg.id}`}><Button size="sm">View</Button></Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const VerifyResidency = () => (
  <div className="max-w-lg space-y-6">
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground">Residency Verification</h2>
      <p className="mt-1 text-sm text-muted-foreground">Upload proof of your current residency to unlock review features.</p>
      <div className="mt-6 rounded-xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">Drag & drop your proof document or</p>
        <Button variant="default" size="sm" className="mt-3">Choose File</Button>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Status:</span>
        <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">Pending</span>
      </div>
    </div>
  </div>
);

const WriteReview = () => (
  <div className="max-w-2xl space-y-6">
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold text-foreground">Write a Review</h2>
      <p className="mt-1 text-sm text-muted-foreground">Share your honest experience to help others.</p>
      <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Your Review</label>
          <textarea rows={4} placeholder="Describe your experience..." className="w-full rounded-xl border border-border bg-secondary/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {["Hygiene", "Food", "Safety", "Amenities"].map((cat) => (
            <div key={cat} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{cat} Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} className="text-border hover:text-primary transition-colors">
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" defaultChecked id="anon" className="accent-primary" />
          <label htmlFor="anon" className="text-sm text-foreground">Post anonymously</label>
        </div>
        <Button type="submit" size="lg" className="w-full">Submit Review</Button>
      </form>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="max-w-lg space-y-6">
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">S</div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Student User</h2>
          <p className="text-sm text-muted-foreground">student@example.com</p>
          <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Student / Professional</span>
        </div>
      </div>
    </div>
  </div>
);

const StudentDashboard = () => (
  <DashboardLayout items={sidebarItems} title="Student Dashboard">
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="saved" element={<SavedPGs />} />
      <Route path="verify" element={<VerifyResidency />} />
      <Route path="review" element={<WriteReview />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </DashboardLayout>
);

export default StudentDashboard;
