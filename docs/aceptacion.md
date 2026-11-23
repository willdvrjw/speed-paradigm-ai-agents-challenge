# Aceptación y revisión independiente

Responsable: Testing. Fecha de inicio: 2026-11-23 (America/Bogota).

`PASS` significa comprobado con evidencia; `FAIL` identifica un defecto reproducido; `PENDIENTE` indica que falta implementación, acceso o verificación. Un plan, un archivo de configuración o un mock no prueba que un servicio esté operativo.

## Estado actual

**APROBADO TÉCNICAMENTE.** La aplicación está disponible en producción pública: https://speed-paradigm-ai-agents-challenge.vercel.app . Testing comprobó HTTP 200 sin autenticación ni redirección, 8/8 pruebas de API sobre HTTPS y 3/3 pruebas de Chrome en contextos limpios, sin bypass ni sesión Vercel. Auth anónima, datos reales, persistencia e aislamiento funcionan. Los dictámenes pendientes y errores 422 anteriores se conservan abajo como historial; el bloqueo de Auth ya está resuelto. Las preguntas y el enlace personal ya fueron recibidos y revisados privadamente; A17/A18 mantienen pendientes las respuestas personales y el envío único, sin publicar esos datos.

**Ampliación vigente de acceso:** la compilación b2e098a corrigió y verificó las ayudas para JavaScript/cookies. Pasaron cuatro configuraciones de navegador: Chrome, Edge y Firefox en Windows y WebKit con emulación móvil en Linux mediante CI real. Los bloqueos previos de sandbox/TLS Windows y preparación de CI se conservan como historial, sin atribuirlos a la aplicación. No se afirma una prueba de Safari/iPhone físico ni acceso mundial exhaustivo. La URL canónica apunta a b2e098a y responde 200 sin autenticación; las cifras de auditorías previas se conservan por fase.

La nueva auditoría contra el [enunciado literal](enunciado.md) volvió a ejecutar build, tipos, reglas, dependencias, 16/16 de API pública/Supabase-RLS y 3/3 de Chrome. Detectó y cerró una diferencia de infraestructura: Vercel Authentication seguía activo aunque la producción ya fuera pública; ahora Orquestador confirmó `ssoProtection=null` y Testing verificó ambos URLs sin redirección. El detalle literal, comandos y límites actuales están en [auditoria.md](auditoria.md).

## Matriz final de aceptación

Esta matriz refleja el resultado actual de la revisión y las ejecuciones reales. La evidencia cronológica de cada fase y sus límites se conserva después de la matriz.

