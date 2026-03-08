import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PGCard from "@/components/PGCard";
import { pgListings } from "@/lib/pgData";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Explore = () => {
  const [budget, setBudget] = useState([3000, 20000]);
  const [minHygiene, setMinHygiene] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [acRequired, setAcRequired] = useState(false);
  const [foodIncluded, setFoodIncluded] = useState(false);
  const [roomType, setRoomType] = useState("All");
  const [sort, setSort] = useState("best");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = pgListings.filter((pg) => {
      if (pg.price < budget[0] || pg.price > budget[1]) return false;
      if (pg.hygiene < minHygiene) return false;
      if (verifiedOnly && !pg.verified) return false;
      if (acRequired && !pg.hasAC) return false;
      if (foodIncluded && !pg.foodIncluded) return false;
      if (roomType !== "All" && pg.roomType !== roomType) return false;
      return true;
    });

    switch (sort) {
      case "best": result.sort((a, b) => b.overallScore - a.overallScore); break;
      case "closest": result.sort((a, b) => a.distance - b.distance); break;
      case "price": result.sort((a, b) => a.price - b.price); break;
      case "transparent": result.sort((a, b) => b.pricingFairness - a.pricingFairness); break;
    }
    return result;
  }, [budget, minHygiene, verifiedOnly, acRequired, foodIncluded, roomType, sort]);

  const resetFilters = useCallback(() => {
    setBudget([3000, 20000]);
    setMinHygiene(0);
    setVerifiedOnly(false);
    setAcRequired(false);
    setFoodIncluded(false);
    setRoomType("All");
  }, []);

  const handleHygieneChange = useCallback((v: number[]) => setMinHygiene(v[0]), []);

  const filterContent = (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Filters</h3>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Budget Range
        </label>
        <div className="flex items-center justify-between text-xs font-semibold text-primary">
          <span>₹{budget[0].toLocaleString()}</span>
          <span>₹{budget[1].toLocaleString()}</span>
        </div>
        <Slider
          min={3000}
          max={20000}
          step={500}
          value={budget}
          onValueChange={setBudget}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>₹3,000</span>
          <span>₹20,000</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Min Hygiene Score</label>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{minHygiene}%</span>
        </div>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[minHygiene]}
          onValueChange={handleHygieneChange}
        />
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Room Type</label>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger className="border-border bg-secondary/50 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Double">Double</SelectItem>
            <SelectItem value="Triple">Triple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-foreground">Verified PG Only</label>
          <Switch checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-foreground">AC Required</label>
          <Switch checked={acRequired} onCheckedChange={setAcRequired} />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm text-foreground">Food Included</label>
          <Switch checked={foodIncluded} onCheckedChange={setFoodIncluded} />
        </div>
      </div>

      <Button
        variant="hero-outline"
        onClick={resetFilters}
        className="w-full"
        size="default"
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-extrabold text-foreground md:text-3xl">
            Find Your Perfect PG
          </h1>
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
          >
            <Filter className="h-4 w-4 text-primary" />
            Filters
          </button>
        </motion.div>

        <div className="mt-6 flex gap-8">
          {/* Desktop filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              {filterContent}
            </motion.div>
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-full w-80 max-w-[85vw] overflow-y-auto bg-card p-6 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">Filters</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)} className="rounded-xl">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  {filterContent}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-5"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> PGs found
              </p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-48 border-border bg-card rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best Rated</SelectItem>
                  <SelectItem value="closest">Closest</SelectItem>
                  <SelectItem value="price">Price Low to High</SelectItem>
                  <SelectItem value="transparent">Most Transparent</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <div className="space-y-4">
              {filtered.map((pg, i) => (
                <PGCard key={pg.id} pg={pg} index={i} />
              ))}
            </div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center"
              >
                <Filter className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-4 text-lg font-medium text-muted-foreground">No PGs found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
                <Button variant="hero-outline" size="sm" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
