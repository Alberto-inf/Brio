'use client';

import { useState } from 'react';
import { useToast } from '@/lib/Toast';

export default function Contacto() {
  const { show } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    show('Mensaje enviado. Te responderemos pronto.');
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
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

          <form onSubmit={onSubmit} className="space-y-5">
            <Field
              label="Nombre"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />
            <Field
              label="Asunto"
              value={form.subject}
              onChange={(v) => setForm({ ...form, subject: v })}
              required
            />
            <div>
              <label className="block text-[10px] uppercase tracking-[0.32em] text-brio-white/60 mb-2">
                Mensaje
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={6}
                className="w-full bg-transparent border border-brio-line px-4 py-3 text-sm text-brio-white focus:outline-none focus:border-brio-silver transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-brio-white text-brio-black text-[10px] uppercase tracking-[0.32em] hover:bg-brio-silver-soft transition-colors"
            >
              {sent ? 'Enviado' : 'Enviar mensaje'}
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
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.32em] text-brio-white/60 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent border border-brio-line px-4 py-3 text-sm text-brio-white focus:outline-none focus:border-brio-silver transition-colors"
      />
    </div>
  );
}
