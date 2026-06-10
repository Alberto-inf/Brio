'use client';

import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

interface IconButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: number;
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'filled';
}

export default function IconButton({
  label,
  onClick,
  href,
  badge,
  className,
  children,
  variant = 'default',
}: IconButtonProps) {
  const reduce = useReducedMotion();

  const inner = (
    <span
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300',
        variant === 'filled'
          ? 'border-brio-silver bg-brio-silver text-brio-black hover:bg-brio-white'
          : 'border-brio-line text-brio-white/80 hover:border-brio-silver hover:text-brio-white',
        className
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <motion.span
          key={badge}
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brio-silver text-brio-black text-[10px] font-semibold flex items-center justify-center"
        >
          {badge}
        </motion.span>
      )}
      <span className="sr-only">{label}</span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className="inline-flex focus:outline-none focus-visible:ring-1 focus-visible:ring-brio-silver rounded-full"
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex focus:outline-none focus-visible:ring-1 focus-visible:ring-brio-silver rounded-full"
    >
      {inner}
    </button>
  );
}
