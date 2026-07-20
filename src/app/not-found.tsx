"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-[60px] md:pt-[80px]">
        <div className="max-w-xl w-full text-center">

          {/* 404 Number - Animated */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-[120px] md:text-[160px] leading-none font-light text-black tracking-tight">
              404
            </p>
          </motion.div>

        {/* Message */}
        <div className="space-y-6 mb-12">
          <p className="text-[28px] md:text-[36px] leading-[1.2] text-black font-medium">
            Pagina non trovata
          </p>
          <p className="text-[16px] md:text-[18px] leading-[1.6] text-black">
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[16px] leading-[1.2] text-black hover:opacity-60 transition-opacity"
        >
          Torna alla home
        </Link>
        </div>
      </div>
    </>
  );
}
