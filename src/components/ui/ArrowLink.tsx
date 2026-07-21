"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ArrowLink({ href, children, className = "" }: Props) {
  return (
    <Link href={href} className={`block ${className}`}>
      <motion.span
        whileHover={{ x: 2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="inline-block text-black"
      >
        {children}
      </motion.span>
    </Link>
  );
}
