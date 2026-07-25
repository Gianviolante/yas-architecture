interface GradientOverlayProps {
  from?: string;
  to?: string;
  className?: string;
}

export default function GradientOverlay({
  from = "#d9d9d9",
  to = "#ffffff",
  className = ""
}: GradientOverlayProps) {
  return (
    <div
      className={`absolute inset-y-0 right-0 z-10 ${className}`}
      style={{
        background: `linear-gradient(to left, ${from}, transparent)`,
        width: "100px",
      }}
    />
  );
}
