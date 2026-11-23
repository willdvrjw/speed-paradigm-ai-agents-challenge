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

## Comprobación tras instalar la extensión de VS Code

- Fuente oficial consultada: https://vercel.com/docs/mcp (autorización OAuth de la conexión Vercel).
- `code --list-extensions --show-versions` confirma `frenco.vscode-vercel@2.2.1`. La consulta emitió advertencias de permisos al intentar crear logs de VS Code, pero devolvió la lista de extensiones.
- La conexión Vercel devolvió cero equipos en `list_teams`; `list_projects` con el alcance explícito `sistemas-1998` devolvió HTTP 403 por falta de autorización del equipo.
- La instalación de la extensión no acredita autorización de esta conexión. Se solicita el consentimiento oficial del equipo mediante `authorize_team_access`; no se almacenan enlaces temporales ni credenciales en el repositorio.

## Alternativa al consentimiento caducado

- El usuario mostró dos enlaces distintos que Vercel presenta como caducados inmediatamente; la causa no está confirmada.
- Fuentes oficiales consultadas antes de preparar la alternativa: https://vercel.com/docs/cli/login y https://vercel.com/docs/cli/global-options.
- Se prepara el inicio de sesión oficial mediante la CLI local existente, con configuración y caché dentro de `.tools/`, excluido de Git. El usuario debe completar personalmente el acceso; esta preparación no publica proyectos ni acepta planes.

## Inicio de sesión CLI comprobado

- Tras la confirmación del usuario, `vercel login` finalizó correctamente como `cherylbextor-7226`.
- `vercel whoami --format json` confirmó el espacio personal `willdvrs-projects`, rol OWNER y plan `hobby`; no hay proyecto vinculado. Este espacio es distinto del equipo `sistemas-1998` del conector y no se asume acceso a ese equipo.
- `vercel project list --query speed-paradigm --json --scope willdvrs-projects` terminó correctamente y devolvió cero proyectos coincidentes: el acceso por CLI funciona, pero no existe un despliegue acreditado de esta prueba.
- `git check-ignore .tools/vercel-config/auth.json` confirma que las credenciales locales quedan excluidas. Se excluye también `/debug.log` como artefacto local, sin leer ni versionar su contenido.

## Fuentes de Testing para pruebas ejecutables

Consultadas el 2026-11-23 antes de crear las pruebas independientes:

| Tema | Fuente oficial | Aplicación |
| --- | --- | --- |
| Runner Node.js 24 | https://nodejs.org/docs/latest-v24.x/api/test.html | Pruebas de reglas y seguridad mediante `node:test` y `node:assert`, sin una dependencia para reglas puras. |
| TypeScript en Node.js 24 | https://nodejs.org/docs/latest-v24.x/api/typescript.html | Importar módulos TypeScript puros con extensión explícita; el runner no sustituye la comprobación de tipos. |
| Playwright API | https://playwright.dev/docs/api-testing | Comprobar precondiciones y persistencia mediante solicitudes reales; limpiar únicamente los registros creados por la prueba. |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security | Dos identidades independientes y ataques de lectura, actualización, borrado y reasignación de propietario. |

## Vinculación y provisión autorizadas

- El usuario pidió explícitamente vincular y desplegar la aplicación en el espacio personal autenticado `willdvrs-projects`.
- Antes de crear recursos se consultaron https://vercel.com/docs/cli/link, https://vercel.com/docs/cli/integration, https://vercel.com/docs/plans/hobby, https://vercel.com/marketplace/supabase, https://supabase.com/docs/guides/integrations/vercel-marketplace y https://supabase.com/pricing.
- `project inspect --non-interactive` confirmó `link_required`. Se prepara un proyecto nuevo con el nombre del repositorio; no se reutilizan aplicaciones ajenas.
- `integration categories` e `integration discover --category storage` confirmaron Supabase como producto disponible. Solo se permite el plan Free de coste cero; no se aceptan planes de pago.
- Orquestador delegó implementación a Develop y pruebas independientes a Testing. Se mantiene la responsabilidad de infraestructura y despliegue en Orquestador.

- `project create`, `link --yes --project ... --scope willdvrs-projects` y la inspección posterior confirmaron el proyecto `prj_NLhkN9WSAVR2Clr4rMgq7IquhRFH`. Se ajusta únicamente este proyecto a Next.js y Node 24 según https://vercel.com/docs/cli/project y https://vercel.com/docs/rest-api/projects/update-an-existing-project.
- Vercel añadió una regla `.env*` duplicada al vincular que anulaba la excepción de `.env.example`; se elimina la duplicación y se mantienen excluidos `.env.local` y `.vercel/`.
- La provisión `integration add supabase --billing-plan free` devolvió `integration_terms_acceptance_required`. Se solicitó al usuario completar la pantalla oficial antes de reintentar; no se ha creado una base de datos todavía.

