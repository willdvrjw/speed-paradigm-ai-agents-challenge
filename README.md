# Foco — Un paso a la vez

Tablero de tareas en español construido con Next.js y Supabase. Cada navegador recibe automáticamente su propio espacio de demostración, con tareas persistentes y acceso aislado.

**[Abrir la aplicación](https://speed-paradigm-ai-agents-challenge.vercel.app)** · **[Repositorio público](https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge)**

No necesitas usuario, contraseña, cuenta de Vercel ni instalación. Puedes abrir el enlace en una ventana privada para probar un espacio nuevo.

## Demo en dos minutos

1. Crea una tarea con título, descripción y prioridad; recarga para comprobar que permanece.
2. Muévela entre **Pendiente**, **En curso** y **Hecha**, y edita sus detalles.
3. Combina búsqueda por título/descripción con filtros de estado y prioridad; usa **Limpiar filtros** para volver al tablero completo.
4. Elimina una tarea: **Cancelar** la conserva y **Eliminar tarea** confirma el borrado.
5. Abre otro perfil o ventana privada: sus tareas están separadas de las del primer visitante.

La interfaz se adapta a móvil y escritorio, admite teclado y muestra estados vacíos, carga y errores con reintento. Los cambios se anuncian de forma accesible.

## Equipo de tres agentes

| Rol | Responsabilidad | Instrucciones |
| --- | --- | --- |
| Orquestador | Define requisitos, delega, coordina revisiones y publica. | [AGENTS.md](AGENTS.md) |
| Develop | Implementa la aplicación y corrige los hallazgos. | [agents/develop.md](agents/develop.md) |
| Testing | Revisa de forma independiente y ejecuta las pruebas. | [agents/testing/DIRECTRICES.md](agents/testing/DIRECTRICES.md) |

Las definiciones de subagentes están en [.codex/agents/](.codex/agents/). El [registro de agentes](docs/registro-agentes.md) conserva las delegaciones, revisiones y correcciones reales.

## Stack y datos

- **Next.js App Router, React y TypeScript estricto**, con estilos propios y sin dependencias visuales externas.
- **Supabase PostgreSQL y Auth anónima**, accedidos desde Route Handlers del mismo origen. No hay formulario de registro.
- **Aislamiento en la base de datos mediante RLS**, propietario verificado por petición y restricciones de título, descripción, estado y prioridad.
- **Sesión en cookies HttpOnly**, SameSite=Lax y Secure en producción; validación de Origin en mutaciones y respuestas privadas `no-store`.

El cliente no recibe claves administrativas ni almacena tokens en localStorage. Arquitectura, API y fuentes: [docs/arquitectura.md](docs/arquitectura.md) y [docs/documentacion.md](docs/documentacion.md).

## Arranque local

Requisitos: **Node.js 24**, npm y un proyecto **Supabase Free**. Las versiones están fijadas en `package.json` y `package-lock.json`.

1. Clona el repositorio y entra en la carpeta:

   ```sh
   git clone https://github.com/willdvrjw/speed-paradigm-ai-agents-challenge.git
   cd speed-paradigm-ai-agents-challenge
   npm ci
   ```

2. En tu proyecto Supabase, habilita **Anonymous Sign-Ins** y aplica [la migración SQL](supabase/migrations/202611230001_create_tasks.sql) desde su SQL Editor.
3. Copia `.env.example` a `.env.local` y configura las dos variables de servidor: `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. Usa la clave publicable del proyecto; conserva los valores fuera de Git.
4. Ejecuta `npm run dev` y abre http://localhost:3000.

Para ejecutar la versión de producción local, usa `npm run build` y después `npm start`. Si falta configuración o falla la base de datos, la aplicación muestra un error; no reemplaza la persistencia por datos ficticios.

## Pruebas y evidencias

| Comando | Verifica |
| --- | --- |
| `npm run typecheck` | Tipos de rutas y TypeScript. |
| `npm run build` | Compilación de producción. |
| `npm test` | Reglas de validación y seguridad. |
| `npm run test:integration` | API real, persistencia y aislamiento/RLS. |
| `npm run test:e2e` | Flujos en navegador, teclado, móvil, errores y recuperación. |

Las pruebas de integración y navegador requieren una aplicación real iniciada y `TEST_BASE_URL` definido. En PowerShell: `$env:TEST_BASE_URL='http://localhost:3000'`. Las pruebas RLS usan las mismas variables publicables de Supabase, sin claves administrativas. Playwright usa Chrome instalado; la configuración optativa permite otros motores.

Los resultados ejecutados, las regresiones y sus límites están en [aceptación](docs/aceptacion.md) y [auditoría](docs/auditoria.md). Incluyen comprobaciones sobre Supabase real y acceso HTTPS sin sesión de Vercel. El workflow [Public browser access](.github/workflows/public-access.yml) permite repetir el smoke público de WebKit; los detalles de compatibilidad y entorno están en la auditoría.

La regresión de volumen crea y elimina 1.005 tareas de un espacio de prueba propio. Es optativa: sin la bandera siguiente, ese caso se omite. Para incluirla en la suite completa, con la aplicación local iniciada y el mismo Supabase configurado en `.env.local`:

```powershell
$env:TEST_BASE_URL='http://localhost:3000'
$env:TEST_LARGE_COLLECTION='1'
node --env-file=.env.local node_modules/playwright/cli.js test
```

## Despliegue gratuito

1. Usa **Supabase Free** y un espacio **Vercel Hobby**; importa el repositorio con preset Next.js, raíz del proyecto y Node.js 24.
2. Configura `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` para **Production**, y despliega la rama `main`. Si cambias variables, crea un nuevo despliegue para aplicarlas.
3. En **Settings › Deployment Protection**, desactiva **Vercel Authentication** y guarda.
4. Comprueba la URL principal de producción en una ventana privada: debe abrir sin login de Vercel y conservar una tarea al recargar.

## Límites de la demostración

- Requiere conexión, JavaScript y cookies de este sitio. La interfaz explica cómo habilitarlos; no necesita cookies de terceros.
- Cada perfil de navegador conserva su espacio. Borrar sus cookies hace perder el acceso; no hay recuperación de cuenta ni sincronización entre dispositivos.
- Los planes gratuitos tienen cuotas y límites de altas; Supabase puede pausarse por inactividad. La aplicación no configura restricciones por país, pero no se garantiza acceso desde todas las redes o navegadores antiguos.
- Está pensado para tableros personales. Los límites de volumen y edición entre pestañas se detallan en [la auditoría técnica](docs/auditoria.md).