| ID | Requisito | Estado | Evidencia o comprobación pendiente |
| --- | --- | --- | --- |
| A01 | Aplicación Next.js real con TypeScript | PASS | Next.js 16.4.6 y TypeScript 7.0.2. En la auditoría nueva Testing volvió a ejecutar build de producción y typecheck, ambos exit 0, y reinició el servidor con esa compilación (Ready). |
| A02 | Tres agentes con Markdown y delegación real | PASS | Inventario nuevo: Orquestador/Develop/Testing, los tres roles reales del equipo. Tres Markdown y ambos TOML rastreados, públicos y analizados; delegación y revisión reales, sin agentes adicionales. |
| A03 | Testing devuelve fallos y Develop los corrige | PASS | En la ampliación de acceso Testing reprodujo dos barreras sin JS/cookies; Develop corrigió b2e098a y Testing verificó 2/2 regresiones locales y HTTPS. Los ajustes de arnés y el hallazgo de infraestructura quedan separados de esas correcciones reales. |
| A04 | Base de datos gratuita Supabase o Firebase operativa | PASS | Supabase Free real, migración aplicada con TLS verificado; Auth anónima, CRUD persistente y ataques RLS/restricciones SQL ejecutados correctamente. |
| A05 | CRUD completo de tareas | PASS | Crear, consultar/recargar, editar, cambiar estado y eliminar persistió correctamente en API y Chrome; cancelar/confirmar borrado verificado. |
| A06 | Búsqueda, filtros y estados vacíos/carga/error | PASS | Chrome real verificó búsqueda combinada con filtros, ausencia de resultados, limpiar filtros, vacío inicial/final y error controlado con reintento que recupera el servicio real. |
| A07 | Validación y restricciones | PASS | Reglas, entradas inválidas por HTTP y restricciones SQL directas pasaron; longitud Unicode, blanco/control, estados/prioridades y propietario no permitido incluidos. |
| A08 | Aislamiento de espacios | PASS | Dos sesiones API y dos identidades Supabase reales; lectura/mutación ajena e INSERT/transferencia de propietario denegados, con integridad posterior de A comprobada. |
| A09 | Accesibilidad y adaptación | PASS | Chrome real: escritorio/móvil, teclado, foco contenido, Tab a campos, Escape/retorno y acción inicial segura en borrado; etiquetas, anuncios, error y ausencia de overflow verificados. |
| A10 | Calidad reproducible | PASS | Auditoría literal previa: build/tipos, 9/9 reglas, npm audit, 16/16 API/RLS y 3/3 Chrome. Ampliación b2e098a: build/tipos, 2/2 ayudas local y HTTPS, smokes Chrome/Edge/Firefox y WebKit Linux PASS; CI final real enlazada abajo. |
| A11 | Ausencia de claves API y secretos en repositorio | PASS | Nueva revisión: 4 commits, 60 snapshots únicos, 43 archivos rastreados, 7 valores de claves/credenciales y patrones examinados sin coincidencias; 14 archivos cliente frente a 12 valores configurados, 0 fugas/archivos prohibidos. Alcance en auditoria.md. |
| A12 | Repositorio GitHub público o accesible | PASS | https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge . GitHub API sin autenticación HTTP 200 informa `visibility:public`, rama main; README raw HTTP 200 con título Foco. |
| A13 | Despliegue gratis en producción | PASS | Versión actual de acceso b2e098a, despliegue dpl_DmwUnKjZstWcL3xebGTRiPDg8nFS, promovida en Hobby; Supabase Free. Conserva la URL pública canónica. Las evidencias f3d8d5f anteriores son históricas. |
| A14 | URL pública sin autenticación Vercel | PASS | Producción y URL directo devuelven 200 sin cookies/Authorization/bypass ni redirección. Vercel Authentication fue desactivado expresamente: lectura `ssoProtection=null`, `protectionBypass={}`. Chrome limpio completa el flujo. |
| A15 | README con arranque y demostración | PASS | README real con URL pública/repositorio, requisitos, instalación, SQL, variables por nombre, comandos, arquitectura y recorrido de demostración. |
| A16 | Credenciales de prueba si hay login | PASS | No existe formulario de login y Chrome público no presenta acceso Vercel. Sesión anónima creada automáticamente y CRUD real comprobado; no se necesitan credenciales de demostración. |
| A17 | Cuatro respuestas cortas del reclutador | PENDIENTE | Cuatro preguntas recibidas y revisadas privadamente por Orquestador; pendientes la confirmación de respuestas personales y el envío único. No se publican preguntas ni se inventan respuestas. |
| A18 | Entrega mediante enlace personal | PENDIENTE | Enlace recibido y revisado privadamente por Orquestador; envío único pendiente. No se publica enlace/token ni se envían mensajes o formularios por iniciativa de Testing. |

## Auditoría literal inicial y ampliación posterior

La matriz anterior incorpora el estado actual y la ampliación posterior; no depende exclusivamente de resultados de fases anteriores. [auditoria.md](auditoria.md) contiene la correspondencia de cada cláusula literal con su evidencia y estado. En la auditoría literal inicial no se encontraron defectos de aplicación; AUD-01 fue una diferencia de infraestructura corregida por Orquestador. La ampliación posterior de acceso sí reprodujo dos barreras de uso corregidas por Develop y verificadas por Testing, como se detalla a continuación. No se inventa ni se mezcla ese ciclo con ajustes del arnés.

