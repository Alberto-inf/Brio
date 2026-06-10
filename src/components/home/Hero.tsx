'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative min-h-[88svh] md:min-h-[92svh] flex items-end md:items-center overflow-hidden bg-brio-black">
      <div className="absolute inset-0">
        <motion.div
          initial={reduce ? { scale: 1 } : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/images/products/p11.jpeg"
            alt="Colección Brío"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-brio-black via-brio-black/50 to-brio-black/30" />
        <div className="absolute inset-0 bg-noise opacity-60 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-0">
        <div className="max-w-2xl">
          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-5 flex items-center gap-3"
          >
            <span className="block w-8 h-px bg-brio-silver" />
            Nueva colección · 2026
          </motion.p>

          <motion.h1
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl italic text-brio-white text-balance leading-[0.95]"
          >
            Elegancia
            <br />
            que nace
            <br />
            <span className="text-brio-silver">de la actitud</span>
          </motion.h1>

          <motion.p
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-6 text-sm md:text-base text-brio-white/70 max-w-md leading-relaxed"
          >
            Piezas en negro pensadas para mujeres que eligen por sí mismas. Calidad, caída y una
            actitud silenciosa que lo dice todo.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/colecciones"
              className="group inline-flex items-center gap-3 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] px-8 py-4 hover:bg-brio-silver-soft transition-colors"
            >
              Explorar colección
              <span className="block w-6 h-px bg-brio-black group-hover:w-10 transition-all" />
            </Link>
            <Link
              href="/colecciones?cat=total-look"
              className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-brio-white/80 hover:text-brio-silver px-2 py-4"
            >
              Total look
              <span className="block w-6 h-px bg-brio-silver transition-all" />
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden md:flex absolute bottom-8 right-8 z-10 items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-brio-white/40"
      >
        <span>Scroll</span>
        <span className="block w-10 h-px bg-brio-white/30" />
      </motion.div>
    </section>
  );
}
