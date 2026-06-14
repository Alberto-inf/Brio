'use client';

import { useMemo, useState } from 'react';
import { useToast } from '@/lib/Toast';
import { cn } from '@/lib/utils';

type FormState = { name: string; email: string; subject: string; message: string };

const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contacto() {
  const { show } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = 'El nombre es obligatorio.';
    if (!form.email.trim()) e.email = 'El email es obligatorio.';
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Introduce un email válido.';
    if (!form.subject.trim()) e.subject = 'El asunto es obligatorio.';
    if (!form.message.trim()) e.message = 'El mensaje es obligatorio.';
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;
  const showError = (key: keyof FormState) => touched[key] && errors[key];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (hasErrors) {
      show('Revisa los campos marcados en rojo.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        show('No hemos podido enviar el mensaje. Inténtalo de nuevo.', 'error');
        return;
      }
      show('Mensaje enviado. Te responderemos pronto.');
      setSent(true);
      setForm(EMPTY);
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch {
      show('No hemos podido enviar el mensaje. Inténtalo de nuevo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brio-black min-h-[60vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <header className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-[0.5em] text-brio-silver mb-3 inline-flex items-center gap-3">
            <span className="block w-8 h-px bg-brio-silver" />
            Estamos aquí
            <span className="block w-8 h-px bg-brio-silver" />
          </p>
          <h1 className="font-serif text-5xl md:text-6xl italic text-brio-white">Contacto</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-10">
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
                Información
              </h2>
              <ul className="space-y-3 text-sm text-brio-white/75">
                <li>hola@brio.com</li>
                <li>+34 600 000 000</li>
                <li>España</li>
              </ul>
            </div>
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
                Horario
              </h2>
              <ul className="space-y-2 text-sm text-brio-white/75">
                <li>Lunes a viernes · 10:00 – 19:00</li>
                <li>Sábados · 11:00 – 15:00</li>
                <li>Domingos · Cerrado</li>
              </ul>
            </div>
            <div>
              <h2 className="text-[10px] uppercase tracking-[0.32em] text-brio-silver mb-3">
                Sobre pedidos
              </h2>
              <p className="text-sm text-brio-white/70 leading-relaxed max-w-sm">
                Para consultas sobre un pedido existente, incluye el número de pedido y el email
                de compra. Te respondemos en menos de 24h.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <Field
              label="Nombre"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              error={showError('name')}
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              error={showError('email')}
            />
            <Field
              label="Asunto"
              value={form.subject}
              onChange={(v) => setForm((f) => ({ ...f, subject: v }))}
              onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
              error={showError('subject')}
            />
            <div>
              <label
                className={cn(
                  'block text-[10px] uppercase tracking-[0.32em] mb-2',
                  showError('message') ? 'text-red-400' : 'text-brio-white/60'
                )}
              >
                Mensaje
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                rows={6}
                aria-invalid={!!showError('message')}
                className={cn(
                  'w-full bg-transparent border px-4 py-3 text-sm text-brio-white focus:outline-none transition-colors resize-none',
                  showError('message')
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-brio-line focus:border-brio-silver'
                )}
              />
              {showError('message') && (
                <p className="mt-1.5 text-[11px] text-red-400">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={hasErrors || submitting || sent}
              className={cn(
                'w-full h-12 text-[10px] uppercase tracking-[0.32em] transition-colors',
                hasErrors || submitting || sent
                  ? 'bg-brio-gray text-brio-white/40 cursor-not-allowed'
                  : 'bg-brio-white text-brio-black hover:bg-brio-silver-soft'
              )}
            >
              {submitting ? 'Enviando…' : sent ? 'Enviado' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        className={cn(
          'block text-[10px] uppercase tracking-[0.32em] mb-2',
          error ? 'text-red-400' : 'text-brio-white/60'
        )}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        className={cn(
          'w-full bg-transparent border px-4 py-3 text-sm text-brio-white focus:outline-none transition-colors',
          error ? 'border-red-500 focus:border-red-400' : 'border-brio-line focus:border-brio-silver'
        )}
      />
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