- Para preparar el repositorio accesible se consultaron https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user y https://git-scm.com/docs/git-credential. GitHub conectado confirma `willdvrjw`; la comprobación autorizada del gestor de credenciales fuera del sandbox confirmó esa misma cuenta sin imprimir credenciales. Si es necesario usar la API para crear el repositorio, las credenciales se conservarán solo en memoria y se verificará la identidad antes de cualquier creación.

## Base de datos real y exclusiones del despliegue

- El usuario confirmó la aceptación en plan Free. Vercel aprovisionó `foco-tareas` y lo conectó a producción y desarrollo. Se descargaron variables a `.env.local`, nunca se imprimieron sus valores.
- Se consultó https://vercel.com/docs/deployments/vercel-ignore antes de crear `.vercelignore` con exclusión explícita de configuración local, credenciales, herramientas, cachés y artefactos.
- Se consultaron https://node-postgres.com/features/queries y https://node-postgres.com/features/ssl para aplicar la migración revisada por conexión PostgreSQL local, con credenciales solo en memoria. La app no usará credenciales administrativas.
- Para habilitar y verificar sesiones sin formulario se consultaron https://supabase.com/docs/guides/auth/auth-anonymous y https://supabase.com/docs/reference/api/v1-update-auth-service-config. El GET de ajustes Auth del proyecto real respondió HTTP 200; falta verificar altas anónimas.

- Fuentes de implementación de Develop: `docs/documentacion-develop.md`. Fuentes SQL revisadas por Testing antes de aplicar: https://www.postgresql.org/docs/current/sql-grant.html, https://www.postgresql.org/docs/current/ddl-rowsecurity.html y https://www.postgresql.org/docs/current/trigger-definition.html.
- La conexión PostgreSQL con verificación TLS rechazó inicialmente la CA no instalada. Se consultó https://supabase.com/docs/guides/platform/ssl-enforcement y el código oficial https://github.com/supabase/supabase/blob/master/apps/studio/hooks/custom-content/custom-content.json para localizar la descarga actual de la CA. Se conservará validación del certificado y del nombre de host.
- GET de configuración pública Auth confirmó `external.anonymous_users=false`. La sesión SSO aislada requiere autenticación y el host de navegador conectado está indisponible; se pidió al usuario habilitar el proveedor anónimo en el panel del proyecto correcto. No se sustituye por claves administrativas en runtime.

- La descarga S3 de la CA oficial agotó el tiempo de espera incluso fuera del sandbox. Se localizaron las CA públicas incluidas en el CLI oficial de Supabase: https://github.com/supabase/cli/blob/375df86d9816aaa7417805ea7fc04a278970adf8/apps/cli/src/command-internal/supabase-ca-templates/prod-ca-2021.ts y `prod-ca-2025.ts` en el mismo directorio. Se descargaron desde ese commit y la conexión PostgreSQL cifrada con validación de CA y hostname terminó correctamente; `public.tasks` todavía no existía.
- Orquestador y Testing revisaron `supabase/migrations/202611230001_create_tasks.sql` antes de aplicarla. Se aplicará únicamente en la base nueva del proyecto `enwgedmpnjnlyxjzbica`; el resultado local guardará hash de la migración, RLS, políticas y restricciones, nunca credenciales.

## Despliegue construido y revisión protegida

- Se consultaron https://vercel.com/docs/cli/deploy y https://vercel.com/docs/deployments/promoting-a-deployment para desplegar producción con `--skip-domain`, sin promover una versión cuya integración funcional está pendiente.
- Commit de aplicación `f3d8d5f` publicado en GitHub. Vercel terminó READY el despliegue `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4` con Next.js, Node 24 y máquina `basic` del plan Hobby.
- La comprobación sin credenciales redirige a Vercel (302); por tanto no acredita una URL pública. Se consultó https://vercel.com/docs/cli/curl para revisar el despliegue protegido. La CLI creó un bypass de automatización y después reenvió incorrectamente `--global-config` a curl; la comprobación se completó usando el bypass existente solo en cabecera y en memoria, sin imprimirlo.
- Se consultó https://vercel.com/docs/rest-api/projects/update-protection-bypass-for-automation para revocar ese bypass al acabar. La verificación posterior confirmó cero bypass de automatización restantes. No se deshabilitó la protección de despliegues.
- La página protegida respondió 200 con título Foco. API de tareas sin sesión: 401. Creación de sesión sin Origin: 403. Con Origin y JSON correctos: 503, coherente con el proveedor anónimo aún desactivado. Todas esas respuestas privadas incluyeron `no-store`.

