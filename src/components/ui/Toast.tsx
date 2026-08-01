import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface ToastProps {
  show: boolean;
  onClose: () => void;
  message: string;
  variant?: "success" | "error";
  duration?: number;
  className?: string;
}

export default function Toast({
  show,
  onClose,
  message,
  variant = "success",
  duration = 3500,
  className,
}: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed bottom-[20px] left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg text-sm font-medium text-white pointer-events-auto",
            variant === "error" ? "bg-red-600" : "bg-green-600",
            className
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
