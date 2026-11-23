# Aceptación y revisión independiente

Responsable: Testing. Fecha de inicio: 2026-11-23 (America/Bogota).

`PASS` significa comprobado con evidencia; `FAIL` identifica un defecto reproducido; `PENDIENTE` indica que falta implementación, acceso o verificación. Un plan, un archivo de configuración o un mock no prueba que un servicio esté operativo.

## Estado inicial

Se leyeron `AGENTS.md`, `agents/develop.md` y `agents/testing/DIRECTRICES.md`. Al comenzar esta revisión solo existían instrucciones y documentación, sin aplicación, dependencias, repositorio Git ni despliegue. Esta matriz se actualizará sobre el resultado real de Develop.

| ID | Requisito | Estado | Evidencia o comprobación pendiente |
| --- | --- | --- | --- |
| A01 | Aplicación Next.js real con TypeScript | PENDIENTE | Faltan implementación y dependencias. Verificar versiones exactas y `npm run build`. |
| A02 | Tres agentes con Markdown y delegación real | PENDIENTE | Testing comprobó los tres Markdown y dos TOML válidos, y participó en la revisión independiente de la arquitectura de Develop. Todavía no hay archivos rastreados ni commits; faltan versión publicada y revisión del código. |
| A03 | Testing devuelve fallos y Develop los corrige | PENDIENTE | Revisar una implementación real; registrar hallazgos, corrección y nueva ejecución sin inventar fallos. |
| A04 | Base de datos gratuita Supabase o Firebase operativa | PENDIENTE | Orquestador gestiona provisión y acceso. Verificar plan gratuito, migración aplicada y persistencia tras recarga. |
| A05 | CRUD completo de tareas | PENDIENTE | Crear, consultar, editar, cambiar estado y borrar con confirmación, comprobando resultado persistido. |
| A06 | Búsqueda, filtros y estados vacíos/carga/error | PENDIENTE | Verificar comportamiento real con datos del visitante y errores controlados. |
| A07 | Validación y restricciones | PENDIENTE | Casos vacíos, espacios, longitudes límite, tipos/estados/prioridades inválidos; probar API y base de datos. |
| A08 | Aislamiento de espacios | PENDIENTE | Dos identidades independientes; intentar leer, modificar, borrar e insertar como otro usuario. |
| A09 | Accesibilidad y adaptación | PENDIENTE | Móvil/escritorio, teclado, etiquetas, foco visible, diálogos y anuncios de estado. |
| A10 | Calidad reproducible | PENDIENTE | Compilación, tipos y pruebas significativas ejecutadas. Registrar comandos, versiones y resultados. |
| A11 | Ausencia de claves API y secretos en repositorio | PENDIENTE | Revisar archivos rastreados, historial y bundle cliente; `.gitignore` existe, pero no hay repositorio todavía. |
| A12 | Repositorio GitHub público o accesible | PENDIENTE | Falta URL real y comprobación del acceso del evaluador. |
| A13 | Despliegue gratis en producción | PENDIENTE | Orquestador comprobó acceso CLI al espacio personal `willdvrs-projects`, plan Hobby. Todavía faltan aplicación publicada y URL de producción real; el acceso CLI no acredita despliegue. |
| A14 | URL pública sin autenticación Vercel | PENDIENTE | GET sin cookies/Authorization y navegador privado sin sesión. Confirmar que no sea vista previa ni enlace de bypass. |
| A15 | README con arranque y demostración | PENDIENTE | Faltan instrucciones reproducibles, variables por nombre y recorrido de evaluación. |
| A16 | Credenciales de prueba si hay login | PENDIENTE | Diseño previsto sin formulario de login. Confirmar comportamiento final; si se mantiene, indicar que no se necesitan credenciales. |
| A17 | Cuatro respuestas cortas del reclutador | PENDIENTE | El texto exacto de las cuatro preguntas no fue incluido en el encargo. No inventarlas. |
| A18 | Entrega mediante enlace personal | PENDIENTE | El enlace personal no fue incluido; preparar los entregables sin enviar mensajes ni formularios por iniciativa propia. |

## Contrato de seguridad recomendado a Develop

