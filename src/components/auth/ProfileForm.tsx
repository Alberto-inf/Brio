'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProfileSchema, type ProfileInput } from '@/lib/auth/schemas';
import Button from '@/components/ui/Button';
import type { Profile } from '@/lib/database.types';

type FormState = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
};

const empty: FormState = {
  full_name: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  postal_code: '',
  country: 'España',
};

function profileToForm(p: Profile | null): FormState {
  if (!p) return empty;
  return {
    full_name: p.full_name ?? '',
    phone: p.phone ?? '',
    address_line1: p.address_line1 ?? '',
    address_line2: p.address_line2 ?? '',
    city: p.city ?? '',
    postal_code: p.postal_code ?? '',
    country: p.country ?? 'España',
  };
}

const EssentialSchema = ProfileSchema.pick({
  full_name: true,
  phone: true,
});

type Mode = 'essential' | 'full';

export default function ProfileForm({
  mode = 'full',
  onSaved,
  submitLabel,
}: {
  mode?: Mode;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const { user, supabase, status, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState<FormState>(empty);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'ready' && profile !== undefined) {
      setForm(profileToForm(profile));
      setHydrated(true);
    }
  }, [status, profile]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    if (!user || !supabase) return;

    const schema = mode === 'essential' ? EssentialSchema : ProfileSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setSaving(true);
    const payload = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const upsertPayload = { id: user.id, ...payload };
    const { error: saveErr } = await supabase
      .from('profiles')
      .upsert(upsertPayload as never, { onConflict: 'id' });

    setSaving(false);
    if (saveErr) {
      setError(saveErr.message);
      return;
    }
    setSavedAt(new Date());
    await refreshProfile();
    onSaved?.();
  }

  if (status === 'disabled') {
    return (
      <p className="text-sm text-brio-white/60">
        El login no está configurado. Añade las claves de Supabase a{' '}
        <code className="text-brio-silver">.env.local</code>.
      </p>
    );
  }

  if (!hydrated) {
    return <p className="text-sm text-brio-white/50">Cargando…</p>;
  }

  function Field({
    label,
    name,
    type = 'text',
    autoComplete,
  }: {
    label: string;
    name: keyof FormState;
    type?: string;
    autoComplete?: string;
  }) {
    return (
      <div>
        <label
          htmlFor={name}
          className="block text-[10px] uppercase tracking-[0.24em] text-brio-white/60 mb-2"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={form[name]}
          onChange={(e) => update(name, e.target.value as FormState[typeof name])}
          className="w-full bg-transparent border border-brio-line-strong px-4 py-3 text-brio-white placeholder:text-brio-white/30 focus:outline-none focus:border-brio-silver transition-colors"
        />
        {fieldErrors[name]?.[0] && (
          <p className="mt-2 text-xs text-red-300/90">{fieldErrors[name][0]}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Nombre completo" name="full_name" autoComplete="name" />
        <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" />
      </div>

      {mode === 'full' && (
        <>
          <Field
            label="Dirección (calle y número)"
            name="address_line1"
            autoComplete="address-line1"
          />
          <Field
            label="Complemento (piso, puerta, etc.)"
            name="address_line2"
            autoComplete="address-line2"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Ciudad" name="city" autoComplete="address-level2" />
            <Field label="Código postal" name="postal_code" autoComplete="postal-code" />
            <Field label="País" name="country" autoComplete="country-name" />
          </div>
        </>
      )}

      {error && (
        <p className="text-sm text-red-300/90 border border-red-300/30 bg-red-500/5 px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-xs text-brio-white/50">
          {savedAt ? `Guardado ${savedAt.toLocaleTimeString('es-ES')}` : '\u00A0'}
        </p>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando…' : (submitLabel ?? 'Guardar datos')}
        </Button>
      </div>
    </form>
  );
}
