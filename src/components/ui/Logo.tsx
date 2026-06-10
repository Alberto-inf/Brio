import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'b' | 'full';
  href?: string | null;
  title?: string;
  priority?: boolean;
}

/**
 * Logo Brío usando las imágenes reales recortadas (PNG/JPG) sobre fondo negro.
 * - variant="b"   -> logo-w-cropped.jpg     (1170x840)  "B" blanca sobre fondo negro
 * - variant="full"-> logobrio-cropped.png   (1254x539)  "Brío" completa sobre tela
 *
 * Las imágenes se sirven sin optimización en dev (configurado en next.config.ts).
 */
export default function Logo({
  className,
  variant = 'b',
  href = '/',
  title = 'Brío',
  priority = false,
}: LogoProps) {
  const isFull = variant === 'full';

  // Tamaños intrínsecos reales (post-crop)
  const intrinsic = isFull
    ? { w: 1254, h: 539 }  // ~2.33:1
    : { w: 1170, h: 840 }; // ~1.39:1

  const inner = (
    <Image
      src={isFull ? '/images/logobrio-cropped.png' : '/images/logo-w-cropped.jpg'}
      alt={title}
      width={intrinsic.w}
      height={intrinsic.h}
      priority={priority}
      sizes={isFull ? '180px' : '48px'}
      className={cn(
        isFull
          // Wordmark horizontal: lo limitamos por alto (h ≈ 32-44px = bien legible)
          ? 'h-8 sm:h-10 md:h-12 w-auto object-contain'
          // B cuadrada: pequeño
          : 'h-9 md:h-10 w-auto object-contain',
        className
      )}
    />
  );

  if (href === null) {
    return (
      <span className="inline-flex items-center" aria-label={title}>
        {inner}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={title}
      className="inline-flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-brio-silver rounded-sm"
    >
      {inner}
    </Link>
  );
}
