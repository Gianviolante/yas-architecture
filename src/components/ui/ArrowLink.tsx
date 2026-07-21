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
    <Link href={href} className={`group block hover:opacity-60 transition-opacity ${className}`}>
      <motion.span
        initial={{ opacity: 0.6 }}
        whileHover={{ opacity: 1, x: 2 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </Link>
  );
}
