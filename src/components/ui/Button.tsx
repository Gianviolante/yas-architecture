// Figma Design System node 107:724
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined" | "text";
  children: React.ReactNode;
}

export default function Button({
  variant = "filled",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-5 h-10 text-sm font-medium transition-colors",
        variant === "filled" && "bg-black text-white hover:bg-gray-800",
        variant === "outlined" && "border border-black text-black hover:bg-gray-50",
        variant === "text" && "text-black underline-offset-2 hover:underline",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
