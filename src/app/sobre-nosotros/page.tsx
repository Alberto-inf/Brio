import Image from 'next/image';
import Link from 'next/link';

export default function SobreNosotros() {
  return (
    <div className="bg-brio-black min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <header className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 inline-flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Sobre Brío
            <span className="block w-8 h-px bg-brio-silver" />
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl italic text-brio-white leading-tight">
            Elegancia que nace <br />
            <span className="text-brio-silver">de la actitud</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-7 relative aspect-[4/5] bg-brio-gray overflow-hidden">
            <Image
              src="/images/products/p12.jpeg"
              alt="Sobre Brío"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-5 space-y-5">
            <h2 className="font-serif text-3xl md:text-4xl italic text-brio-white leading-tight">
              Nuestra historia
            </h2>
            <div className="space-y-4 text-sm md:text-base text-brio-white/70 leading-relaxed">
              <p>
                <strong className="text-brio-white">Brío</strong> nace de la idea de que la
                elegancia empieza en la actitud. Diseñamos para mujeres que eligen por sí mismas.
              </p>
              <p>
                Cada prenda está pensada para empoderar, para dar confianza, para reflejar a la
                mujer que ya eres. No seguimos tendencias: las creamos.
              </p>
              <p>
                Trabajamos con ateliers seleccionados y materiales nobles. El resultado: piezas
                duraderas que se vuelven favoritas.
              </p>
            </div>
            <div className="pt-3 flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.32em] text-brio-silver/80">
              <span>Calidad</span>
              <span>•</span>
              <span>Diseño</span>
              <span>•</span>
              <span>Actitud</span>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { n: '01', t: 'Calidad', d: 'Materiales nobles, acabados precisos y proveedores que comparten nuestra ética.' },
            { n: '02', t: 'Diseño', d: 'Patrones propios, pruebas reales, ajustes hasta que la prenda se mueve como queremos.' },
            { n: '03', t: 'Actitud', d: 'No vendemos ropa, vendemos una forma de ser. Elegancia que nace de dentro.' },
          ].map((b) => (
            <div
              key={b.n}
              className="border border-brio-line p-8 hover:border-brio-silver transition-colors"
            >
              <span className="font-serif italic text-3xl text-brio-silver">{b.n}</span>
              <h3 className="mt-4 text-sm uppercase tracking-[0.32em] text-brio-white">{b.t}</h3>
              <p className="mt-3 text-sm text-brio-white/65 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-3 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] px-7 py-4 hover:bg-brio-silver-soft transition-colors"
          >
            Explorar colección
          </Link>
        </div>
      </div>
    </div>
  );
}
