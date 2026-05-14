// Filtri e badge categorie/stato — Figma Design System node 107:793
import { cn } from "@/lib/utils/cn";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, active, onClick, className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs border transition-colors",
        active
          ? "bg-black text-white border-black"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500",
        className
      )}
    >
      {label}
    </button>
  );
}
