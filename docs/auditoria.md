# Auditoría contra el enunciado original

Responsable: Testing, independiente de Develop. Fecha: 2026-11-23, America/Bogota.

**Dictamen: requisitos técnicos comprobados, PASS. Entrega al reclutador, PENDIENTE de confirmar las respuestas personales y realizar el envío único.** Orquestador confirmó que las cuatro preguntas y el enlace personal ya fueron recibidos y revisados privadamente; no se publican su texto, enlace ni token. Esta auditoría volvió a ejecutar las comprobaciones; no se limita a citar la aceptación anterior. La referencia literal es [docs/enunciado.md](enunciado.md).

**Estado posterior de acceso:** versión b2e098a publicada en la URL principal, con cuatro configuraciones de navegador aprobadas: Chrome, Edge y Firefox en Windows, y WebKit con emulación móvil en Linux mediante CI real. Las ayudas sin JavaScript/cookies están verificadas. El bloqueo de WebKit Windows y la primera CI cancelada se conservan como historial; no se cuentan como éxitos ni como fallos de aplicación. No se afirma haber probado Safari en un iPhone físico ni todos los navegadores, dispositivos, países o redes.

Aplicación de producción: https://speed-paradigm-ai-agents-challenge.vercel.app . Repositorio público: https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge . No hacen falta usuario ni contraseña: la interfaz no tiene formulario de login y crea una sesión anónima aislada.

La auditoría literal inicial comenzó en HEAD `40f373e`; en esa fase la fuente de aplicación coincidía con `f3d8d5f` y el despliegue `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4`. Esa comparación se conserva como evidencia histórica. La ampliación posterior de acceso sí incluye correcciones de aplicación de Develop: fuente `b2e098a`, despliegue `dpl_DmwUnKjZstWcL3xebGTRiPDg8nFS`, promovido a la misma URL pública. Testing conserva independencia y solo modifica pruebas/documentación.

## Matriz literal y evidencia actual

Las citas breves pertenecen al texto recibido; las comprobaciones de calidad adicionales del tablero se distinguen después. PASS significa observado dentro del alcance indicado, no una garantía universal ni una entrega administrativa ya enviada.

