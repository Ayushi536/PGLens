import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
}

const ScoreBar = ({ label, value, max = 100 }: ScoreBarProps) => {
  const pct = (value / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-success"
        />
      </div>
    </div>
  );
};

export default ScoreBar;