La aplicación puede abrirse sin formulario de acceso y, aun así, usar una identidad anónima emitida por Supabase Auth. `signInAnonymously()` crea un usuario que accede como rol `authenticated`; la clave pública por sí sola no crea esa identidad. La propiedad de cada tarea debe derivarse de la identidad verificada, nunca de un identificador de espacio elegido por el navegador.

- RLS habilitado sobre las tablas expuestas. SELECT y DELETE comprueban `owner_id = auth.uid()`; INSERT usa `WITH CHECK`; UPDATE usa `USING` y `WITH CHECK`, de forma que no permita reasignar la propiedad.
- No permitir CRUD público general con el rol `anon`, ni usar una clave administrativa para el acceso habitual del visitante.
- No compartir datos o metadatos privados mediante caché estática. La documentación de Supabase advierte del riesgo con usuarios anónimos y render estático de Next.js.
- Contrato acordado por Orquestador y Develop: `@supabase/ssr` solo en servidor, Route Handlers con cookies HttpOnly/SameSite=Lax/Secure en producción; navegador sin SDK Supabase ni tokens en localStorage. Las API verifican la identidad con `getUser()`, usan el cliente de la sesión y nunca `service_role`.
- Las mutaciones, incluida la creación de sesión, comprueban el origen de la petición. Las respuestas privadas llevan `Cache-Control: no-store`. Las API de tareas rechazan peticiones sin sesión válida.

## Plan de pruebas sobre la implementación

| Grupo | Escenario | Resultado verificable |
| --- | --- | --- |
| Reglas | Título vacío, solo espacios y límite de longitud | Rechazo comprensible; no se crea ni modifica ningún registro. |
| Reglas | Estado, prioridad, identificador o tipo incorrectos | API/base de datos rechazan la entrada; no hay corrupción ni 500 accidental. |
| Persistencia | Crear una tarea con texto único y recargar | Misma tarea recuperada de Supabase/Firebase. |
| CRUD | Editar título y prioridad, cambiar estado, recargar | Todos los valores persisten en la misma tarea. |
| Borrado | Cancelar y luego confirmar eliminación | Cancelar conserva el registro; confirmar lo elimina y la recarga lo verifica. |
| Aislamiento | Sesiones A y B con tareas distintas | Ninguna lista o búsqueda revela registros del otro visitante. |
| Aislamiento | B intenta GET/PATCH/DELETE con el ID conocido de A | Cero filas afectadas o denegación; una lectura posterior de A confirma integridad. |
| Aislamiento | B intenta INSERT/UPDATE asignando owner_id de A | Denegación por política; ninguna fila queda asignada a A por B. |
| Aislamiento | Petición sin identidad autenticada | Sin acceso a los datos del tablero. |
| Sesión | Inspeccionar cookies de sesión tras crear visitante | HttpOnly, SameSite=Lax, Secure en producción; ningún token en cuerpo JSON ni localStorage. |
| CSRF | POST/PATCH/DELETE con Origin ajeno, ausente o `null` | Mutación denegada antes de escribir datos o crear sesión. |
| Caché | Respuestas de sesión y tareas | `Cache-Control: no-store`; nunca reutilizar datos de otro visitante. |
| Filtros | Combinar búsqueda y filtros, limpiar filtros | Intersección correcta; el estado sin resultados ofrece recuperación. |
| Error | Fallo de red o servicio no disponible | Mensaje accesible y acción para reintentar; no se afirma éxito. |
| Interfaz | Teclado y pantallas móvil/escritorio | Controles operables, foco visible, sin contenido principal cortado ni desbordamiento horizontal. |
| Producción | Visita anónima de URL final | HTML de la aplicación y flujo funcional, sin pantalla de acceso Vercel. |

Usar pruebas unitarias para reglas de negocio independientes y pruebas de integración para restricciones/aislamiento. Las pruebas de interfaz se ejecutarán contra compilación de producción cuando el entorno lo permita; no se sustituye la verificación real de la base de datos por interceptar todas sus respuestas.

## Fuentes oficiales consultadas antes de preparar el contrato

