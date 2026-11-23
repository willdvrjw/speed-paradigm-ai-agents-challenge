# Auditoría contra el enunciado original

Responsable: Testing, independiente de Develop. Fecha: 2026-11-23, America/Bogota.

**Dictamen: requisitos técnicos comprobados, PASS. Entrega al reclutador, PENDIENTE de dos datos que no fueron proporcionados: las cuatro preguntas y el enlace personal.** Esta auditoría volvió a ejecutar las comprobaciones; no se limita a citar la aceptación anterior. La referencia literal es [docs/enunciado.md](enunciado.md).

Aplicación de producción: https://speed-paradigm-ai-agents-challenge.vercel.app . Repositorio público: https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge . No hacen falta usuario ni contraseña: la interfaz no tiene formulario de login y crea una sesión anónima aislada.

La revisión comenzó en HEAD `40f373e`. `git diff f3d8d5f HEAD -- app components lib next.config.ts package.json package-lock.json supabase` no mostró cambios: la fuente de aplicación coincide con la del despliegue `dpl_B3nUE5cHdYBNeBH2nasPtvXmYFm4`. La corrección de esta auditoría fue de configuración Vercel; Testing no modificó código de aplicación ni infraestructura.

## Matriz literal y evidencia actual

Las citas breves pertenecen al texto recibido; las comprobaciones de calidad adicionales del tablero se distinguen después. PASS significa observado dentro del alcance indicado, no una garantía universal ni una entrega administrativa ya enviada.

| ID | Requisito literal | Estado | Evidencia actual |
| --- | --- | --- | --- |
| E01 | «Con Claude Code o con Codex, crea un proyecto en Next.js» | PASS | Proyecto real Next.js 16.4.6, construido mediante Codex; nueva compilación de producción y tipos terminan con exit 0. |
| E02 | «trabaje con 3 agentes» | PASS | Inventario real de la auditoría: `/root`, `/root/develop` y `/root/testing`, los tres roles reales del equipo. No se crearon agentes adicionales. |
| E03 | «Orquestador: el agente principal, con su CLAUDE.md (o AGENTS.md), que reparte el trabajo» | PASS | `AGENTS.md` rastreado y accesible públicamente; delegaciones reales del Orquestador a Develop y Testing y responsabilidades registradas en `docs/registro-agentes.md`. |
| E04 | «Develop: un subagente que programa, con su propio .md de cómo programar» | PASS | `agents/develop.md` y `.codex/agents/develop.toml` versionados; Develop implementó los archivos reales de aplicación y comunicó sus comprobaciones. |
| E05 | «Testing: un subagente con un .md de DIRECTRICES que Develop tiene que cumplir» | PASS | `agents/testing/DIRECTRICES.md` y su TOML versionados; Develop recibió esas directrices y Testing revisó su resultado real sin editar aplicación. |
| E06 | «Testing revisa lo que hace Develop y le devuelve los fallos hasta que todo pasa» | PASS | Revisión y pruebas independientes reales: todas las comprobaciones técnicas de esta auditoría pasan. No se encontraron fallos de aplicación que requirieran devolución/corrección de Develop; no se afirma un ciclo ficticio. El hallazgo real de infraestructura y su corrección se describen como AUD-01. |
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
| E17 | «Al entregar, con tu enlace personal» | PENDIENTE | El enlace personal no fue proporcionado. No se inventó, no se envió un formulario ni se publicará un enlace personal sensible en Git. |
| E18 | «el enlace de la app» | PASS | URL real de producción incluida al principio de este informe y en README. |
| E19 | «el repositorio de GitHub (público o con acceso para nosotros), con los .md de los agentes» | PASS | GitHub API sin autenticación devuelve 200 y visibility=public. Los tres Markdown, ambos TOML y README devuelven raw HTTP 200 y coincidían con los archivos locales al revisarlos. |
| E20 | «un usuario y una contraseña de prueba, si la app tiene login» | PASS | La condición no aplica: no hay formulario de login ni contraseña. Chrome accede directamente y la sesión anónima se establece automáticamente. |
| E21 | «las respuestas a 4 preguntas cortas» | PENDIENTE | No se recibió el texto de las cuatro preguntas. No se inventaron respuestas ni se enviaron mensajes al reclutador. |

## Ejecuciones nuevas

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

No aparecieron defectos reproducibles de aplicación que exigieran un cambio de Develop. Los ajustes históricos de expectativas del arnés se distinguen en [aceptacion.md](aceptacion.md); esta auditoría no inventa una devolución de fallos ni un ciclo de corrección de aplicación. El requisito de tres agentes se acredita con instrucciones, delegación, código y revisión reales.

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

Los enlaces técnicos están preparados y comprobados. No hacen falta credenciales manuales ni vídeo. Falta recibir el texto exacto de las cuatro preguntas y el enlace personal para completar el envío del reclutador; este informe no sustituye ese envío y no afirma que se haya realizado.
