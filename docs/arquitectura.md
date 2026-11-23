# Foco — arquitectura

## Producto

Foco es un tablero personal de tareas en español. La demostración no pide registro, correo ni contraseña. Cada navegador recibe una sesión anónima y conserva únicamente acceso a sus propias tareas persistidas en PostgreSQL de Supabase. Al borrar cookies o cerrar una sesión privada se pierde el acceso a ese espacio; no se promete sincronización entre dispositivos.

El flujo central es crear una tarea, moverla entre Pendiente / En curso / Hecha, editarla, buscarla o filtrarla por prioridad y eliminarla con confirmación. Una primera visita vacía ofrece una acción clara para crear la primera tarea; no se presentan registros ficticios como si fueran datos persistidos.

## Componentes y límites

- Next.js App Router sirve el documento y el diseño inicial sin datos privados.
- Un componente cliente administra el tablero, formularios y estados de interfaz. Solo llama a rutas del mismo origen; no instancia Supabase ni recibe tokens.
- Los Route Handlers crean el cliente Supabase por petición con `@supabase/ssr`. La sesión se conserva en cookies HttpOnly, SameSite=Lax, Path=/ y Secure en producción.
- `POST /api/session` reanuda una sesión válida o crea un usuario anónimo cuando no existe sesión. No reemplaza silenciosamente un espacio existente si Supabase devuelve un error temporal.
- Las rutas de tareas verifican el usuario con Supabase y usan su propia sesión. La aplicación no usa claves `service_role` ni privilegios administrativos.
- Las respuestas privadas y de sesión incluyen `Cache-Control: no-store`. No hay caché compartida de tareas ni generación estática de información privada.
- Las mutaciones comprueban el encabezado Origin contra el origen real de la petición, rechazan cuerpos ajenos al contrato y usan mensajes públicos sin filtrar detalles internos.

## Contrato de datos propuesto

`tasks`: `id` UUID, `owner_id` UUID de `auth.users`, `title` texto de 1–120 caracteres tras recorte, `description` texto de 0–500 caracteres, `status` en `pending | in_progress | done`, `priority` en `low | medium | high`, y fechas de creación y actualización.

`owner_id` se deriva de la sesión. El cliente nunca elige el propietario. La base de datos aplica restricciones equivalentes a las de la API y un índice por propietario/fecha para las consultas del tablero.

RLS se habilita expresamente. Las políticas se limitan al rol `authenticated`, que también usan los usuarios anónimos de Auth: SELECT y DELETE exigen `owner_id = (select auth.uid())`; INSERT exige esa condición en WITH CHECK; UPDATE la exige tanto en USING como en WITH CHECK. El acceso sin sesión no tiene permisos efectivos. Una actualización no puede transferir una fila a otro propietario.

## API propuesta

| Método y ruta | Resultado |
| --- | --- |
| POST `/api/session` | Inicializa/reanuda el espacio y fija cookies; sin credenciales en JSON. |
| GET `/api/tasks` | Lista únicamente las tareas del usuario verificado, ordenadas por creación. |
| POST `/api/tasks` | Valida y crea una tarea del usuario. |
| PATCH `/api/tasks/[id]` | Valida y actualiza una tarea propia; devuelve 404 si no existe o no es accesible. |
| DELETE `/api/tasks/[id]` | Elimina una tarea propia; devuelve 404 si no existe o no es accesible. |

La API utiliza 400 para entrada inválida, 401 para sesión ausente o inválida, 403 para origen rechazado y 503 para indisponibilidad de la integración. Los mensajes de error indican cómo reintentar sin revelar configuración, SQL ni tokens.

## Interfaz

Diseño sobrio con fondo azul profundo, superficies de contraste y acento verde. Cabecera con marca Foco, acción Nueva tarea y explicación breve del espacio. Resumen con cantidades reales por estado. Búsqueda y filtros con etiquetas visibles. Tres columnas en escritorio y una disposición vertical usable en móvil, sin arrastre obligatorio.

El formulario usa un diálogo nativo accesible para creación y edición. La eliminación exige una confirmación separada. Los controles funcionan con teclado, muestran foco visible y evitan acciones duplicadas mientras se guardan. Los cambios y errores se anuncian mediante regiones accesibles. No se necesitan imágenes externas ni fuentes descargadas para funcionar.

## Dependencias mínimas previstas

- Runtime: `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`, `server-only`.
- Desarrollo: TypeScript y tipos de Node/React; Testing definirá la herramienta de pruebas pertinente.
- Sin SDK de IA, pagos, analítica o almacenamiento adicional. Los tres agentes pertenecen al proceso de construcción, no son llamadas de pago de la aplicación.

Las versiones exactas se resolverán antes de instalar y quedarán fijadas mediante el archivo de bloqueo. La implementación comenzará cuando el Orquestador confirme el proyecto y la integración reales.

## Verificación esperada

Testing probará el CRUD y recarga, errores de validación, móvil/teclado y dos sesiones aisladas. También atacará directamente el acceso de datos: lectura ajena, UPDATE/DELETE ajenos e INSERT/UPDATE con propietario ajeno. Orquestador conserva la responsabilidad de publicar producción, verificar acceso sin sesión Vercel y entregar el repositorio accesible.

## Decisiones y límites

El plan gratuito es obligatorio. Los proyectos Supabase Free pueden pausarse por inactividad; la entrega debe verificar disponibilidad cercana a la evaluación. Las altas anónimas tienen límites de uso del proveedor, por lo que se reutiliza la sesión del navegador y no se crea otra por cada carga. Los límites efectivos y el comportamiento desde Vercel se comprobarán con la integración real, sin desactivar controles del proveedor por conjetura.