## Reanudación de la verificación de Auth

- El usuario informó que activó Allow anonymous sign-ins y guardó. Antes de continuar se volvió a consultar https://supabase.com/docs/guides/auth/auth-anonymous y https://vercel.com/docs/deployments/promoting-a-deployment.
- La lectura normal y una lectura con cache-busting/no-cache de los ajustes públicos del proyecto `enwgedmpnjnlyxjzbica` devolvieron HTTP 200 con `external.anonymous_users=false`; la segunda respuesta indicó `CF-Cache-Status: DYNAMIC`, sin Age.
- Testing ejecutó una sola llamada real `signInAnonymously()` con URL y clave publicable: Supabase respondió HTTP 422, `anonymous_provider_disabled`, «Anonymous sign-ins are disabled», sin crear usuario ni sesión. Se detuvieron las comprobaciones dependientes.
- Se solicitó confirmar si el ajuste fue guardado en `foco-tareas` con esa referencia. No se cambió el código, no se consumieron altas repetidas ni se promovió el despliegue ante esta frontera rota.

## Auth habilitada y validación para promoción

- El usuario aportó una captura del proyecto correcto con Allow anonymous sign-ins activo. La nueva comprobación pública del proyecto confirmó `external.anonymous_users=true`.
- Testing reanudó la integración real: 16 comprobaciones pasaron, sin fallos ni omisiones; incluyen sesiones, CRUD, persistencia, aislamiento API y ataques directos RLS/validaciones SQL. Continúa la revisión completa en Chrome.
- Antes de revisar la versión alojada y promover se consultaron otra vez https://vercel.com/docs/rest-api/projects/update-protection-bypass-for-automation y https://vercel.com/docs/deployments/promoting-a-deployment. La comprobación del despliegue protegido usará un bypass temporal solo en memoria, que se revocará al acabar; la aceptación pública posterior no lo usará.

- Testing consultó https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ para revisar foco contenido, navegación por teclado y retorno de foco de los diálogos; corrigió expectativas del arnés de pruebas sin cambios de aplicación.
- Tras el dictamen APTO y el CRUD HTTPS comprobado, se promovió el mismo despliegue de producción. La URL pública asignada es https://speed-paradigm-ai-agents-challenge.vercel.app y respondió HTTP 200 a una petición sin cookies ni Authorization. La verificación pública independiente no usa bypass ni una sesión Vercel.

## Auditoría contra el enunciado literal

- Se conservó el texto recibido en `docs/enunciado.md`. El usuario pidió comprobar el cumplimiento literal y realizar otra auditoría de calidad.
- Antes de cambiar protección se consultó https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication y la ayuda instalada `project protection disable --help`.
- Hallazgo de infraestructura: `ssoProtection.deploymentType=all_except_custom_domains` seguía activo, aunque la URL final ya era pública. El enunciado pide expresamente quitar Vercel Authentication; se desactivará únicamente en `speed-paradigm-ai-agents-challenge`, sin cambiar los controles de sesión/RLS de la aplicación ni otros proyectos.
- Se consultaron también https://vercel.com/docs/plans/hobby y https://supabase.com/pricing para contrastar planes gratuitos durante la auditoría. Las comprobaciones ejecutadas y los límites se registrarán por requisito en `docs/auditoria.md`.

- Se revisó https://learn.chatgpt.com/docs/agent-configuration/subagents: los agentes personalizados de proyecto se definen en `.codex/agents/` y requieren `name`, `description` y `developer_instructions`. Las dos definiciones existentes incluyen esos campos y remiten a los Markdown de cada rol; no fue necesario cambiarlas.
- La desactivación explícita de Vercel Authentication terminó correctamente; la lectura posterior confirmó `ssoProtection=null`, `protectionBypass={}` y protección de forks conservada. La URL de producción y el enlace de despliegue devolvieron HTTP 200 sin cookies ni Authorization. La entrega sigue usando únicamente la URL principal de producción.
- Las inspecciones actuales confirmaron Vercel Hobby, Supabase Free/available y despliegue READY con destino production. No se aceptaron planes de pago.

- Develop consultó https://vercel.com/docs/deployments/environments y las fuentes de Authentication/Hobby antes de añadir al README los pasos reproducibles de despliegue gratuito, variables en Production, Vercel Authentication desactivado y comprobación privada de la URL principal. No cambió código de aplicación ni fue necesaria otra compilación por esta documentación.

