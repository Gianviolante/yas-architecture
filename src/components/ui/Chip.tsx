import { cn } from "@/lib/utils/cn";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "toggle";
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({
  children,
  variant = "default",
  isActive = false,
  onClick,
  className,
}: ChipProps) {
  if (variant === "toggle") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center border-2 rounded-full px-6 py-2.5 text-base leading-[1.375] transition-colors duration-200",
          isActive
            ? "bg-black border-black text-white"
            : "border-[#000] text-[#000] hover:bg-black hover:border-black hover:text-white",
          className
        )}
      >
        {children}
      </button>
    );
  }

  // default variant
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-[--foreground] rounded-full px-3.5 py-1 text-xs text-[--foreground] leading-[1.4] whitespace-nowrap",
        className
      )}
    >
      {children}
    </span>
  );
}
