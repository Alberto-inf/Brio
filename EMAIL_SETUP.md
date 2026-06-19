Configurar el envío de emails de auth (confirmación, reset, magic link)
=========================================================================

Por qué es necesario
--------------------
Supabase no deja editar las plantillas de los emails de auth ni saltarse
su rate limit (3 emails/hora por usuario en el plan free) hasta que
conectas un proveedor SMTP propio. En Brio vamos a usar Gmail porque
ya tienes `GMAIL_USER` y `GMAIL_APP_PASSWORD` configurados en `.env.local`
para el formulario de contacto.

Pasos
-----

1) Asegúrate de tener una App Password de Gmail
   - 2FA activado en la cuenta Google.
   - https://myaccount.google.com/apppasswords
   - Tipo "Mail", dispositivo "Otro (Brío)".
   - Copia la contraseña de 16 caracteres (la misma que ya tienes en
     `.env.local` como `GMAIL_APP_PASSWORD`).

2) Entra al dashboard de Supabase
   - https://supabase.com/dashboard/project/<tu-proyecto>/auth/templates
   - Si te aparece el botón "Enable custom SMTP", púlsalo.
   - O directamente: https://supabase.com/dashboard/project/<tu-proyecto>/settings/auth

3) Rellena el formulario de SMTP
   - Sender email address:  albertosanmer@gmail.com
   - Sender name:           Brío
   - Host:                  smtp.gmail.com
   - Port number:           465
   - Minimum interval per user: 60
   - Username:              albertosanmer@gmail.com
   - Password:              <tu App Password de 16 chars>
   - Pulsa "Save".

4) Espera 1-2 minutos a que Supabase propague el cambio.

5) Ahora ya puedes editar las plantillas
   - Vuelve a Authentication → Email Templates.
   - Selecciona "Confirm signup" → cambia a vista Source (icono </>).
   - Pega el contenido de scripts/supabase-email-templates/confirm-signup.html.
   - Repite con "Reset password" y "Magic link".

6) Prueba
   - Crea un usuario nuevo con un email que controles.
   - Deberías recibir el email "Bienvenida a Brío — Confirma tu cuenta"
     desde `albertosanmer@gmail.com` (revisa también Spam la primera vez).
   - Haz clic en "Confirmar mi cuenta" y deberías acabar en /cuenta.

Notas y troubleshooting
----------------------

- Gmail puede añadir un banner "Esta aplicación no está verificada" la
  primera vez. Como es tu propia cuenta, ignóralo: es parte del modo
  "less secure" de Gmail. Si te molesta, crea un alias
  (noreply.tienda@gmail.com) y reenvía los mensajes a tu bandeja real.

- Si después de configurar SMTP sigues sin recibir emails, comprueba en
  Supabase → Logs → Auth: ahí sale cada envío con su estado.

- El "Minimum interval per user" controla cuántos segundos pasan entre
  dos emails al mismo destinatario. 60 segundos es seguro y evita
  que se use tu cuenta de Gmail para spam.

- Límite de Gmail: 500 emails/día en cuentas personales. Más que
  suficiente para el lanzamiento. Cuando crezcas, migra a Resend o
  SendGrid (free tier: 100 emails/día y 100/día respectivamente).
