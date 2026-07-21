import { motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClick: () => void;
}

export default function AnimatedHamburger({ isOpen, onClick }: Props) {
  return (
    <motion.button
      className="md:hidden p-2 -ml-2 flex items-center justify-center w-12 h-12"
      onClick={onClick}
      aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
      type="button"
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Top line → diagonal top-left to bottom-right of X */}
        <motion.line
          x1="12"
          y1="15"
          x2="36"
          y2="15"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            x1: isOpen ? 10 : 12,
            y1: isOpen ? 10 : 15,
            x2: isOpen ? 38 : 36,
            y2: isOpen ? 38 : 15,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ originX: "50%", originY: "50%" }}
        />

        {/* Bottom line → diagonal top-right to bottom-left of X */}
        <motion.line
          x1="12"
          y1="33"
          x2="36"
          y2="33"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            x1: isOpen ? 38 : 12,
            y1: isOpen ? 10 : 33,
            x2: isOpen ? 10 : 36,
            y2: isOpen ? 38 : 33,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </svg>
    </motion.button>
  );
}