- Testing volvió a consultar la documentación instalada de Next.js para Playwright/Route Handlers, https://playwright.dev/docs/browser-contexts y https://nodejs.org/docs/latest-v24.x/api/test.html antes de la nueva auditoría. La prueba de navegador se reforzó con una aserción explícita de cero cookies iniciales. Los contextos aislados de Chrome y las peticiones públicas no usan sesión de Vercel ni bypass.

## Acceso público y compatibilidad ampliada

- Orquestador consultó la guía de verificación de Vercel, la ayuda instalada de CLI `project inspect`, `firewall status` y `deploy --help`, https://vercel.com/docs/cli/deploy y https://vercel.com/docs/deployments/promoting-a-deployment antes de preparar la nueva publicación. El objetivo es abrir el enlace sin cuenta y usar un espacio persistente propio.
- La inspección del proyecto correcto confirmó `ssoProtection=null`, `passwordProtection=null`, `trustedIps=null` y ningún bypass. El firewall no tiene reglas propias ni bloqueos de IP; Attack Challenge y Bot Protection están desactivados. Las protecciones administradas por Vercel siguen activas. No se modificó la configuración de seguridad durante esta comprobación.
- https://nextjs.org/docs/architecture/supported-browsers y la documentación incluida en Next.js 16.4.6 definen el soporte de navegadores modernos. Cambiar idioma o zona horaria de una prueba no demuestra acceso desde otra ubicación física.
- Se consultaron https://supabase.com/docs/guides/auth/auth-anonymous y https://supabase.com/docs/guides/auth/rate-limits: las altas anónimas tienen límites por IP; con llamadas desde servidor los visitantes pueden compartir el límite de salida. No se eliminan controles ni se promete disponibilidad universal o capacidad ilimitada en el plan gratuito.
- El enlace personal y las preguntas del reclutador ya se leyeron privadamente. Solo se hizo la operación de lectura del formulario; no se enviaron respuestas ni se publica el enlace personal.

## Ayudas de acceso de Develop

Fuentes consultadas antes del cambio: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled, https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript y https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies. Decisión: ofrecer aviso legible sin JavaScript, detectar cookies deshabilitadas antes del alta anónima y explicar cómo permitir las cookies del sitio si la sesión recién creada no se conserva. Un error de una sesión previa sigue siendo distinto; no se reemplaza desde el cliente.

Se consultó `node_modules/next/dist/docs/03-architecture/supported-browsers.md`: Chrome/Edge/Firefox 111+ y Safari 16.4+. La compatibilidad MDN de https://raw.githubusercontent.com/mdn/browser-compat-data/main/api/AbortSignal.json confirma `AbortSignal.timeout` desde Safari 16, Firefox 100 y Chrome 103 (la implementación parcial antigua difiere solo en el nombre del error, que el cliente no distingue). No se confirmó un defecto de esa API dentro del soporte de Next.js y no se cambia por conjetura.

## Verificación de WebKit en un entorno independiente

- Antes de preparar `.github/workflows/public-access.yml`, Orquestador consultó https://docs.github.com/en/actions/concepts/billing-and-usage y https://playwright.dev/docs/ci. Los ejecutores estándar de GitHub son gratuitos en repositorios públicos; se confirmó `visibility=public` mediante la API del repositorio. Se usa únicamente `ubuntu-24.04`, con límite de ocho minutos, sin servicios adicionales, cachés ni subida de artefactos.
- Se resolvieron los tags oficiales `actions/checkout` v6 y `actions/setup-node` v6 a commits inmutables mediante `https://api.github.com/repos/actions/checkout/git/ref/tags/v6` y el endpoint equivalente de setup-node. El workflow tiene permisos de lectura, no conserva credenciales del checkout y no recibe secretos.
- El objetivo es verificar el mismo smoke real de WebKit contra producción desde otro entorno, porque el motor local rechazó TLS incluso en example.com. No se omite la validación HTTPS. El workflow solo se activa manualmente o al cambiar su propio archivo; no repite pruebas por cada cambio de documentación ni despliega la app.
- La ejecución inicial agotó ocho minutos durante la preparación de dependencias, antes de ejecutar el smoke. Se consultó https://playwright.dev/docs/docker y se verificó en Microsoft Artifact Registry que la imagen oficial `v1.65.1-noble` existe y coincide con la versión instalada de Playwright. Se cambia únicamente la preparación del job a esa imagen fijada por digest, que ya incluye motores y bibliotecas; se elimina la instalación del sistema y se acota el job a cinco minutos. No se relajan TLS ni las aserciones del test.