Comprobaciones ejecutadas otra vez: `npm run build`, `npm run typecheck`, `npm test` (9/9), `npm audit --json` (0 vulnerabilidades informadas), `npm run test:integration` con `TEST_BASE_URL=https://speed-paradigm-ai-agents-challenge.vercel.app` (16/16, sin omisiones) y `npm run test:e2e` contra la misma URL (3/3 en 12.0 s). Se añadió al test principal una comprobación explícita de cero cookies iniciales y se inspeccionaron las capturas nuevas de escritorio/móvil. Las tareas sintéticas se limpiaron; no hubo 502 ni rate-limit. También se verificaron los Markdown/TOML públicos y el historial/cliente frente a claves reales y patrones, sin exponer valores.

## Ampliación actual de acceso público

Versión actual: b2e098a, `dpl_DmwUnKjZstWcL3xebGTRiPDg8nFS`. Testing reprodujo dos barreras de uso en producción anterior (sin JS y cookies reportadas como desactivadas), Develop corrigió layout/carga/ayuda de sesión y Testing comprobó 2/2 regresiones correctas en build local y 2/2 en HTTPS. No se redujo RLS, Origin, no-store ni privacidad de cookies. Un error TypeScript del nuevo arnés fue corregido por Testing y no se atribuye a Develop.

Se amplió solo el smoke pertinente por navegador: abrir con cero cookies/Vercel, sesión automática, crear/recargar/eliminar tarea propia, cookies privadas de primera parte, cero orígenes externos HTTP del cliente y cero errores de página. Chrome 158.0.8127.37 y Edge 158.0.4370.33 pasaron en Windows; Firefox 159.0 pasó en 14.4 s al ejecutar fuera del sandbox de herramientas con perfil temporal nuevo, sin modificar perfil del usuario ni desactivar protección del navegador. Se inspeccionaron capturas exitosas propias de Chrome y Edge.

WebKit 27.2 Windows pudo arrancar pero rechazó TLS antes de HTTP, también en example.com; el intento con CAs públicas ya existentes de Windows no lo resolvió y nunca se ignoró HTTPS. La primera CI [45227720380](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge/actions/runs/45227720380), commit bc38ed1, job 137878600725, terminó `cancelled` a las 17:34:57Z durante instalación; el smoke quedó `skipped`. Eso no fue PASS ni un fallo de app.

Se corrigió únicamente la preparación del mismo workflow con la imagen oficial Microsoft Playwright 1.65.1-noble fijada por digest, que ya contiene browsers/dependencias, y timeout de cinco minutos. Testing revisó esa corrección y la única ejecución adicional: [CI 45229713210](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge/actions/runs/45229713210), commit 2478547, job 137885614975, Ubuntu 24.04 en contenedor. Terminó **success**, paso WebKit móvil success; los logs reales muestran `1 passed (7.6s)` a las 17:38:32Z. Ejecutó el mismo smoke sobre la URL canónica pública con datos reales y sin bypass. Así quedan cuatro configuraciones aprobadas en tres familias de motor; el límite WebKit Windows se conserva solo como antecedente de ese entorno. No se realizaron más pruebas o cambios de app después del éxito.

Orquestador promovió la misma compilación probada y verificó GET canónico 200 sin redirección/cookies/Authorization/bypass y la presencia de la ayuda nueva. No se repitió la suite completa ni los smokes exitosos. El detalle reproducible, configuración de idiomas/zonas y fuentes oficiales está en [auditoria.md](auditoria.md). Son configuraciones de navegador y un runner remoto real, no una verificación de países/IP concretos; no se puede acreditar exhaustivamente todo dispositivo, versión, ubicación o política de red. El sitio necesita JavaScript, cookies propias y conectividad; ahora explica esas condiciones. Se detuvo solo el servidor local de pruebas de este repositorio al finalizar.

## Historial de revisión anterior

Las secciones siguientes conservan el avance cronológico, incluidos límites y rechazos de Auth que ya fueron resueltos. Al inicio Testing leyó `AGENTS.md`, `agents/develop.md` y `agents/testing/DIRECTRICES.md`, y solo existían instrucciones/documentación, sin aplicación, dependencias ni despliegue. Para conocer el resultado vigente deben usarse el estado y la matriz final anteriores y la validación pública al final del documento.

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