| Herramienta | Documentación | Decisión de revisión |
| --- | --- | --- |
| Supabase Auth | https://supabase.com/docs/guides/auth/auth-anonymous | Demo sin formulario con identidad anónima; distinguir usuario autenticado y clave pública. |
| Supabase PostgreSQL | https://supabase.com/docs/guides/database/postgres/row-level-security | Probar políticas de lectura y mutación, incluida reasignación de propietario. |
| Next.js | https://nextjs.org/docs/app/guides/testing/playwright | Priorizar pruebas de interfaz contra build de producción. |
| Playwright | https://playwright.dev/docs/browser-contexts | Separar contextos de navegador para los visitantes de prueba. |
| Node.js 24 | https://nodejs.org/docs/latest-v24.x/api/test.html | Evaluar el runner nativo para reglas puras sin dependencias innecesarias. |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/creating-a-client | Sesión en cookies, identidad verificada y cuidados de caché. |
| Next.js cookies | https://nextjs.org/docs/app/api-reference/functions/cookies | Cookies asincrónicas en Route Handlers y atributos de seguridad. |
| HTTP Origin | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin | Validar origen en mutaciones desde navegador. |

## Dictamen inicial

PENDIENTE. No se ejecutaron pruebas de aplicación, base de datos ni despliegue porque todavía no existía una implementación que revisar. No hay aprobación final de Testing.

## Revisión documental de Develop — primera iteración

Se inspeccionaron `docs/arquitectura.md` y `docs/documentacion-develop.md`, además de las instrucciones de roles y sus definiciones TOML. Se consultó el esquema oficial de [subagentes Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents) antes de validar la configuración.

| Comprobación documental | Estado | Evidencia observada |
| --- | --- | --- |
| Instrucciones Markdown de los tres roles | PASS | Los tres archivos existen, son legibles en UTF-8 y asignan implementación a Develop y revisión independiente a Testing. |
| Sintaxis y campos de agentes personalizados | PASS | Los dos TOML se analizaron con `tomllib` de Python 3.13; contienen `name`, `description` y `developer_instructions`. Los nombres son `develop` y `testing`; las rutas Markdown referidas existen. |
| Arquitectura dentro del alcance del encargo | PASS | Next.js, Supabase, app simple sin formulario de login y tres agentes del proceso de desarrollo; no se añaden servicios de pago ni agentes de IA en runtime. |
| Contrato de sesión y aislamiento | PASS | La propuesta usa cliente por petición, cookies HttpOnly, verificación de identidad, RLS por propietario, Origin en mutaciones y `no-store`. Esta aprobación se refiere al diseño, no a su ejecución. |
| Exclusión de estado local y variables reales | PASS | `git check-ignore` reconoce `.tools/`, `.env.local`, `.vercel/` y `.artifacts/`; `.env.example` permanece permitido. |
| Herramientas locales para siguientes comprobaciones | PASS | Node `v24.22.3`, Git `2.56.0.windows.4`; `git rev-parse --is-inside-work-tree` devuelve `true`. |
| Archivos versionados y commit verificable | PENDIENTE | `git ls-files` devuelve vacío y la rama `main` aún no tiene commits. |
| Implementación, build y pruebas de aplicación | PENDIENTE | Todavía no existen `package.json`, código de app ni dependencias de aplicación. |

No se encontraron defectos reproducibles en los Markdown, TOML o arquitectura revisados. La falta de implementación, integración y despliegue se conserva como trabajo pendiente, sin inventar fallos para simular un ciclo de corrección. El análisis TOML se ejecutó correctamente mediante script por stdin después de corregir una incidencia de comillas de la invocación de Python; no se modificó ningún archivo de aplicación.

El dictamen global sigue **PENDIENTE**. Vercel deniega acceso al equipo (403) y Supabase aún requiere conexión, según el estado comunicado por Orquestador. Ninguna comprobación documental anterior acredita persistencia, seguridad ejecutada ni disponibilidad pública.

## Preparación de la revisión de implementación

El usuario autorizó vincular y desplegar la aplicación. Orquestador delegó implementación real a Develop y pruebas independientes a Testing. Esta fase no modifica código de aplicación ni acredita una integración operativa.