| ID | Requisito literal | Estado | Evidencia actual |
| --- | --- | --- | --- |
| E01 | «Con Claude Code o con Codex, crea un proyecto en Next.js» | PASS | Proyecto real Next.js 16.4.6, construido mediante Codex; nueva compilación de producción y tipos terminan con exit 0. |
| E02 | «trabaje con 3 agentes» | PASS | Inventario real de la auditoría: `/root`, `/root/develop` y `/root/testing`, los tres roles reales del equipo. No se crearon agentes adicionales. |
| E03 | «Orquestador: el agente principal, con su CLAUDE.md (o AGENTS.md), que reparte el trabajo» | PASS | `AGENTS.md` rastreado y accesible públicamente; delegaciones reales del Orquestador a Develop y Testing y responsabilidades registradas en `docs/registro-agentes.md`. |
| E04 | «Develop: un subagente que programa, con su propio .md de cómo programar» | PASS | `agents/develop.md` y `.codex/agents/develop.toml` versionados; Develop implementó los archivos reales de aplicación y comunicó sus comprobaciones. |
| E05 | «Testing: un subagente con un .md de DIRECTRICES que Develop tiene que cumplir» | PASS | `agents/testing/DIRECTRICES.md` y su TOML versionados; Develop recibió esas directrices y Testing revisó su resultado real sin editar aplicación. |
| E06 | «Testing revisa lo que hace Develop y le devuelve los fallos hasta que todo pasa» | PASS | Revisión real; en la ampliación posterior Testing reprodujo dos barreras de uso (sin JavaScript y cookies desactivadas), Develop las corrigió en b2e098a y Testing comprobó 2/2 regresiones correctas localmente y por HTTPS. AUD-01 sigue identificado por separado como infraestructura. |
| E07 | «haz una app del tema que quieras (tema libre)» | PASS | Foco es un tablero funcional de tareas en español; Chrome comprobó el recorrido completo con datos reales. |
| E08 | «con una base de datos gratuita: Firebase o Supabase» | PASS | Supabase Free real, estado available comprobado por Orquestador; pruebas directas contra su PostgreSQL/RLS y persistencia desde la app pasan. |
| E09 | «publicada gratis en Vercel (o similar)» | PASS | Despliegue READY/production en Vercel Hobby, verificado por Orquestador; URL de producción HTTP 200 y flujo HTTPS funcional. |
| E10 | «la dirección de la app tiene que ser PÚBLICA» | PASS | GET de Testing sin cookies, Authorization ni bypass devuelve 200, `Location=null`, título Foco y ninguna pantalla de acceso Vercel. |
| E11 | «Ábrela en una ventana de incógnito sin haber entrado en Vercel» | PASS | Chrome mediante contextos Playwright aislados equivalentes a incógnito. El test principal comprobó explícitamente cero cookies antes de navegar y completó el flujo público sin sesión Vercel. |
| E12 | «En Vercel, quita la protección en Settings › Deployment Protection (Vercel Authentication)» | PASS | AUD-01 corregido por Orquestador: lectura posterior `ssoProtection=null`, `protectionBypass={}`. Testing comprobó HTTP 200 sin redirección tanto en producción como en el URL directo del despliegue, sin bypass. |
| E13 | «pásanos la dirección de producción, no la de una vista previa» | PASS | Se entrega `https://speed-paradigm-ai-agents-challenge.vercel.app`; corresponde al despliegue promovido con target production. El URL directo se usa solo como evidencia adicional. |
| E14 | «No hace falta gastar dinero: usa planes gratuitos» | PASS | Planes actuales comprobados por Orquestador: Vercel Hobby y Supabase Free/available. No se aceptaron costes ni se actualizó un plan. |
| E15 | «No subas claves de API al repositorio» | PASS | Nuevo escaneo de Testing sobre árbol rastreado, cuatro commits e historial: cero coincidencias con las siete claves/credenciales configuradas comparadas en memoria, incluidas claves publicables reales, y cero patrones de credenciales o archivos prohibidos. Véase el alcance del escaneo abajo. |
| E16 | «No hace falta vídeo» | PASS | No se considera un entregable obligatorio ni se sustituye la app por un vídeo. La evidencia es URL real, código, pruebas y dictamen; Playwright tiene video desactivado. |
| E17 | «Al entregar, con tu enlace personal» | PENDIENTE | Enlace recibido y revisado privadamente por Orquestador. Queda pendiente el envío único; el enlace y su token no se publican en Git ni se envía un formulario por iniciativa de Testing. |
| E18 | «el enlace de la app» | PASS | URL real de producción incluida al principio de este informe y en README. |
| E19 | «el repositorio de GitHub (público o con acceso para nosotros), con los .md de los agentes» | PASS | GitHub API sin autenticación devuelve 200 y visibility=public. Los tres Markdown, ambos TOML y README devuelven raw HTTP 200 y coincidían con los archivos locales al revisarlos. |
| E20 | «un usuario y una contraseña de prueba, si la app tiene login» | PASS | La condición no aplica: no hay formulario de login ni contraseña. Chrome accede directamente y la sesión anónima se establece automáticamente. |
| E21 | «las respuestas a 4 preguntas cortas» | PENDIENTE | Las cuatro preguntas fueron recibidas y revisadas privadamente por Orquestador. Faltan confirmar las respuestas personales y realizar el envío único; no se publican las preguntas ni se inventan respuestas. |

## Ejecuciones de la auditoría literal inicial

Se usó Node.js 24.22.3 portable del proyecto y npm 11.19.1, con PATH y caché solo del proceso. Las invocaciones npm se realizaron mediante `.tools/node-v24.22.3-win-x64/npm.cmd`; en un entorno con Node 24 instalado equivalen a los comandos siguientes.

```powershell
npm run build
npm run typecheck
npm test
npm audit --json
$env:TEST_BASE_URL='https://speed-paradigm-ai-agents-challenge.vercel.app'
npm run test:integration
npm run test:e2e
```