## Dictamen previo al despliegue de preparación

Testing revisó los componentes, API y cliente Supabase completos. No encontró un defecto reproducible de aplicación en la inspección: `server-only`, clave publicable, identidad verificada por petición, propietario derivado en servidor, RLS y filtros propios, cookies HttpOnly/Lax/Secure en producción, comprobación Origin, JSON acotado y `no-store`. No se utiliza SDK Supabase en el navegador ni una clave administrativa para las tareas.

| Comprobación ejecutada por Testing | Resultado |
| --- | --- |
| `npm run typecheck` | PASS, exit 0. |
| `npm test` | PASS, 9/9, sin omisiones; incluye límites Unicode y caracteres de control. |
| `npm audit --json` | PASS en esta consulta: 0 vulnerabilidades conocidas informadas, exit 0. No equivale a garantía absoluta. |
| `npm start -- --hostname 127.0.0.1 --port 3000` | Servidor de producción Ready en 353 ms; Next.js 16.4.6. |
| `npm run test:e2e -- tests/e2e/shell.spec.ts` | PASS, 1 prueba en Chrome real: documento español, estructura, error accesible, skip-link/foco y ausencia de overflow a 320/390/768/1440 px. |
| Escaneo de `.next/static` contra valores configurados | PASS: 14 archivos y 12 valores comparados solo en memoria, 0 coincidencias; no se imprimieron valores. |
| Revisión de `.artifacts/vercel-dry.json` y archivos de envío | PASS: 40 archivos regulares comparados contra 7 valores sensibles, 0 coincidencias y 0 archivos sensibles incluidos. El dry-run enumera además 3 directorios vacíos ignorados sin contenido. |

La primera ejecución del test de documento falló por un selector ambiguo de Testing: Next.js añade un anunciador automático con `role=alert`. Se limitó el selector al elemento `main` y la segunda ejecución pasó; no se modificó aplicación ni se registra ese error de prueba como un fallo de Develop. Se inspeccionaron visualmente las capturas de escritorio y móvil generadas por la ejecución correcta, sin cortes de contenido ni desbordamiento.

Testing leyó la evidencia de aplicación SQL `.artifacts/migration-result.json`: conexión cifrada con certificado comprobado, RLS habilitado, cuatro políticas y seis restricciones; SHA-256 `afa791278e7b40d77dda4d4ccc2018a2b767d55bd8275c1c16323af0ac92c1ed`. El archivo corresponde a la ejecución de Orquestador; todavía no se han ejecutado los ataques directos con usuarios anónimos porque la habilitación de Anonymous Sign-Ins sigue pendiente de la acción del usuario.

**Dictamen:** apto para desplegar la compilación de producción sin asignar todavía el dominio principal. La promoción y aceptación funcional permanecen PENDIENTES de CRUD/recarga, aislamiento/RLS y flujo completo de navegador con Supabase real. No se autoriza afirmar que la demo está operativa basándose solo en esta revisión previa.

### Comprobaciones adicionales sin crear usuarios

Para avanzar sin consumir altas mientras Anonymous Sign-Ins sigue deshabilitado se separaron dos escenarios independientes y se ejecutó:

```text
TEST_BASE_URL=http://localhost:3000
node --env-file-if-exists=.env.local --test --test-name-pattern="sin sesión|sin identidad" tests/integration/api.test.mjs tests/integration/rls.test.mjs
tests 2; pass 2; fail 0; exit 0
```

Se comprobaron HTTP 401 al leer/crear sin sesión, 403 para Origin ausente/null/ajeno sin fijar cookies, 400 para JSON malformado y 413 para más de 8 KiB, todos con `no-store`. El SELECT directo a `public.tasks` con el rol `anon` devolvió error PostgreSQL `42501` y ninguna fila. No se ejecutaron en este comando los escenarios que crean identidades ni el CRUD con sesiones válidas.

