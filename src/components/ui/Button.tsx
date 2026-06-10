import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkProps = BaseProps & { href: string; type?: never };

const variantClass: Record<Variant, string> = {
  primary:
    'bg-brio-white text-brio-black hover:bg-brio-silver-soft border border-transparent',
  secondary:
    'bg-brio-silver text-brio-black hover:bg-brio-white border border-transparent',
  outline:
    'border border-brio-line-strong text-brio-white hover:bg-brio-white hover:text-brio-black',
  ghost: 'text-brio-white/80 hover:text-brio-white',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-[11px]',
  lg: 'px-8 py-4 text-xs',
};

const base =
  'inline-flex items-center justify-center uppercase tracking-[0.28em] font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

export default function Button(props: ButtonProps | LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...rest
  } = props as BaseProps & {
    href?: string;
    type?: 'button' | 'submit';
    onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
    disabled?: boolean;
  };

  const cls = cn(base, variantClass[variant], sizeClass[size], className);

  if ('href' in rest && rest.href) {
    return (
      <Link href={rest.href} className={cls}>
        {children}
      </Link>
    );
  }

  const { href: _ignored, ...buttonRest } = rest as LinkProps & {
    href?: string;
  };
  return (
    <button className={cls} {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
