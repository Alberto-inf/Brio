import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { menu } from '@/lib/categories';
import { IconPhone } from '@/components/ui/Icons';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brio-black-2 border-t border-brio-line">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-6">
            <Logo variant="full" href={null} />
            <p className="text-sm text-brio-white/60 max-w-xs leading-relaxed">
              Moda femenina en negro. Prendas de alta calidad para mujeres que eligen por sí mismas.
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-brio-silver">
              <span className="inline-block w-6 h-px bg-brio-silver" />
              <span>Elegancia · Actitud · Brío</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.32em] text-brio-white mb-5">Tienda</h3>
            <ul className="space-y-3">
              {menu
                .filter((i) => i.id !== 'home')
                .map((item) =>
                  item.children ? (
                    item.children.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={c.href ?? '#'}
                          className="text-sm text-brio-white/60 hover:text-brio-silver transition-colors"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li key={item.id}>
                      <Link
                        href={item.href ?? '#'}
                        className="text-sm text-brio-white/60 hover:text-brio-silver transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-[10px] uppercase tracking-[0.32em] text-brio-white mb-5">Empresa</h3>
            <ul className="space-y-3">
              <li><Link href="/sobre-nosotros" className="text-sm text-brio-white/60 hover:text-brio-silver transition-colors">Sobre Brío</Link></li>
              <li><Link href="/contacto" className="text-sm text-brio-white/60 hover:text-brio-silver transition-colors">Contacto</Link></li>
              <li><Link href="/favoritos" className="text-sm text-brio-white/60 hover:text-brio-silver transition-colors">Mis favoritos</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-[10px] uppercase tracking-[0.32em] text-brio-white mb-5">Contacto</h3>
            <ul className="space-y-3 text-sm text-brio-white/60">
              <li>hola@brio.com</li>
              <li>+34 600 000 000</li>
              <li>España</li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href="mailto:hola@brio.com"
                aria-label="Enviar email"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-brio-line bg-brio-white hover:border-brio-white hover:bg-brio-silver-soft transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/email-icon.svg"
                  alt=""
                  className="w-7 h-7"
                  draggable={false}
                />
              </Link>
              <Link
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#25D366] bg-[#25D366] hover:bg-[#1ebe5a] hover:border-[#1ebe5a] transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/whatsapp-icon.svg"
                  alt=""
                  className="w-7 h-7"
                  draggable={false}
                />
              </Link>
              <Link
                href="tel:+34600000000"
                aria-label="Llamar"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#3b82f6] bg-[#3b82f6] text-brio-white hover:bg-[#2563eb] hover:border-[#2563eb] transition-colors"
              >
                <IconPhone className="w-7 h-7" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-brio-line flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.32em] text-brio-white/40">
          <span>© {year} Brío. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <span>Envío gratis +100€</span>
            <span className="text-brio-line-strong">•</span>
            <span>Devoluciones 30 días</span>
            <span className="text-brio-line-strong">•</span>
            <span>Atención al cliente</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
