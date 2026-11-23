# Documentación consultada

Las fuentes se consultan antes de los cambios correspondientes. La fecha de trabajo es 2026-11-23 (America/Bogota).

| Herramienta | Fuente oficial | Aplicación |
| --- | --- | --- |
| Codex | https://learn.chatgpt.com/docs/agent-configuration/subagents | Dos subagentes reales y definiciones TOML que remiten a sus Markdown; sin fijar modelos innecesariamente. |
| Next.js | https://nextjs.org/docs/app/getting-started/installation | App Router y TypeScript; comprobar versiones y documentación instalada. |
| Supabase | https://supabase.com/docs/guides/getting-started/quickstarts/nextjs | Integración real con PostgreSQL, migraciones y acceso restringido. |
| Supabase Free | https://supabase.com/pricing | Solo plan Free; considerar la pausa tras inactividad al entregar. |
| Vercel | https://vercel.com/docs/cli/integration | Descubrir y provisionar la integración antes de implementar contra ella. |
| Vercel | https://vercel.com/docs/deployments | Despliegue de producción y verificación pública independiente. |
| Node.js | https://nodejs.org/en/download | Runtime portable local, sin alterar la instalación global del equipo. Verificar SHA-256 de la descarga oficial. |
| npm | https://docs.npmjs.com/cli/v11/using-npm/config/ | Caché en `.tools/npm-cache`, sin escribir fuera del proyecto. |
| Git | https://git-scm.com/docs/git-commit | Versionar las instrucciones y documentación con una selección explícita de archivos. |
| Vercel CLI | https://vercel.com/docs/cli/global-options | Configuración y caché locales mediante `--global-config` y `XDG_CACHE_HOME`. |
| Vercel Authentication | https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication | Revisar protección de producción y verificar la URL sin sesión una vez desplegada. |
| GitHub | https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository | Repositorio público solicitado para la entrega; todavía no creado. |

## Preflight real

- El directorio inicial estaba vacío y no era repositorio Git.
- GitHub conectado: `willdvrjw`.
- Vercel denegó acceso al equipo `sistemas-1998` (403); se generó el enlace de autorización oficial. Pendiente de autorización del usuario.
- Supabase disponible como conexión, todavía sin conectar al iniciar el trabajo.
- Node.js/npm no aparecen en PATH; se preparará un runtime portable ignorado por Git.

## Resultado del entorno local

- Node.js v24.22.3 y npm 11.19.1 preparados en `.tools/node-v24.22.3-win-x64`; no se modificó PATH global.
- Descarga oficial `node-v24.22.3-win-x64.zip`, SHA-256 comprobado: `e612af99f626ab415ea225af6bce5c971feb448cb5cae250bb1c3fa50c5f7d9f`.
- Vercel CLI 66.6.0 instalado localmente en `.tools/vercel-cli`.
- El intento de `integration categories` pidió autenticación incluso en modo no interactivo. Se canceló el flujo de dispositivo; no se provisionó ningún recurso ni se aceptó un plan.
- Versiones estables consultadas en npm: Next.js 16.4.6, React/React DOM 19.3.1, TypeScript 7.0.2. No se instalaron dependencias de aplicación; deben confirmarse sus compatibilidades al implementar.
- Git local inicializado en la rama `main`. GitHub conectado como `willdvrjw`, sin repositorio remoto de esta prueba todavía.
- Control del navegador indisponible. La revisión automática rechazó leer una ventana existente por contener contenido privado ajeno al encargo. No se accedió a ese contenido ni se intentó eludir el rechazo.

Las fuentes y decisiones específicas de Develop están en `docs/documentacion-develop.md`; las fuentes de revisión están en `docs/aceptacion.md`.
