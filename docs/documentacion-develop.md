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

## Investigación para implementación

Se volvieron a consultar las fuentes de Next.js, Supabase SSR/Auth/RLS, cookies, Route Handlers y Origin antes de comenzar. También se consultaron https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog, https://www.typescriptlang.org/tsconfig/, https://nodejs.org/docs/latest-v24.x/api/test.html y https://playwright.dev/docs/intro para formularios modales, configuración estricta y contrato de pruebas.

El registro npm confirmó Next 16.4.6, React 19.3.1, TypeScript 7.0.2, Supabase SSR 0.12.7, Supabase JS 2.119.2 y Playwright Test 1.65.1. Las versiones se fijarán en package.json y package-lock.json. La consulta inicial de `npm` fue rechazada por la política de scripts de PowerShell; `npm.cmd` permitió consultar correctamente sin cambiar la política.

Contrato acordado con Testing: `parseTaskInput` en `lib/tasks.ts`, `isSameOrigin` en `lib/security.ts`, validación estricta sin campos desconocidos, estados/prioridades enumerados y respuestas JSON `{task}`, `{tasks}`, `{ok:true}` o `{error,fields?}`. La API incluye también GET individual para comprobar el acceso ajeno.

## Implementación y documentación instalada

Orquestador confirmó la provisión real de Supabase y el contrato `SUPABASE_URL` / `SUPABASE_PUBLISHABLE_KEY` antes de instalar el SDK e implementar la integración. No se leyeron ni imprimieron variables administrativas de `.env.local`; el runtime solo accede a esas dos variables y rechaza claves con privilegios administrativos.

Después de instalar Next 16.4.6 se consultaron los archivos oficiales incluidos:

- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md`: API asíncrona, escritura desde Route Handlers y atributos.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`: métodos y parámetros dinámicos asincrónicos.
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/02-typescript.md`: TypeScript 7 compatible mediante CLI local.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`: frontera de error en español y función `retry` de la versión instalada.

Se consultaron también https://www.postgresql.org/docs/current/ddl-constraints.html y https://supabase.com/docs/guides/database/postgres/triggers antes de preparar la migración. Se incorporó el caso de whitespace SQL señalado por Testing: título no compuesto solo por espacios y sin caracteres de control, además de longitud y recorte. La migración se entregó a Orquestador para revisar/aplicar; Develop no modificó el servicio.

La guía `vercel:react-best-practices` se aplicó a los TSX: SDK separado con `server-only`, estados derivados durante render, inicialización sin duplicar el POST de sesión en StrictMode, mutaciones desde eventos, identificadores estables, etiquetas visibles, foco restaurado, diálogos nativos y ausencia de dependencias visuales pesadas. No se almacena sesión ni datos en localStorage.

`npm.cmd install` finalizó instalando 42 paquetes y auditando 43, con 0 vulnerabilidades reportadas. `npm.cmd run typecheck` terminó correctamente; Next añadió automáticamente `allowJs: true` a su configuración recomendada sin desactivar `strict`. La aprobación independiente y las pruebas de integración corresponden a Testing.

## Entrega de implementación a Testing

- Código: `app/` (layout, tablero, 404, error y tres rutas API), `components/` (tablero, tarjetas, diálogos e iconos), `lib/` (validación, Origin, cliente HTTP y cliente Supabase de servidor).
- Configuración de aplicación: `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `.env.example` y README reproducible.
- Migración propuesta: `supabase/migrations/202611230001_create_tasks.sql`, entregada a Orquestador sin aplicarla desde Develop.
- Comandos ejecutados con Node 24.22.3 portable y caché npm local: `npm.cmd install` (éxito, auditoría sin vulnerabilidades), `npm.cmd run typecheck` (éxito), `npm.cmd run build` (éxito) y una segunda compilación después de las mejoras finales de foco/anuncios/frontera de error (éxito, 8 segundos de proceso).
- La compilación final muestra `/` y `/_not-found` prerenderizadas sin datos privados y `/api/session`, `/api/tasks`, `/api/tasks/[id]` dinámicas. Next advierte que ignora un package-lock externo al repositorio; no se utilizó ni modificó ese archivo externo.
- `git diff --check` no encontró errores de espacios. La búsqueda de usos de variables encontró solamente las dos variables de Supabase en el módulo `server-only`; no hay uso de localStorage ni clave administrativa en app/components/lib.
- Testing comunicó 9/9 pruebas puras aprobadas sobre los módulos reales. Las pruebas de servicio, navegador y producción permanecen bajo revisión independiente; esta entrega de Develop no constituye aprobación de aceptación.
