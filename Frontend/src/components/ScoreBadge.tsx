import { motion } from "framer-motion";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const ScoreBadge = ({ score, size = "md" }: ScoreBadgeProps) => {
  const getColor = () => {
    if (score >= 85) return "text-success border-success";
    if (score >= 70) return "text-primary border-primary";
    return "text-destructive border-destructive";
  };

  const sizeClasses = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      className={`flex flex-col items-center justify-center rounded-full border-[3px] font-bold ${getColor()} ${sizeClasses[size]}`}
    >
      {score}
    </motion.div>
  );
};

export default ScoreBadge;