| Comprobación nueva | Resultado observado |
| --- | --- |
| Build de producción | PASS, exit 0; compilación optimizada, tipos y generación de 3/3 páginas. |
| Typecheck | PASS, exit 0. |
| Reglas y Origin | PASS, 9/9; fail 0, skipped 0. |
| Auditoría npm completa | PASS en la consulta: 0 vulnerabilidades conocidas informadas, exit 0. |
| API pública HTTPS y Supabase directo/RLS | PASS, 16/16; fail 0, cancelled 0, skipped 0, todo 0, exit 0. |
| Chrome público en contextos limpios | PASS, 3/3 en 12.0 s, exit 0; sin reintentos configurados. |
| HTTP sin estado de autenticación | Producción y URL directo del despliegue: 200, sin Location y sin login Vercel. |
| TOML de agentes | Python `tomllib` analizó ambos archivos; `name`, `description` y `developer_instructions` válidos, Markdown referidos existentes y prohibición de nuevos subagentes presente. |
| Repositorio accesible | GitHub API 200/public/main; seis archivos de referencia raw 200 y coincidencia local. |
| Secretos y archivos prohibidos | 0 hallazgos en el alcance descrito abajo. |

La integración pública incluye sesiones anónimas independientes, cookies HttpOnly/Secure/SameSite=Lax, ausencia de tokens en JSON, no-store, crear/consultar/editar/cambiar estado/borrar con verificación persistida, validación de entradas y CSRF. Los ataques directos a Supabase comprueban rol anon sin lectura, lectura/UPDATE/DELETE ajenos, INSERT como otro propietario, transferencia de propiedad denegada y restricciones SQL.

Chrome comprueba búsqueda y filtros combinados, recarga, edición móvil, cancelación/confirmación de borrado, estados vacíos, etiquetas, teclado/foco/Escape y ausencia de desbordamiento. El caso separado de error aborta únicamente la conexión inicial y luego recupera el servicio real; no se simulan datos ni persistencia en el flujo principal. Testing abrió las capturas nuevas `desktop-task.png` y `mobile-task.png` de esta ejecución y revisó contenido, adaptación y legibilidad. El enlace de salto visible corresponde a navegación por teclado. Las capturas permanecen como artefactos locales ignorados; el vídeo no es necesario.

Las tareas sintéticas se eliminaron con sus propias sesiones; no se borraron datos de otros visitantes. Las identidades anónimas quedan sujetas a la retención del proveedor. No hubo respuestas 502 ni rate-limit en esta ejecución y no se hicieron altas de diagnóstico adicionales.

## Alcance del escaneo de claves

Testing volvió a examinar los cuatro commits disponibles en el momento de la auditoría: 60 snapshots de archivo únicos por objeto Git y 43 archivos rastreados actuales. Comparó siete valores de claves/credenciales cargados solo en memoria, incluidas claves publicables reales, y patrones conocidos de claves y JWT. Examinó además los 14 archivos de `.next/static` del build nuevo frente a doce valores configurados, incluidos URL/claves. Resultado: cero coincidencias y cero archivos prohibidos versionados; ningún valor se imprimió.

La cifra adicional de Orquestador de 140 snapshots cuenta todas las versiones, incluidas las repetidas, y no contradice los 60 objetos de archivo únicos de Testing. `.env` real, `.tools/`, `.vercel/`, `.artifacts/`, dependencias e informes locales se excluyen; `.env.example` contiene solo marcadores de configuración. El resultado cubre los valores y patrones examinados, no todos los secretos desconocidos posibles.

## Hallazgo real y corrección

**AUD-01 — Configuración Vercel Authentication todavía activa. Gravedad: media para cumplimiento literal. Estado: corregido y revisado.**

Orquestador detectó que el proyecto conservaba `ssoProtection.deploymentType=all_except_custom_domains`. Aunque la dirección de producción ya era pública, esto no cumplía literalmente la orden de quitar Vercel Authentication. La reproducción consiste en inspeccionar Settings → Deployment Protection del proyecto o su campo `ssoProtection`: debía estar desactivado, pero aún tenía configuración de SSO.

