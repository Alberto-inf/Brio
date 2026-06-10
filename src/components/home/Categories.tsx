'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sections } from '@/lib/categories';

export default function Categories() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Explorar
          </p>
          <h2 className="font-serif text-4xl md:text-5xl italic text-brio-white leading-tight">
            Por sección
          </h2>
        </div>
        <p className="text-sm text-brio-white/55 max-w-sm">
          Cinco universos en negro, cada uno con su propia voz.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {sections.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className={
              i === 0
                ? 'md:col-span-2 md:row-span-2'
                : ''
            }
          >
            <Link
              href={s.href}
              className="group relative block aspect-[3/4] md:aspect-auto md:h-full md:min-h-[420px] overflow-hidden bg-brio-gray"
            >
              <Image
                src={s.image}
                alt={s.label}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brio-black/85 via-brio-black/30 to-transparent" />
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-2xl md:text-3xl italic text-brio-white text-balance">
                  {s.label}
                </h3>
                <p className="text-xs md:text-sm text-brio-white/70 mt-2 max-w-xs">
                  {s.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-brio-white/80 group-hover:text-brio-silver transition-colors">
                  Ver
                  <span className="block w-6 h-px bg-current group-hover:w-10 transition-all" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
