# Fuentes de Develop

Consultadas el 2026-11-23 antes de proponer arquitectura y antes de escribir código de aplicación. Esta fase es documentación y diseño; no implica que una integración o prueba ya funcione.

| Tema | Documentación oficial | Decisión |
| --- | --- | --- |
| Separación servidor/cliente | https://nextjs.org/docs/app/getting-started/server-and-client-components | Página y layout sin información privada; interacción en componente cliente y acceso de datos en servidor. |
| Route Handlers | https://nextjs.org/docs/app/api-reference/file-conventions/route | API del mismo origen con métodos GET/POST/PATCH/DELETE; parámetros dinámicos según versión instalada. |
| Cookies | https://nextjs.org/docs/app/api-reference/functions/cookies | Leer con API asíncrona y escribir desde Route Handlers; cookies HttpOnly, SameSite y Secure. |
| Auth anónimo | https://supabase.com/docs/guides/auth/auth-anonymous | Experiencia sin formulario de login, con usuario autenticado anónimo y aislamiento real por UID. |
| Inicio anónimo JS | https://supabase.com/docs/reference/javascript/auth-signinanonymously | Crear usuario solo cuando no existe sesión válida; no confundir clave anon con usuario anónimo. |
| Cliente SSR | https://supabase.com/docs/guides/auth/server-side/creating-a-client | Cliente por petición mediante `@supabase/ssr`, usando cookies y verificación de identidad en servidor. |
| Row Level Security | https://supabase.com/docs/guides/database/postgres/row-level-security | RLS por `auth.uid()` para cada operación; UPDATE con USING y WITH CHECK. |

El Orquestador aprobó la arquitectura de cookies HttpOnly y añadió comprobación Origin en mutaciones y `no-store` en respuestas privadas. Testing confirmó que el aislamiento debe probarse también mediante ataques directos a la API de Supabase, no solo por filtros de interfaz.
