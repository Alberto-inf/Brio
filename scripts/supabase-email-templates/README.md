Brío · Plantillas de email de Supabase
======================================

Esta carpeta contiene los HTML de las plantillas de email que Supabase envía
desde el sistema de autenticación. Las tres están en el mismo estilo visual
(negro, tipografía serif, botón blanco) para mantener la coherencia con la
web de Brío.

Archivos
--------
- confirm-signup.html   → email que se manda al registrarse
- reset-password.html    → email para cambiar la contraseña olvidada
- magic-link.html        → email de acceso sin contraseña (no se usa en Brio,
                           pero Supabase lo trae activo por defecto)

Cómo usarlas
------------
1. Abre el dashboard de Supabase:
   https://supabase.com/dashboard/project/<tu-proyecto>/auth/templates

2. Selecciona cada plantilla ("Confirm signup", "Reset password", "Magic link").

3. En el editor, cambia a la vista de código fuente (icono </>).

4. Borra el contenido por defecto y pega el archivo correspondiente.

5. Guarda.

Variables que Supabase sustituye automáticamente
------------------------------------------------
{{ .ConfirmationURL }}   → enlace único (de confirmación, recuperación o login)
{{ .Email }}              → email del destinatario
{{ .SiteURL }}            → URL pública del proyecto (no se usa en estas plantillas)

Notas
-----
- El enlace de la plantilla apunta a /cuenta, configurado vía
  emailRedirectTo en src/lib/auth/AuthContext.tsx.
- Los estilos son inline para que se vean bien en
  Gmail, Outlook y Apple Mail.
- Si en el futuro cambias de dominio, las plantillas siguen funcionando
  porque {{ .ConfirmationURL }} ya incluye el origen correcto.