El servidor local acepta conexiones a `127.0.0.1`, pero Next.js genera en los handlers el origen canónico `http://localhost:3000`. Se reprodujo que Origin `127.0.0.1` da 403 y Origin `localhost` avanza a la comprobación de sesión. Se corrigió el origen predeterminado del arnés de Playwright a `localhost`, coherente con el README, sin relajar la protección de aplicación. En el despliegue de preparación, Orquestador comprobó que Origin con el hostname real sí avanza a Auth. Es un límite del alias local utilizado por el arnés, no evidencia de un fallo de persistencia.

Testing comprobó el repositorio público mediante peticiones sin cookies ni Authorization: metadatos GitHub HTTP 200 con `visibility:public` y `default_branch:main`, y README raw HTTP 200 cuyo primer renglón es `# Foco — Un paso a la vez`. Se examinó el historial Git actual: 2 commits y 49 snapshots de archivos distintos comparados con 7 valores sensibles cargados solo en memoria, además de prefijos de credenciales, sin coincidencias. No hay `.env` real, `.tools/`, `.vercel/` ni `.artifacts/` versionados. Estos escaneos detectan las clases y valores examinados; no son una prueba universal de ausencia de cualquier secreto desconocido.

## Dictamen al cierre de esta fase

**PENDIENTE funcional. No hay un defecto de aplicación identificado que requiera otro cambio de Develop.** Las comprobaciones locales y estáticas ejecutadas pasaron dentro de su alcance. La habilitación de Auth anónima es un requisito externo todavía pendiente: Orquestador volvió a comprobar `settings.external.anonymous_users=false`. El usuario indicó que los términos ya estaban aceptados, pero todavía no consiguió acceder al panel de Supabase para activar Anonymous Sign-Ins. No se interpreta ese bloqueo como un PASS ni como un fallo reproducible del código.

Orquestador creó un despliegue de producción de preparación en el espacio `willdvrs-projects` (Hobby):

| Dato observado | Valor |
| --- | --- |
| Estado del build | READY |
| ID | `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4` |
| Commit de aplicación subido | `f3d8d5f` |
| URL de preparación | https://speed-paradigm-ai-agents-challenge-g6mgnzg9p-willdvrs-projects.vercel.app |
| Dominio público/promoción | No asignado / no promovido |
| Acceso HTTP sin sesión | 302 a Vercel SSO; no cumple publicación pública |
| Repositorio público | https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge |

Las comprobaciones autenticadas de Orquestador sobre esa preparación devolvieron home 200 con Foco, GET de tareas sin sesión 401 con `no-store`, POST de sesión sin Origin 403 y POST con Origin correcto 503 debido al requisito de Auth. No prueban CRUD operativo ni reemplazan la visita pública privada exigida. Orquestador revocó mediante la API oficial el bypass temporal de pruebas, comprobó que no quedaban bypasses y eliminó su archivo local de estado; ningún secreto de acceso se registra aquí.

El servidor de producción local se mantiene disponible en `http://localhost:3000` para retomar. Al habilitar Auth anónima, los siguientes pasos de Testing son ejecutar la integración completa, los ataques RLS entre dos identidades, y `npm run test:e2e` contra datos reales. Después corresponde probar el despliegue preparado y, si pasa, que Orquestador promueva y verifique HTTP y navegador limpios en la URL pública definitiva. CRUD, persistencia tras recarga, aislamiento autenticado y flujo completo de navegador continúan PENDIENTES hasta esas ejecuciones.

## Reanudación tras confirmar Anonymous Sign-Ins

El usuario confirmó que activó **Allow anonymous sign-ins** y guardó. Testing releyó `AGENTS.md` y sus directrices y revisó el estado limpio del repositorio en commit `a61c82d`. Orquestador volvió a observar `anonymous_users=false` en los ajustes y pidió comprobar la frontera de Auth real una sola vez, sin depender de esa lectura de configuración.

Testing ejecutó exactamente una llamada `supabase.auth.signInAnonymously()` desde Node.js con `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`, sin persistir sesiones ni imprimir claves o tokens. Resultado observado para `enwgedmpnjnlyxjzbica.supabase.co`:

```text
success: false
error.name: AuthApiError
error.code: anonymous_provider_disabled
error.status: 422
error.message: Anonymous sign-ins are disabled
```