- `tests/tasks.test.mjs`: reglas de título, descripción, enumeraciones, tipos, campos extra, edición parcial e identificadores.
- `tests/security.test.mjs`: Origin exacto, ausencia, `null`, dominios parecidos, puertos/protocolos diferentes y cabeceras reenviadas manipuladas.
- `tests/integration/api.test.mjs`: sesiones distintas, cookies privadas, no-store, CRUD persistente, validación, acceso ajeno y CSRF mediante peticiones HTTP reales a `TEST_BASE_URL`.
- `tests/integration/rls.test.mjs`: dos usuarios Supabase anónimos y ataques directos contra PostgreSQL/RLS con la clave pública; no utiliza una clave administrativa. Elimina las tareas creadas por la prueba. Las identidades anónimas emitidas permanecen sujetas a la retención del proveedor.
- Se comprobó sintaxis de los cuatro archivos con Node.js `--check`; esto solo acredita sintaxis, no que los escenarios funcionen.
- Las pruebas de aplicación, integración y navegador siguen PENDIENTES hasta disponer del código, servicio real y URL. Si falta configuración, una prueba omitida no se contará como PASS.

Fuentes oficiales: [Node.js test runner](https://nodejs.org/docs/latest-v24.x/api/test.html), [TypeScript en Node.js](https://nodejs.org/docs/latest-v24.x/api/typescript.html), [Playwright API](https://playwright.dev/docs/api-testing) y [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security). Sus decisiones están registradas también en `docs/documentacion.md`.

### Vinculación y límite externo de Supabase

Testing leyó `.vercel/project.json`: proyecto `speed-paradigm-ai-agents-challenge`, ID `prj_NLhkN9WSAVR2Clr4rMgq7IquhRFH`, organización `team_aSBnvwYurH5FI3MxvxM3zssf`. Esto acredita la vinculación local y coincide con el proyecto que Orquestador inspeccionó; no acredita una aplicación desplegada. Orquestador informó framework Next.js y runtime Node 24 configurados.

`git check-ignore` confirma exclusión de `.env.local`, `.vercel/project.json` y `.tools/vercel-config/auth.json`. `.env.example` no está ignorado. No se leyó contenido de secretos para esta comprobación.

La provisión Supabase Free requiere aceptación personal de términos, según el resultado `integration_terms_acceptance_required` comunicado por Orquestador. No hay PASS de base de datos ni de persistencia. Develop tiene autorización para implementar el código real con el contrato acordado mientras se resuelve ese requisito; Testing verificará reglas, tipos y compilación antes de la integración, manteniendo cada resultado por separado.

### Primera ejecución de reglas sobre código real

Comando ejecutado por Testing con Node.js 24.22.3:

```text
node --test tests/tasks.test.mjs tests/security.test.mjs
tests 9; pass 9; fail 0; skipped 0; exit 0
```

PASS de estas nueve pruebas sobre `lib/tasks.ts` y `lib/security.ts` reales: normalización/defaults; título; descripción/enumeraciones; cuerpo y campos extra; actualización parcial; UUID; Origin permitido; Origin ajeno/ausente/null; cabeceras reenviadas manipuladas. Este resultado no acredita todavía las restricciones SQL ni las rutas HTTP. Se observaron advertencias de detección ESM porque `package.json` aún estaba en escritura, sin fallo de ejecución; el scaffold final y su build siguen pendientes de revisión.

Se prepararon `playwright.config.ts` y `tests/e2e/board.spec.ts` contra los componentes reales: contexto de navegador limpio, CRUD y recarga, búsqueda/filtros, viewport móvil, teclado/foco, confirmación/cancelación de borrado, cookies y error/reintento. El flujo principal no intercepta ni simula la persistencia; un caso separado aborta exclusivamente la conexión inicial para verificar el estado de error. Aún no se ejecutaron estos escenarios de navegador.

### Revisión previa de la migración

Testing inspeccionó `supabase/migrations/202611230001_create_tasks.sql` antes de su aplicación. No encontró un bloqueo documental: transacción, propietario derivado de UID, restricciones de campos, RLS explícito con cuatro políticas, `anon` sin privilegios, UPDATE limitado a columnas editables y trigger con `search_path` fijo. La reasignación `owner_id` está denegada por los permisos de columna y también protegida por `WITH CHECK`; un error de esa prueba no se atribuirá solo a RLS.

Esta revisión permite a Orquestador continuar con la aplicación de la migración al recurso nuevo autorizado. Aplicación, Auth anónima y pruebas directas siguen PENDIENTES. Se consultaron [PostgreSQL GRANT](https://www.postgresql.org/docs/current/sql-grant.html), [Row Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) y [Triggers](https://www.postgresql.org/docs/current/trigger-definition.html).