Orquestador consultó documentación oficial y desactivó Vercel Authentication únicamente en este proyecto. La respuesta de la acción indicó `ssoProtection=false` y la lectura posterior devolvió `ssoProtection=null`, `protectionBypass={}` y `gitForkProtection=true`. Testing comprobó después GET 200 sin cookies/Authorization/bypass tanto en el dominio de producción como en el URL directo del despliegue, y repitió el flujo público completo. Las políticas Supabase/RLS y la seguridad de la aplicación permanecen verificadas. No se atribuye esta corrección de infraestructura a Develop.

Develop añadió únicamente documentación reproducible al README: cinco pasos para Supabase Free/Auth anónima, Vercel Hobby, variables de Production, desactivación de Vercel Authentication y visita privada a producción. Testing revisó ese diff y coincide con la configuración y el flujo comprobados. No cambió código de aplicación y no se necesitó otro build.

En la auditoría literal inicial no aparecieron defectos reproducibles de aplicación que exigieran un cambio de Develop. La ampliación posterior sí produjo dos correcciones verificadas, descritas a continuación. Los ajustes históricos de expectativas del arnés se distinguen en [aceptacion.md](aceptacion.md) y no se atribuyen a la aplicación. El requisito de tres agentes se acredita con instrucciones, delegación, código y revisión reales.

El build emitió una advertencia por un package-lock ajeno al repositorio que Next.js ignoró; build y tipos pasaron. El primer intento de reinicio local encontró el hijo Node anterior aún ocupando el puerto: se verificaron PID y ruta dentro de este proyecto, se detuvo ese proceso y se restauró el servidor local con la compilación nueva. Fue una incidencia del control de procesos local, sin fallo de aplicación ni impacto en producción.

## Fuentes y límites