No se obtuvo sesión ni se creó un usuario. El resultado acredita un rechazo real del proveedor y no solo una posible caché de la consulta de ajustes. Se detuvieron las comprobaciones dependientes: no se ejecutaron CRUD autenticado, ataques RLS entre identidades ni E2E completo, ni se repitieron altas. Tampoco se repitió build o auditoría sin cambios de aplicación.

**Dictamen de esta reanudación: PENDIENTE funcional por configuración externa de Auth.** No se identificó un defecto nuevo de aplicación y no hay una corrección de Develop solicitada. La promoción y la aceptación pública continúan pendientes hasta que el proyecto utilizado por la aplicación permita realmente el inicio anónimo y pasen las pruebas preparadas.

### Criterio de foco del diálogo antes de continuar E2E

Con Auth habilitado, la primera ejecución completa de navegador encontró una expectativa demasiado específica de Testing: exigía foco inicial en Título, aunque Chrome había enfocado Cerrar dentro del diálogo con contorno visible. Antes de cambiar la prueba se consultó [WAI APG: Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), que exige foco contenido en el modal, navegación interna, cierre con Escape y retorno al invocador; no exige que el campo Título reciba siempre el foco inicial. Se ajustará la prueba a ese contrato comprobando además que Tab llega a Título y que la confirmación de borrado no enfoca inicialmente la acción destructiva. No se cambia aplicación ni se registra esta expectativa del arnés como un defecto de Develop.

## Validación funcional real tras habilitar Auth

Orquestador confirmó la lectura actualizada `external.anonymous_users=true` y el usuario aportó la configuración guardada del mismo proyecto. Testing retomó las pruebas preparadas sin cambiar aplicación ni repetir build o reglas unitarias que ya habían pasado.

### Integración completa

```text
TEST_BASE_URL=http://localhost:3000
npm run test:integration
tests 16; pass 16; fail 0; cancelled 0; skipped 0; todo 0; exit 0
```

Los 16 resultados incluyen cuatro pruebas principales y doce subpruebas: frontera sin sesión/Origin/JSON; sesión anónima y cookies sin tokens JSON; creación y lectura persistida; aislamiento de dos visitantes API; entradas inválidas y owner_id no permitido; CSRF con cookie válida; edición/estado/borrado; rol anon sin lectura; dos identidades Supabase; INSERT propio; lectura ajena; UPDATE/DELETE ajenos; INSERT como otro propietario y transferencia de propiedad denegados; y restricciones SQL sobre valores inválidos. El acceso de la aplicación y los ataques directos usan únicamente la clave publicable y las sesiones de cada visitante. Las tareas creadas se eliminan con sus propias sesiones; las identidades anónimas quedan sujetas a retención del proveedor.

### Navegador real

Primera ejecución `npm run test:e2e`: tres escenarios, dos PASS y un fallo de expectativa del arnés sobre foco inicial, descrito en la sección anterior. El caso de error/reintento recuperó la sesión real al retirar exclusivamente la interrupción de conexión; el documento y la adaptación pasaron. No se simuló la persistencia del flujo principal.

Tras ajustar el contrato de foco de Testing según WAI APG se repitió solamente el escenario afectado:

```text
TEST_BASE_URL=http://localhost:3000
npm run test:e2e -- tests/e2e/board.spec.ts --grep visitante
1 passed (7.5s); exit 0
```

Resultado final: los tres escenarios distintos de navegador están aprobados sobre el mismo código de aplicación. El flujo principal comprobó visitante sin login, crear/recargar, cambiar estado, buscar y combinar filtros, limpiar resultados, editar desde viewport móvil, persistir la edición al recargar, cancelar y confirmar borrado, y volver al estado vacío. También comprobó cookies HttpOnly, ausencia de tokens en localStorage, ausencia de excepciones de página, foco dentro del diálogo, acceso a Título con Tab, cierre con Escape/retorno y cancelación de borrado con teclado. Se inspeccionaron las capturas de escritorio y móvil con la tarea sintética real, sin contenido cortado ni desbordamiento horizontal.

