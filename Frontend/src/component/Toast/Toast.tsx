import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // 💡 If copy-pasting to your local environment, feel free to change back to "framer-motion"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Play, Pause } from "lucide-react";
import { MessageType } from "../../Data/AppEnum"; // 💡 Adjust path to match your layout, e.g. "../../Data/AppEnum"

interface IToastProps {
  type: MessageType;
  message: string;
  duration: number; // in milliseconds
  onClose: () => void;
}

const toastConfigs = {
  [MessageType.Success]: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    borderL: "border-l-emerald-500",
    border: "border-emerald-100/80 dark:border-emerald-950/50",
    bg: "bg-white/90 dark:bg-zinc-900/95 shadow-emerald-100/20 dark:shadow-black/40",
    text: "text-zinc-800 dark:text-zinc-100",
    subText: "text-zinc-500 dark:text-zinc-400",
    bar: "bg-emerald-500",
    glow: "shadow-emerald-500/10",
  },
  [MessageType.Error]: {
    icon: AlertCircle,
    iconColor: "text-rose-500 dark:text-rose-400",
    borderL: "border-l-rose-500",
    border: "border-rose-100/80 dark:border-rose-950/50",
    bg: "bg-white/90 dark:bg-zinc-900/95 shadow-rose-100/20 dark:shadow-black/40",
    text: "text-zinc-800 dark:text-zinc-100",
    subText: "text-zinc-500 dark:text-zinc-400",
    bar: "bg-rose-500",
    glow: "shadow-rose-500/10",
  },
  [MessageType.Warning]: {
    icon: AlertTriangle,
    iconColor: "text-amber-500 dark:text-amber-400",
    borderL: "border-l-amber-500",
    border: "border-amber-100/80 dark:border-amber-950/50",
    bg: "bg-white/90 dark:bg-zinc-900/95 shadow-amber-100/20 dark:shadow-black/40",
    text: "text-zinc-800 dark:text-zinc-100",
    subText: "text-zinc-500 dark:text-zinc-400",
    bar: "bg-amber-500",
    glow: "shadow-amber-500/10",
  },
  [MessageType.Info]: {
    icon: Info,
    iconColor: "text-sky-500 dark:text-sky-400",
    borderL: "border-l-sky-500",
    border: "border-sky-100/80 dark:border-sky-950/50",
    bg: "bg-white/90 dark:bg-zinc-900/95 shadow-sky-100/20 dark:shadow-black/40",
    text: "text-zinc-800 dark:text-zinc-100",
    subText: "text-zinc-500 dark:text-zinc-400",
    bar: "bg-sky-500",
    glow: "shadow-sky-500/10",
  },
};

const Toast: React.FC<IToastProps> = ({ type, message, duration, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [startTime, setStartTime] = useState(Date.now());

  // Safe styling lookup fallback
  const config = toastConfigs[type] || toastConfigs[MessageType.Info];
  const IconComponent = config.icon;

  useEffect(() => {
    if (isPaused) return;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, timeRemaining - elapsed);
      const percentage = (remaining / duration) * 100;
      setProgress(percentage);

      if (remaining <= 0) {
        onClose();
      }
    };

    tick(); // Run initial tick immediately
    const intervalId = setInterval(tick, 10); // Update every 10ms for smooth fluid transition

    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused, startTime, timeRemaining, duration, onClose]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    // Capture remaining time precisely at hover instant
    const elapsed = Date.now() - startTime;
    setTimeRemaining((prev) => Math.max(0, prev - elapsed));
  };

  const handleMouseLeave = () => {
    setStartTime(Date.now());
    setIsPaused(false);
  };

  // Human-readable remaining time indicator
  const secondsLeft = (isPaused ? timeRemaining : Math.max(0, timeRemaining - (Date.now() - startTime))) / 1000;
  const formattedSeconds = secondsLeft.toFixed(1);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative mb-3 w-[calc(100vw-2rem)] sm:w-[22rem] max-w-full rounded-xl border ${config.border} border-l-4 ${config.borderL} ${config.bg} p-3.5 sm:p-4 shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl ${config.glow}`}
      id={`toast-card-${type}`}
    >
      <div className="flex gap-2.5 sm:gap-3 items-start">
        {/* Animated Icon Wrapper */}
        <div className="flex-shrink-0 pt-0.5 relative">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          {isPaused && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-0.5">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {type}
            </span>
            {/* Status indicators */}
            <span className="font-mono text-[9px] sm:text-[10px] tabular-nums text-zinc-450 bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded flex items-center gap-1">
              {isPaused ? (
                <>
                  <Pause className="h-[7px] w-[7px] sm:h-[8px] sm:w-[8px] text-amber-500 fill-amber-500" />
                  <span className="text-gray-400">PAUSED</span>
                </>
              ) : (
                <>
                  <Play className="h-[7px] w-[7px] sm:h-[8px] sm:w-[8px] text-emerald-500 fill-emerald-500 animate-pulse" />
                  <span className="text-gray-400">{formattedSeconds}s</span>
                </>
              )}
            </span>
          </div>
          <p className={`mt-1.5 text-xs sm:text-sm font-medium leading-relaxed ${config.text} break-words`}>
            {message}
          </p>
        </div>

        {/* Manual Dismiss Button */}
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="rounded-lg p-1.5 sm:p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            id={`dismiss-btn-${type}`}
            title="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Timeline Bar Track */}
      <div className="mt-3.5 h-[3px] w-full rounded-full bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden">
        <div
          className={`h-full ${config.bar} rounded-full transition-all duration-7 `}
          style={{ 
            width: `${progress}%`,
            transitionProperty: isPaused ? 'none' : 'width'
          }}
        />
      </div>
    </motion.div>
  );
};

export default Toast;