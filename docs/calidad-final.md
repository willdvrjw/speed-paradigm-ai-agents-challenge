# Revisión funcional y de datos

Testing independiente, 23 de noviembre de 2026. Fuente revisada: `d260a4f`; Orquestador conserva infraestructura y publicación, Develop el código de aplicación y Testing las pruebas y este dictamen.

**Dictamen técnico: PASS en las comprobaciones ejecutadas, incluida la nueva compilación por HTTPS.** Fuente `d260a4f`, despliegue `dpl_BJgur6hRfLTYdeqnow6fN3vLrrar`, promovido sin recompilar a la URL principal. Testing confirmó después un GET canónico sin cookies/Authorization: 200, sin redirección, login ni cookie inicial. El alcance incluye todas las funciones declaradas del tablero y sus errores relevantes; no equivale a garantizar ausencia universal de defectos o deuda técnica. La aplicación pública es [Foco](https://speed-paradigm-ai-agents-challenge.vercel.app) y el código está en el [repositorio público](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge).

## Matriz funcional

| Función o frontera | Evidencia de esta revisión | Resultado |
| --- | --- | --- |
| Entrar sin cuenta de Vercel ni formulario de login | Chrome con cero cookies iniciales; sesión anónima automática y acceso directo. API pública con cookies HttpOnly/Secure/Lax y JSON sin tokens. | PASS |
| Crear desde las acciones de la interfaz | Botón principal y acción del vacío crean de verdad. Los tres botones de columna abren con su estado correcto y permiten cancelar. | PASS |
| Consultar y recargar | API GET de colección/registro, recarga de Chrome y comparación de campos persistidos. | PASS |
| Editar título, descripción, estado y prioridad | Guardado real y nueva lectura; el formulario conserva valores ante fallo. Cancelar los cuatro campos deja el registro original intacto. | PASS |
| Estados Pendiente, En curso y Hecha | Valores y filtros de los tres estados; transiciones reales y recarga. Dos tareas distintas se actualizan simultáneamente sin descartar la segunda. | PASS local y HTTPS |
| Prioridades baja, media y alta | Nueve tareas propias cubren el producto de tres estados por tres prioridades. | PASS |
| Buscar por título y descripción | Búsqueda de título, descripción, mayúsculas y espacios alrededor; intersección con estado y prioridad. | PASS |
| Combinar y limpiar filtros | 32 combinaciones verificadas: cuatro opciones de estado × cuatro de prioridad, con y sin búsqueda. Cero resultados y limpiar restablecen ambos selectores, texto y nueve tarjetas. | PASS |
| Resumen y botones por columna | Tres contadores `03`; preselección correcta de cada columna; cancelaciones no escriben datos. | PASS |
| Borrar con confirmación | Cancelar conserva la tarea; confirmación elimina y GET posterior devuelve 404, también tras recarga. | PASS |
| Límites y entradas inválidas | Reglas, HTTP y SQL; blancos/controles/tipos/extras/propietario y enums inválidos. UI rechaza título121/descr501 sin POST y guarda título120/descr500 caracteres Unicode completos. | PASS |
| Vacío, carga y recuperación | Vacío inicial/final, no resultados, lectura real retenida con `aria-busy` y controles deshabilitados, error de conexión y reintento real. | PASS |
| Fallos de mutación | Respuestas503 controladas solo para POST, PATCH de edición/estado y DELETE. Datos reales permanecen intactos; formulario/confirmación conservan contexto y las operaciones reales posteriores funcionan. | PASS; errores simulados separados del CRUD real |
| Condiciones de navegador | Aviso sin JavaScript; cookies declaradas desactivadas producen cero llamadas privadas; sesión200 seguida GET401 explica cookies; POST401 conserva error original y no continúa ni crea identidades en bucle. | PASS; dos últimas respuestas controladas |
| Colección mayor de 1000 | Un INSERT bulk de 1005 filas propias, con mismo `created_at`, comprueba desempate UUID. API devuelve 1005 IDs únicos y la interfaz encuentra un marcador de última página con los tres filtros. | PASS local y HTTPS |
| Dos espacios y acceso directo a Supabase | API ajena devuelve404; RLS directo deniega lectura/UPDATE/DELETE ajenos, INSERT como otro dueño y transferencia; rol anon sin SELECT. | PASS real |
| Fechas y restricciones de BD | `created_at` se conserva y `updated_at` avanza tras PATCH, sin sleeps. Restricciones SQL resisten acceso directo. | PASS real |
| Teclado, foco y adaptación | Diálogo, Tab, Escape y retorno de foco; acción inicial de borrado segura; etiquetas/alertas; anchos320/390/768/1440 sin desbordamiento. Capturas nuevas de escritorio/móvil inspeccionadas. | PASS dentro de esos casos; no auditoría WCAG exhaustiva |
| Compilación, tipos y dependencias | Build de producción y typecheck exit 0; reglas 9/9; `npm audit --json` informa 0 vulnerabilidades conocidas en la consulta. | PASS |
| Claves y configuración privada | Testing comparó14 archivos del nuevo bundle cliente con12 valores configurados en memoria:0 coincidencias. Orquestador escaneó árbol/historia y verificó repo/infra, con evidencia separada. | PASS en el alcance del escaneo |
| README para reclutador | Enlaces directos, demo breve, tres roles, stack, seguridad, instalación, SQL/env por nombre, comandos y límites. Sin preguntas, respuestas personales, enlace privado ni token. | PASS |

## Ciclo real de fallos y corrección

| Hallazgo | Reproducción antes de corregir | Corrección de Develop y nueva revisión |
| --- | --- | --- |
| QA-01, funcional | Producción b2e098a: retener únicamente el envío PATCH de A, cambiar B habilitada; B no emitió PATCH. El cambio se descartaba por un bloqueo global. | Bloqueos por ID de tarea. Chrome local y HTTPS confirmaron ambos PATCH 200 y ambos estados tras recarga. No se falsificaron respuestas ni persistencia. |
| QA-02, funcional | Producción b2e098a: SQL contó 1005 filas propias insertadas en bulk; GET/api/tasks200 devolvió 1000. | Paginación interna de 500 por cursor `created_at DESC,id DESC`, conservando precisión PostgreSQL y sin devolver 200 parcial ante error. Chrome/API local y HTTPS recuperaron 1005 IDs únicos y el marcador de la última página. |
| QA-03, regresión de compilación | Primer build de la corrección: TS2339 en `app/api/tasks/route.ts`, propiedad `id` sobre `never`. Bloqueaba compilar. | Develop extrajo una función de cursor tipada, sin `any` ni supresiones. Segundo build y typecheck terminaron correctamente. |

Las dos regresiones funcionales fallaron primero contra producción real y luego pasaron sobre la compilación local corregida y la misma fuente desplegada por HTTPS. No se inventaron fallos para representar el ciclo. La política PowerShell que impedía ejecutar `npm.ps1` se resolvió invocando `npm.cmd`, sin modificar políticas; no era un fallo de aplicación.

## Ejecuciones y reproducción

Entorno: Windows, Node 24.22.3/npm 11.19.1 portables y Chrome 158.0.8127.37 real. Se usó un único servidor de producción local, `npm start -- --hostname localhost`, con Supabase real. No se compilaron dos servidores simultáneamente.

```powershell
npm run build
npm run typecheck
npm test
npm audit --json
$env:TEST_BASE_URL='https://speed-paradigm-ai-agents-challenge.vercel.app'
npm run test:integration
$env:TEST_BASE_URL='http://localhost:3000'
$env:TEST_LARGE_COLLECTION='1'
node --env-file=.env.local node_modules/@playwright/test/cli.js test
# Regresiones pertinentes y API final sobre la compilación HTTPS preparada:
$env:TEST_BASE_URL='https://speed-paradigm-ai-agents-challenge-m58cj90e4-willdvrs-projects.vercel.app'
node --env-file=.env.local node_modules/@playwright/test/cli.js test tests/e2e/quality.spec.ts --grep 'simultáneos|1005'
node --test tests/integration/api.test.mjs
```

| Ejecución | Resultado |
| --- | --- |
| Regresiones antes de corrección, URL pública b2e098a | 2/2 FAIL reproducibles; datos sintéticos limpiados. |
| Brechas funcionales en versión anterior | 4/4 PASS en 21.9 s; esto no aprobaba los dos defectos anteriores. |
| Build/tipos de fuente corregida d260a4f | PASS, exit 0 tras corregir QA-03; generación3/3 páginas. |
| Reglas/Origin | 9/9 PASS, fail 0/skipped 0. |
| API HTTPS pública y RLS directo | 16/16 PASS en 7.33 s, fail 0/cancelled 0/skipped 0; misma revisión, antes de publicar los dos fixes. Incluye nuevas comprobaciones de fechas y cuerpos inválidos. |
| Chrome completo de fuente corregida, producción local | 13/13 PASS en 44.8 s, skipped 0/retries 0, incluyendo volumen activado. |
| Dos regresiones en HTTPS de la compilación corregida | 2/2 PASS en 12.2s, sin omisiones; mismo d260a4f, sin bypass. |
| API completa en HTTPS de la compilación corregida | 8/8 PASS en 8.61s, fail 0/skipped 0; incluye Secure/HttpOnly/Lax, fechas, persistencia, aislamiento y CSRF. Las ocho de RLS directo ya pasaron en esta revisión sobre la misma BD/esquema y no se repitieron por un cambio de React/listado. |
| HTTP anónimo del despliegue corregido | GET 200, Location=null, título Foco, sin login ni cookies iniciales; GET/api/tasks sin sesión401 y no-store. |

La regresión de 1005 filas es optativa para no crear ese volumen en cada ejecución rutinaria: necesita `TEST_LARGE_COLLECTION=1`, las dos variables publicables de Supabase y una aplicación real. Sin la opción, se omite explícitamente. Nunca usa credenciales administrativas. El INSERT es bulk y la limpieza DELETE se limita al nuevo propietario; se verificó count 0. Las demás tareas se eliminan con sus propias sesiones. Las identidades anónimas quedan sujetas a retención del proveedor.

No hubo rate-limit ni 502 en las ejecuciones indicadas. Los errores 503 de la matriz son respuestas controladas del arnés y no acreditan disponibilidad/indisponibilidad de Supabase. El CRUD, las recargas, las comprobaciones de fechas, el aislamiento y las regresiones funcionales sí usan la integración real.

El servidor de pruebas propio, sesión85026, quedó cerrado; no quedan listeners 3000 ni procesos del Node portable del proyecto. No se terminaron procesos de otros trabajos.

## Deuda técnica y decisiones de alcance

| Asunto | Clasificación y consecuencia real |
| --- | --- |
| Se descarga la colección completa y se filtra/renderiza en cliente | Deuda de escalabilidad, no truncamiento actual:1005 filas comprobadas. Para un producto con volúmenes mucho mayores convendría paginación visible, consulta de filtros en servidor y renderizado acotado; no se hicieron benchmarks de carga masiva o concurrencia. |
| Ediciones de la misma fila en pestañas diferentes | Decisión de demo y posible evolución: prevalece la última escritura, sin control de versión ni colaboración en tiempo real. El fix de QA-01 resuelve filas distintas, no promete resolver conflictos de la misma fila. |
| Identidad anónima ligada a cookies | Alcance intencional sin login. Borrar cookies o cerrar la sesión privada pierde acceso; no hay recuperación de cuenta ni sincronización entre dispositivos. |
| Cuotas, altas anónimas e inactividad de proveedores gratuitos | Límite operativo de Hobby/Free y retención del proveedor. No garantiza disponibilidad permanente ni acceso desde toda red o ubicación; no se contrataron servicios adicionales. |
| Cobertura automatizada | Evidencia funcional y de seguridad relevante, no prueba matemática ni certificación de accesibilidad. La compatibilidad previa de cuatro configuraciones sigue documentada con su fuente b2e098a; esta ampliación sobre d260a4f se ejecutó en Chrome. No añadió APIs de navegador ni reinstaló motores o repitió CI. |
| Aviso de lockfile exterior al repo | El build informa que ignora un package-lock del directorio del usuario y termina correctamente. No se modificaron archivos externos para silenciarlo. |

No quedan fallos reproducidos sin corregir en los casos ejecutados de la fuente revisada. Esto no se expresa como «cero deuda técnica». Las respuestas personales y el envío único al reclutador siguen fuera del cierre técnico: las preguntas y el enlace fueron recibidos/revisados privadamente y no se publican aquí.

## Fuentes consultadas

- Documentación de Next16.4.6 instalada: `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` y `01-app/01-getting-started/15-route-handlers.md`.
- [Playwright: red](https://playwright.dev/docs/network), para retener el envío sin falsificar respuestas y separar errores controlados.
- [Supabase: range](https://supabase.com/docs/reference/javascript/range), límites de consulta; la corrección final usa cursor en vez de offsets y se revisó en código real.
- Las referencias oficiales de SSR, RLS, PostgreSQL y compatibilidad anteriores se conservan en [documentación](documentacion.md) y [auditoría](auditoria.md).
