"use client";

import { useEffect, useRef, useState } from "react";

import { CSSProperties } from "react";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedTitle({ text, className = "", style }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${className} group cursor-default transition-transform duration-300 ease-out hover:scale-[1.02]`}
      style={style}
    >
      <style>{`
        @keyframes letter-fade-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .letter {
          display: inline-block;
          opacity: 0;
          animation: letter-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className="letter"
          style={{
            animationDelay: isVisible ? `${idx * 0.05}s` : "0s",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
