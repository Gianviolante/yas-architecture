import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outlined";
  size?: "sm" | "md" | "lg";
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "outlined",
  size = "md",
  className,
  target,
  rel,
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center rounded-full transition-colors duration-200 whitespace-nowrap font-normal";

  const variantStyles = {
    outlined: "border-2 border-[--foreground] text-[--foreground] hover:bg-[#000] hover:text-white",
    primary: "bg-[--foreground] text-white hover:bg-black",
  };

  const sizeStyles = {
    sm: "text-xs leading-[1.375] px-5 py-2.5",
    md: "text-base leading-[1.375] px-6 py-2.5",
    lg: "text-lg leading-6 px-8 py-3",
  };

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
