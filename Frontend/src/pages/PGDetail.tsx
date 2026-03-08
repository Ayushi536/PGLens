import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle, Heart, Share2, Star, MessageSquare, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreBadge from "@/components/ScoreBadge";
import ScoreBar from "@/components/ScoreBar";
import { pgListings } from "@/lib/pgData";
import { Button } from "@/components/ui/button";

const PGDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pg = pgListings.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!pg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">PG not found</h1>
          <Button onClick={() => navigate("/explore")} className="mt-4 bg-primary text-primary-foreground">
            Back to Explore
          </Button>
        </div>
      </div>
    );
  }

  const priceDiff = pg.price - pg.fairPrice;
  const pricePct = Math.abs(Math.round((priceDiff / pg.fairPrice) * 100));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-foreground">{pg.name}</h1>
              {pg.verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  <CheckCircle className="h-4 w-4" /> Verified
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {pg.location}
            </p>
          </div>
          <ScoreBadge score={pg.overallScore} size="lg" />
        </motion.div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Image gallery */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="overflow-hidden rounded-lg">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={pg.images[selectedImage]}
                  alt={pg.name}
                  className="h-72 w-full object-cover md:h-96"
                />
              </div>
              <div className="mt-3 flex gap-2">
                {pg.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-20 overflow-hidden rounded-md border-2 transition-all ${
                      i === selectedImage ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Transparency Scorecard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h2 className="text-xl font-bold text-foreground">Transparency Scorecard</h2>
              <div className="mt-4 space-y-4">
                <ScoreBar label="Hygiene" value={pg.hygiene} />
                <ScoreBar label="Food Quality" value={pg.foodQuality} />
                <ScoreBar label="Safety" value={pg.safety} />
                <ScoreBar label="Amenities" value={pg.amenitiesScore} />
                <ScoreBar label="Pricing Fairness" value={pg.pricingFairness} />
              </div>
            </motion.div>

            {/* Claim vs Reality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h2 className="text-xl font-bold text-foreground">Claim vs Reality</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="pb-3 text-left font-medium">Owner Claim</th>
                      <th className="pb-3 text-left font-medium">Avg Rating</th>
                      <th className="pb-3 text-right font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pg.claims.map((c) => (
                      <tr key={c.claim} className="border-b border-border last:border-0">
                        <td className="py-3 text-foreground">{c.claim}</td>
                        <td className="py-3">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-primary" /> {c.avgRating}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            c.status === "Match"
                              ? "border border-success/30 bg-success/10 text-success"
                              : c.status === "Slight Mismatch"
                              ? "border border-warning/30 bg-warning/10 text-warning"
                              : "border border-destructive/30 bg-destructive/10 text-destructive"
                          }`}>
                            {c.status === "Match" ? <CheckCircle className="h-3 w-3" /> : "✕"} {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Reviews ({pg.reviews.length})</h2>
                <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <MessageSquare className="h-4 w-4" /> Write Review
                </Button>
              </div>
              <div className="mt-4 divide-y divide-border">
                {pg.reviews.map((r, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{r.author}</span>
                        {r.verified && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">Verified</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${j < r.rating ? "fill-primary text-primary" : "text-border"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                    <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
                      <span>Hygiene: {r.hygiene}/5</span>
                      <span>Food: {r.food}/5</span>
                      <span>Safety: {r.safety}/5</span>
                      <span>Amenities: {r.amenities}/5</span>
                    </div>
                    {r.ownerReply && (
                      <div className="mt-3 ml-4 rounded-md border-l-2 border-primary pl-4">
                        <span className="text-xs font-medium text-primary">Owner Reply</span>
                        <p className="mt-1 text-sm text-muted-foreground">{r.ownerReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 space-y-4"
            >
              {/* Pricing card */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="text-3xl font-bold text-foreground">
                  ₹{pg.price.toLocaleString()} <span className="text-base font-normal text-muted-foreground">/month</span>
                </div>
                {priceDiff !== 0 && (
                  <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                    priceDiff > 0
                      ? "border border-warning/30 bg-warning/10 text-warning"
                      : "border border-success/30 bg-success/10 text-success"
                  }`}>
                    <TrendingDown className="h-3 w-3" /> {pricePct}% {priceDiff > 0 ? "above" : "below"} fair price
                  </span>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  Fair Price Estimate: ₹{pg.fairPrice.toLocaleString()}
                </p>

                <Button className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Contact Owner
                </Button>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2 border-border text-foreground">
                    <Heart className="h-4 w-4" /> Save
                  </Button>
                  <Button variant="outline" className="gap-2 border-border text-foreground">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>

              {/* Amenities */}
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground">Key Amenities</h3>
                <div className="mt-3 space-y-2">
                  {pg.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" /> {a}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PGDetail;