- Enunciado proporcionado por el usuario: [enunciado.md](enunciado.md).
- Next.js instalado: `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md` y `01-app/01-getting-started/15-route-handlers.md`, consultados de nuevo antes de la ejecución; recomiendan verificar contra producción y describen los handlers.
- [Playwright: aislamiento](https://playwright.dev/docs/browser-contexts): los contextos separados son equivalentes a perfiles de incógnito; además se comprobó explícitamente que el contexto inicial no tenía cookies.
- [Node.js 24: test runner](https://nodejs.org/docs/latest-v24.x/api/test.html): resultados y subpruebas ejecutados con el runner nativo.
- [Codex: subagentes](https://learn.chatgpt.com/docs/agent-configuration/subagents): esquema de los TOML contrastado por Orquestador, además de la validación sintáctica independiente de Testing.
- [Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication): referencia oficial de la corrección de Orquestador.

Se verificó la configuración y disponibilidad observadas en esta auditoría; los límites e inactividad de los planes gratuitos siguen siendo los del proveedor. No se contrataron servicios adicionales ni se publicaron claves o estados de navegador. No se amplían pruebas tras pasar las comprobaciones pertinentes.

## Entrega

Los enlaces técnicos están preparados y comprobados. No hacen falta credenciales manuales ni vídeo. Las cuatro preguntas y el enlace personal ya fueron recibidos y revisados privadamente por Orquestador. Quedan pendientes la confirmación de respuestas personales y el envío único; este informe no publica esos datos, no sustituye ese envío y no afirma que se haya realizado.

## Ampliación de acceso desde navegadores actuales

Esta fase responde a la petición posterior de facilitar el acceso público desde distintos navegadores y herramientas. No convierte un cambio de idioma/zona horaria o User-Agent en una prueba desde otro país, IP o red.

### Barreras reproducidas y corregidas

Sobre la producción anterior, Testing ejecutó `tests/e2e/access-requirements.spec.ts`: 2 fallos reproducidos. Con JavaScript desactivado faltaba una explicación accionable y quedaba una preparación indefinida; con `navigator.cookieEnabled=false` faltaba una indicación sobre cookies antes de intentar abrir el espacio. Develop añadió aviso `noscript` con recarga, suprimió el indicador indefinido sin JavaScript y añadió ayuda/guardia de cookies, manteniendo sesión privada y RLS.

Las mismas dos regresiones pasaron en el build local nuevo (2/2, 3.2 s) y en la preparación HTTPS `b2e098a` (2/2, 6.3 s), sin crear usuarios en los casos de ayuda. Se ejecutaron build y typecheck correctos; un primer fallo TypeScript procedía de una variable `document` del test nuevo que sombreaba el DOM, se corrigió en el arnés y no se atribuye a Develop. La posible objeción a `AbortSignal.timeout()` como incompatibilidad con Safari 16.4 se descartó al consultar el [BCD oficial de MDN](https://github.com/mdn/browser-compat-data/blob/main/api/AbortSignal.json): está disponible desde Safari 16 y Firefox 100; Chrome 103 tenía una diferencia en el tipo de error que el catch genérico ya tolera.

### Smoke real por navegador

La configuración optativa `PLAYWRIGHT_ACCESS_SMOKE=1` ejecuta únicamente `access-smoke.spec.ts`. Cada caso usa un contexto vacío sin Vercel/bypass, comprueba sesión automática y cookies privadas de primera parte, crea una tarea propia, recarga, la elimina y confirma su ausencia. También verifica cero orígenes HTTP externos en el cliente, sin simular persistencia. Las zonas/idiomas solo son configuraciones del navegador.

| Navegador y entorno | Configuración del caso | Estado y evidencia |
| --- | --- | --- |
| Chrome 158.0.8127.37, Windows | en-US, UTC, escritorio | PASS: smoke HTTPS completo sobre b2e098a; captura propia inspeccionada. |
| Edge 158.0.4370.33, Windows | es-ES, Europe/Madrid, escritorio | PASS: smoke HTTPS completo sobre b2e098a; captura propia inspeccionada. |
| Firefox 159.0 oficial Playwright, Windows | fr-FR, Europe/Paris, escritorio | PASS: un caso completo en 14.4 s al ejecutar fuera del sandbox de herramientas, con perfil temporal nuevo y protecciones/TLS normales. |
| WebKit móvil, Ubuntu 24.04 en imagen oficial Playwright 1.65.1 | ja-JP, Asia/Tokyo, emulación iPhone 13 contra URL canónica pública | PASS: [CI 45229713210](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge/actions/runs/45229713210), job 137885614975, smoke 1/1 en 7.6 s. La primera CI cancelada se conserva separadamente abajo. |

Firefox/WebKit se instalaron gratis mediante el CLI oficial en `.tools/playwright-browsers`, ignorado por Git. Firefox no arrancaba dentro del sandbox (timeout) y pasó fuera de él sin acceder al perfil del usuario. WebKit Windows quedó como límite de TLS de ese motor/entorno; no se desactivó verificación ni se importaron CAs al sistema. La CI es un workflow de pruebas sin secretos ni despliegue, que no declara cachés ni subida de artefactos, con runner estándar Ubuntu de repositorio público, acciones fijadas por SHA y permisos de lectura.

### Resultado remoto, promoción y cierre

Testing revisó estáticamente `.github/workflows/public-access.yml` y obtuvo el resultado real mediante el conector GitHub y una lectura REST pública actualizada. La CI utilizó commit de workflow `bc38ed1`, run `45227720380`, job `137878600725`, Ubuntu 24.04 y Node 24.22.3. El objetivo era exclusivamente WebKit móvil contra producción canónica; no repitió Chrome, Edge o Firefox ya aprobados.

El primer job comenzó `2026-11-23T17:26:43Z` y terminó `2026-11-23T17:34:57Z`, conclusión `cancelled`. Checkout, setup-node y npm ci pasaron. `npx playwright install --with-deps webkit` quedó `cancelled` y `Verify public WebKit mobile access` quedó `skipped`: no llegó a enviar un caso de aplicación. Los logs registran `Installing dependencies...` a las `17:26:58Z` y `The operation was canceled.` a las `17:34:56Z`, al cierre del límite de ocho minutos configurado. Se conserva como límite de preparación de entorno, no como un fallo de aplicación ni como PASS de Safari/WebKit.

Orquestador consultó [Playwright Docker](https://playwright.dev/docs/docker) y corrigió únicamente la preparación del mismo workflow, usando la imagen oficial Microsoft `v1.65.1-noble` con browsers/dependencias ya instalados, versión igual al SDK y fijada por digest `sha256:1507cbfc550a63a6b7396791ca4f00df17beb56342d2447b3f106c306f525579`. Testing revisó ese cambio estático: sin apt/install durante el job, sin cambios de app, sin nuevos proveedores, permisos de lectura y timeout de cinco minutos. Esta fue la única ejecución adicional tras esa corrección concreta.

La [CI final 45229713210](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge/actions/runs/45229713210), commit de workflow `2478547`, job `137885614975`, terminó **success**. Testing comprobó los pasos y logs reales mediante el conector GitHub: imagen fijada correcta, Node `v24.22.3`, `Running 1 test using 1 worker` y `1 passed (7.6s)` a las `17:38:32Z`. El smoke WebKit móvil ejecutó la URL canónica pública con cero cookies iniciales, sesión automática, crear/recargar/eliminar su tarea, cookies privadas de primera parte y cero orígenes externos HTTP del cliente. No hubo bypass ni simulación de persistencia y la tarea quedó eliminada.

Orquestador promovió la misma compilación b2e098a, `dpl_DmwUnKjZstWcL3xebGTRiPDg8nFS`, y comprobó que la URL principal apunta exactamente a ella: GET sin cookies/Authorization/bypass devuelve 200 sin redirección y contiene la ayuda nueva sin JavaScript. Los tres smokes aprobados habían ejecutado esa compilación HTTPS preparada sin bypass; no se repite CRUD después de cambiar solo el alias. Las tareas sintéticas se limpiaron con sus propias sesiones.

Resultado de la ampliación: **4 configuraciones de navegador aprobadas, pertenecientes a 3 familias de motor**. Chrome y Edge comparten Chromium; Firefox usa Gecko y la CI final ejecutó WebKit. El intento Windows de WebKit permanece no verificado en ese entorno específico. Las dos ayudas pasan 2/2 local y 2/2 por HTTPS, y el typecheck final del arnés tras acotar lanzamiento a 20 s y manejar las promesas de navegación también pasa. No hubo cambios de aplicación para resolver limitaciones del sandbox/TLS/CI. Los resultados y pruebas de la auditoría literal anterior permanecen identificados por su fase.

Comandos específicos de esta ampliación (Node 24 del proyecto):

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH=Join-Path (Get-Location) '.tools/playwright-browsers'
node node_modules/playwright/cli.js install firefox webkit --no-progress --no-remove
$env:TEST_BASE_URL='https://speed-paradigm-ai-agents-challenge-fzz97it19-willdvrs-projects.vercel.app'
npm run test:e2e -- tests/e2e/access-requirements.spec.ts
$env:PLAYWRIGHT_ACCESS_SMOKE='1'
npm run test:e2e
node node_modules/playwright/cli.js test --project=firefox-desktop
```

La primera ejecución de cuatro casos dio 2 PASS y dos límites de entorno; Firefox pasó después en el único intento permitido fuera del sandbox, con perfil temporal nuevo y lanzamiento limitado a 20 s. El intento local de WebKit con CAs ya existentes mantuvo TLS activo y no resolvió el bloqueo; la CI final sí ejecutó y aprobó el caso real. Las capturas exitosas de Chrome y Edge se abrieron e inspeccionaron. La CI no sube artefactos: no se afirma una inspección visual manual de su captura de WebKit. Los binarios, certificados públicos de prueba y capturas locales permanecen ignorados por Git. Se detuvo únicamente el servidor local de pruebas tras verificar su PID y ruta de este repositorio.

Fuentes consultadas antes de ajustar pruebas: [browsers](https://playwright.dev/docs/browsers), [emulation](https://playwright.dev/docs/emulation), [browser contexts](https://playwright.dev/docs/browser-contexts) y [verificación de certificados curl](https://curl.se/docs/sslcerts.html). Se conserva el límite de la comprobación: WebKit automatizado no equivale a probar un Safari instalado en un iPhone físico, y ningún conjunto finito confirma todos los navegadores/versiones, países, proveedores de red o políticas corporativas. El sitio sigue requiriendo JavaScript, cookies propias y conectividad con el servicio gratuito; ahora explica cómo recuperar esos requisitos sin quitar su aislamiento de datos.
