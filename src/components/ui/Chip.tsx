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
          "inline-flex items-center border-2 rounded-[100px] px-[24px] py-[10px] text-[16px] leading-[22px] transition-colors duration-200",
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
        "inline-flex items-center border-2 border-[--foreground] rounded-[100px] px-[14px] py-[4px] text-[12px] text-[--foreground] leading-[1.4] whitespace-nowrap",
        className
      )}
    >
      {children}
    </span>
  );
}
