# Foco — Un paso a la vez

Tablero personal de tareas en español, sin formulario de registro. Permite crear, consultar y editar tareas, cambiar su estado, buscar por título/descripción, filtrar por estado/prioridad y eliminar con confirmación. Cada visitante usa un espacio aislado con datos reales en Supabase.

Aplicación publicada: [Abrir Foco](https://speed-paradigm-ai-agents-challenge.vercel.app).

Repositorio: [speed-paradigm-ai-agents-challenge](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge).

La aplicación está desplegada en producción con Supabase real. No se necesitan credenciales de demostración: crea una sesión anónima automáticamente. Las comprobaciones ejecutadas y sus límites se documentan en [docs/aceptacion.md](docs/aceptacion.md).

## Arranque local

Requisitos: Node.js 24, npm y un proyecto Supabase Free. Las versiones exactas de dependencias están fijadas en `package.json` y `package-lock.json`.

1. Clonar el repositorio y ejecutar `npm ci`.
2. Crear un proyecto Supabase gratuito y habilitar **Anonymous Sign-Ins** en la configuración de Auth.
3. Ejecutar [supabase/migrations/202611230001_create_tasks.sql](supabase/migrations/202611230001_create_tasks.sql) en el SQL Editor del proyecto, o aplicar esa migración con el flujo habitual de Supabase CLI.
4. Copiar `.env.example` a `.env.local`. Configurar únicamente `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` con la URL y clave publicable del proyecto. La aplicación rechaza claves administrativas.
5. Ejecutar `npm run dev` y abrir http://localhost:3000.

Para probar la compilación de producción, ejecutar `npm run build` y después `npm start`. La aplicación no requiere fuentes remotas, imágenes externas ni servicios de IA.

No versionar `.env.local`, `.vercel/`, `.tools/`, claves o informes locales. Si faltan variables o Supabase no está disponible, el tablero muestra un error con reintento; no sustituye el servicio por tareas ficticias o almacenamiento local.

## Recorrido de demostración

1. Abrir la aplicación: aparece un espacio vacío propio.
2. Crear una tarea con título y prioridad. Recargar y comprobar que se conserva.
3. Cambiar el estado desde la tarjeta y editar título, descripción o prioridad.
4. Combinar búsqueda y filtros; limpiar filtros para recuperar el tablero.
5. Eliminar: cancelar conserva la tarea; confirmar la elimina también tras recargar.
6. Abrir otro perfil de navegador o una ventana privada: ese visitante tiene un espacio distinto y no ve las tareas del primero.

Las tareas se guardan en PostgreSQL. El navegador conserva la sesión en cookies HttpOnly; al borrar esas cookies se pierde el acceso a ese espacio. No se ofrece recuperación de cuenta ni sincronización entre dispositivos. Los proyectos gratuitos pueden pausarse por inactividad y las altas anónimas están sujetas a los límites de Supabase.

## Arquitectura y seguridad

- **Next.js App Router + TypeScript estricto**: página sin datos privados prerenderizados; componentes React con estados de carga, vacío y error, navegación por teclado, foco visible, diálogos nativos y anuncios de resultados.
- **API del mismo origen**: Route Handlers validan entradas y verifican cada usuario con `getUser()`. El navegador no instancia el SDK Supabase ni recibe tokens en JSON o localStorage.
- **Supabase SSR solo servidor**: cliente por petición con clave publicable; cookies HttpOnly, SameSite=Lax y Secure en producción. No se usa `service_role` para operar el tablero.
- **PostgreSQL y RLS**: propietario derivado de la identidad verificada; políticas SELECT/INSERT/UPDATE/DELETE por `auth.uid()`, permisos mínimos de columnas, restricciones de datos e índice por propietario/fecha.
- **Mutaciones**: Origin exacto obligatorio, cuerpos JSON limitados a 8 KiB y campos desconocidos rechazados. Las respuestas de sesión y tareas incluyen `Cache-Control: no-store`.

Los módulos puros de reglas están en `lib/tasks.ts` y `lib/security.ts`; la integración permanece bajo `lib/server/`. El diseño y las decisiones completas están en [docs/arquitectura.md](docs/arquitectura.md).

| Método | Ruta | Resultado |
| --- | --- | --- |
| POST | `/api/session` | Crea o reanuda el espacio; devuelve `{ok:true}`. |
| GET / POST | `/api/tasks` | Lista tareas propias / crea una tarea. |
| GET / PATCH / DELETE | `/api/tasks/[id]` | Consulta, edita o elimina una tarea propia. |

Las API devuelven `{tasks}`, `{task}` o `{ok:true}`. Los errores públicos son `{error,fields?}` con 400 (entrada inválida), 401 (sesión), 403 (origen), 404 (tarea ausente/ajena), 413 (cuerpo excesivo) o 503 (servicio no disponible). No muestran SQL ni credenciales.

## Comprobaciones

| Comando | Alcance |
| --- | --- |
| `npm run typecheck` | Genera tipos de rutas y comprueba TypeScript. |
| `npm run build` | Compilación de producción y comprobación de tipos. |
| `npm test` | Reglas y seguridad con el runner de Node. |
| `npm run test:integration` | API real, persistencia y ataques de aislamiento/RLS. |
| `npm run test:e2e` | Navegador real con Playwright, escritorio y móvil. |

Para integración/navegador, iniciar antes una compilación de producción y definir `TEST_BASE_URL` con su URL. En PowerShell: `$env:TEST_BASE_URL='http://localhost:3000'`. Las pruebas RLS usan las mismas dos variables publicables de Supabase; no necesitan claves administrativas. Playwright usa Chrome instalado por defecto y permite cambiar `PLAYWRIGHT_CHANNEL`. Consultar [docs/aceptacion.md](docs/aceptacion.md) para los comandos ejecutados, resultados y límites reales; la mera existencia de pruebas no acredita que hayan pasado.

## Equipo de agentes

El Orquestador conserva infraestructura, secretos, despliegue y entrega. Develop implementa la aplicación. Testing revisa de forma independiente y devuelve hallazgos reproducibles. Sus instrucciones están en [AGENTS.md](AGENTS.md), [agents/develop.md](agents/develop.md) y [agents/testing/DIRECTRICES.md](agents/testing/DIRECTRICES.md). El trabajo real se registra en [docs/registro-agentes.md](docs/registro-agentes.md).

Las cuatro preguntas y el enlace personal del reclutador siguen pendientes de su texto exacto; no se inventan respuestas ni se envían mensajes por iniciativa de los agentes.
