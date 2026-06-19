import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';

export function createSupabaseBrowser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Faltan las variables NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Añádelas a .env.local (en local) y a Vercel → Environment Variables (en producción).'
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