### Preparación HTTPS y dictamen de promoción

Testing leyó `.artifacts/staged-verification.json`, producido por Orquestador contra `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4`: sesión 200 con cookies HttpOnly/Secure/Lax; acceso sin sesión 401; creación 201; lectura persistida; actualización confirmada; borrado confirmado por GET 404. El registro indica limpieza de la tarea, revocación del bypass temporal y cero bypasses restantes. Esta evidencia autenticada de preparación no sustituye la visita pública limpia.

**Dictamen: APTO PARA PROMOVER la compilación preparada.** No hay cambios de aplicación pendientes ni defectos reproducibles identificados. Después de la promoción falta la comprobación independiente de HTTP sin cookies/Authorization y Chrome en contexto limpio contra la URL pública definitiva, con integración y flujo de datos reales sobre HTTPS. A13/A14 permanecen PENDIENTES hasta esa validación.

## Validación final de producción pública

Orquestador promovió el mismo despliegue `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4` y asignó el dominio público. Testing validó de forma independiente la URL definitiva, sin importar cookies, almacenamiento de sesión o cabeceras de Vercel, y sin usar enlace o secreto de bypass.

| Entregable | URL real |
| --- | --- |
| Aplicación pública | https://speed-paradigm-ai-agents-challenge.vercel.app |
| Repositorio público | https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge |

La petición HTTP inicial de Testing, sin cookies ni Authorization y sin seguir redirecciones, devolvió `status=200`, `Location=null`, título `Foco — Un paso a la vez` y ninguna pantalla de login Vercel.

### API pública HTTPS

```text
TEST_BASE_URL=https://speed-paradigm-ai-agents-challenge.vercel.app
node --test tests/integration/api.test.mjs
tests 8; pass 8; fail 0; cancelled 0; skipped 0; todo 0; exit 0
```

Pasaron sesión anónima con JSON público sin tokens, cookies HttpOnly/Secure/SameSite=Lax, `no-store`, CRUD real persistente, dos visitantes aislados, acceso ajeno denegado, entradas inválidas, CSRF con cookie válida, edición/estado y borrado confirmado con una lectura posterior. No se repitieron los ataques RLS directos porque ya habían pasado contra la misma base de datos y no cambió su configuración ni el código.

### Chrome público en contextos limpios

```text
TEST_BASE_URL=https://speed-paradigm-ai-agents-challenge.vercel.app
npm run test:e2e
3 passed (11.6s); exit 0
```

Los tres escenarios pasaron en una única ejecución final, sin omisiones: flujo completo real de visitante en escritorio y móvil; error controlado de conexión con recuperación real; y documento/error accesibles a 320/390/768/1440 px. El flujo principal no utiliza mocks de datos ni de Supabase. Verificó alta/recarga, cambio de estado, búsqueda y filtros combinados, edición móvil persistente, cancelación y confirmación de borrado, teclado/foco/Escape, ausencia de excepciones de página y ausencia de tokens en localStorage. Las tareas sintéticas se eliminaron con sus respectivas sesiones y el navegador volvió al estado vacío.

Testing abrió e inspeccionó las capturas públicas `desktop-task.png` y `mobile-task.png` generadas en `test-results/`; muestran datos sintéticos reales y el contenido principal usable sin desbordamiento ni cortes. El enlace «Ir al tablero» visible en la captura móvil corresponde al foco de navegación por teclado. Las capturas e informes locales permanecen excluidos de Git.

**Dictamen final de esa fase histórica: APROBADO TÉCNICAMENTE.** No se identificaron defectos de aplicación pendientes. El ajuste del arnés de foco se fundamentó en WAI APG y quedó separado de la revisión de Develop; no se inventaron fallos ni correcciones de aplicación. En aquel momento quedaban datos del proceso del reclutador por recibir. El estado administrativo vigente se refleja en la matriz inicial: preguntas y enlace recibidos/revisados privadamente, pendientes respuestas personales y envío único. La ampliación posterior de acceso está documentada por separado y no altera los resultados observados de esta fase.
