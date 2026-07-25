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
  const baseStyles = "flex items-center justify-center rounded-[100px] transition-colors duration-200 whitespace-nowrap font-normal";

  const variantStyles = {
    outlined: "border-2 border-[--foreground] text-[--foreground] hover:bg-[#000] hover:text-white",
    primary: "bg-[--foreground] text-white hover:bg-black",
  };

  const sizeStyles = {
    sm: "text-[12px] leading-[22px] px-[20px] py-[10px]",
    md: "text-[16px] leading-[22px] px-[24px] py-[10px]",
    lg: "text-[18px] leading-[24px] px-[32px] py-[12px]",
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
