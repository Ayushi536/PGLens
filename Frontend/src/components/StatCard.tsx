import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendUp }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-extrabold text-foreground">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={`mt-2 text-xs font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
