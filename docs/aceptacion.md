# Aceptación y revisión independiente

Responsable: Testing. Fecha de inicio: 2026-11-23 (America/Bogota).

`PASS` significa comprobado con evidencia; `FAIL` identifica un defecto reproducido; `PENDIENTE` indica que falta implementación, acceso o verificación. Un plan, un archivo de configuración o un mock no prueba que un servicio esté operativo.

## Estado actual

**APROBADO TÉCNICAMENTE.** La aplicación está disponible en producción pública: https://speed-paradigm-ai-agents-challenge.vercel.app . Testing comprobó HTTP 200 sin autenticación ni redirección, 8/8 pruebas de API sobre HTTPS y 3/3 pruebas de Chrome en contextos limpios, sin bypass ni sesión Vercel. Auth anónima, datos reales, persistencia e aislamiento funcionan. Los dictámenes pendientes y errores 422 anteriores se conservan abajo como historial; el bloqueo de Auth ya está resuelto. A17/A18 son pendientes del proceso del reclutador y no bloquean esta entrega técnica.

## Matriz final de aceptación

Esta matriz refleja el resultado actual de la revisión y las ejecuciones reales. La evidencia cronológica de cada fase y sus límites se conserva después de la matriz.

| ID | Requisito | Estado | Evidencia o comprobación pendiente |
| --- | --- | --- | --- |
| A01 | Aplicación Next.js real con TypeScript | PASS | Next.js 16.4.6 y TypeScript 7.0.2 instalados. Develop ejecutó build de producción correcto; Testing ejecutó `npm run typecheck` y arrancó esa compilación con `npm start` (Ready). |
| A02 | Tres agentes con Markdown y delegación real | PASS | Markdown y dos TOML versionados; delegación real a Develop y Testing y revisión independiente del código completada. El historial inspeccionado contiene 2 commits y el repositorio es público. |
| A03 | Testing devuelve fallos y Develop los corrige | PASS | Revisión independiente y pruebas reales completadas; no se encontraron defectos de aplicación que exigieran corrección. Se documentaron y corrigieron expectativas del arnés sin atribuirlas a Develop ni inventar un ciclo de fallos. |
| A04 | Base de datos gratuita Supabase o Firebase operativa | PASS | Supabase Free real, migración aplicada con TLS verificado; Auth anónima, CRUD persistente y ataques RLS/restricciones SQL ejecutados correctamente. |
| A05 | CRUD completo de tareas | PASS | Crear, consultar/recargar, editar, cambiar estado y eliminar persistió correctamente en API y Chrome; cancelar/confirmar borrado verificado. |
| A06 | Búsqueda, filtros y estados vacíos/carga/error | PASS | Chrome real verificó búsqueda combinada con filtros, ausencia de resultados, limpiar filtros, vacío inicial/final y error controlado con reintento que recupera el servicio real. |
| A07 | Validación y restricciones | PASS | Reglas, entradas inválidas por HTTP y restricciones SQL directas pasaron; longitud Unicode, blanco/control, estados/prioridades y propietario no permitido incluidos. |
| A08 | Aislamiento de espacios | PASS | Dos sesiones API y dos identidades Supabase reales; lectura/mutación ajena e INSERT/transferencia de propietario denegados, con integridad posterior de A comprobada. |
| A09 | Accesibilidad y adaptación | PASS | Chrome real: escritorio/móvil, teclado, foco contenido, Tab a campos, Escape/retorno y acción inicial segura en borrado; etiquetas, anuncios, error y ausencia de overflow verificados. |
| A10 | Calidad reproducible | PASS | Tipos/build documentados, 9 pruebas de reglas/Origin, auditoría npm, 16/16 de integración local, 8/8 de API HTTPS pública y 3/3 de navegador público, sin omisiones. Detalle de ejecuciones y ajustes de prueba abajo. |
| A11 | Ausencia de claves API y secretos en repositorio | PASS | 2 commits, 49 snapshots únicos, 7 valores sensibles y prefijos de credenciales examinados sin coincidencias ni archivos prohibidos; 14 archivos cliente y 40 archivos del dry-upload sin fugas. Alcance y límites detallados abajo. |
| A12 | Repositorio GitHub público o accesible | PASS | https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge . GitHub API sin autenticación HTTP 200 informa `visibility:public`, rama main; README raw HTTP 200 con título Foco. |
| A13 | Despliegue gratis en producción | PASS | `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4`, fuente de aplicación `f3d8d5f`, promovido en Hobby; Supabase Free. URL pública con API HTTPS y flujo completo verificados. |
| A14 | URL pública sin autenticación Vercel | PASS | https://speed-paradigm-ai-agents-challenge.vercel.app devuelve HTTP 200 sin cookies/Authorization, sin redirección. Chrome limpio completa el flujo sin bypass ni login Vercel. |
| A15 | README con arranque y demostración | PASS | README real con URL pública/repositorio, requisitos, instalación, SQL, variables por nombre, comandos, arquitectura y recorrido de demostración. |
| A16 | Credenciales de prueba si hay login | PASS | No existe formulario de login y Chrome público no presenta acceso Vercel. Sesión anónima creada automáticamente y CRUD real comprobado; no se necesitan credenciales de demostración. |
| A17 | Cuatro respuestas cortas del reclutador | PENDIENTE | El texto exacto de las cuatro preguntas no fue incluido en el encargo. No inventarlas. |
| A18 | Entrega mediante enlace personal | PENDIENTE | El enlace personal no fue incluido; preparar los entregables sin enviar mensajes ni formularios por iniciativa propia. |

## Historial de revisión

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

**Dictamen final: APROBADO TÉCNICAMENTE.** No se identificaron defectos de aplicación pendientes. El ajuste del arnés de foco se fundamentó en WAI APG y quedó separado de la revisión de Develop; no se inventaron fallos ni correcciones de aplicación. No se repiten build, auditorías o pruebas adicionales después de aprobar las fronteras pertinentes. Quedan fuera de esta entrega técnica únicamente el texto exacto de las cuatro preguntas y el enlace personal del reclutador (A17/A18), que no se inventan ni se envían sin instrucción expresa.
