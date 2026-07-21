"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CSSProperties } from "react";

interface AnimatedTitleProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedTitle({ text, className = "", style }: AnimatedTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const letters = containerRef.current.querySelectorAll(".letter");

    gsap.fromTo(
      letters,
      {
        opacity: 0,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power2.out",
        stagger: {
          amount: 0.45,
          from: "start",
        },
      }
    );
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`${className} group cursor-default transition-transform duration-300 ease-out hover:scale-[1.02]`}
      style={style}
    >
      {text.split("").map((char, idx) => (
        <span key={idx} className="letter" style={{ display: "inline-block" }}>
          {char}
        </span>
      ))}
    </div>
  );
}
