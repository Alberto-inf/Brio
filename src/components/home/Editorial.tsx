'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Editorial() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-brio-black-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="md:col-span-7 relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-brio-gray"
        >
          <Image
            src="/images/products/p12.jpeg"
            alt="Editorial Brío"
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brio-black/40 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="md:col-span-5 space-y-6"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Sobre Brío
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic text-brio-white leading-[1.05] text-balance">
            No seguimos tendencias. <span className="text-brio-silver">Las creamos.</span>
          </h2>
          <div className="space-y-4 text-sm md:text-base text-brio-white/70 leading-relaxed max-w-md">
            <p>
              Brío nace de la idea de que la elegancia empieza en la actitud. Diseñamos para
              mujeres que eligen por sí mismas: telas nobles, cortes precisos y un negro profundo
              que se adapta a cualquier momento.
            </p>
            <p>
              Cada prenda está pensada para empoderar, para dar confianza, para reflejar a la
              mujer que ya eres.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.32em] text-brio-white/50">
            <span>Calidad</span>
            <span className="text-brio-line-strong">•</span>
            <span>Diseño</span>
            <span className="text-brio-line-strong">•</span>
            <span>Actitud</span>
          </div>
          <Link
            href="/sobre-nosotros"
            className="group inline-flex items-center gap-3 mt-2 text-[10px] uppercase tracking-[0.32em] text-brio-white hover:text-brio-silver"
          >
            Conocer la historia
            <span className="block w-6 h-px bg-current group-hover:w-10 transition-all" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
