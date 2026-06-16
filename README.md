# Sistema Administrativo TESJo (PSICEI)

Sistema web en PHP para registro, autenticación, captura de indicadores y consulta de estadísticas institucionales del TecNM — TESJo.

**Producción:** [https://sistemaaministrativo.store/prueba/prueba](https://sistemaaministrativo.store/prueba/prueba)

## Descripción del sistema

PSICEI (Programa para la Sistematización y Consolidación de la Estadística Institucional) permite:

- Registro e inicio de sesión de usuarios por área institucional
- Captura de datos por módulos (Dirección Académica y Vinculación y Extensión)
- Exportación de reportes en Excel y PDF
- Panel de administración de usuarios
- Asistente con IA (opcional, Gemini)
- Despliegue seguro con variables de entorno (`.env`)

## Tecnologías utilizadas

| Categoría | Tecnología |
|-----------|------------|
| Backend | PHP 8.x |
| Base de datos | MySQL / MariaDB |
| Servidor web | Apache (XAMPP / cPanel) |
| Frontend | HTML5, CSS3, JavaScript |
| Librerías JS | Chart.js, jsPDF, SheetJS (XLSX), Bootstrap Icons |
| Seguridad | Sesiones PHP, `.env`, `.htaccess`, rate limit login |
| Control de versiones | Git, GitHub |
| Hosting producción | Namecheap cPanel |

## Estructura principal

- `LOGIN/` — Registro, login, panel admin, recuperación de acceso
- `MENU/` — Módulos y formularios por dirección/departamento
- `API/` — Configuración, registros, estadísticas, IA
- `assets/` — CSS, JS compartidos y configuración de módulos
- `db/` — Scripts SQL de base de datos
- `tools/` — Utilidades de prueba

## Requisitos

- XAMPP (Apache + PHP 8 + MySQL) o hosting compatible
- PHP con extensiones `mysqli`, `json`, `session`
- Apache con `mod_rewrite` y `mod_headers`

## Instalación (local)

1. Clona el repositorio en `C:\xampp\htdocs\prueba\prueba\` (o tu ruta de htdocs).
2. Copia `.env.example` a `.env` y configura credenciales de BD.
3. Importa `db/psicei_db_ready_import.sql` en MySQL (o `db/migrations.sql` si aplica).
4. Abre: `http://localhost/prueba/prueba/LOGIN/login.php`
5. Usuario admin inicial: ver `PSICEI_ADMIN_USER` y `PSICEI_ADMIN_PASSWORD` en tu `.env`.

## Producción (cPanel / Namecheap)

1. Sube el proyecto a `public_html/prueba/prueba/`.
2. Crea base de datos y usuario MySQL en cPanel.
3. Copia `.env.example` → `.env` con valores de producción.
4. Define:
   - `PSICEI_APP_ENV=production`
   - `PSICEI_DEBUG=0`
   - `PSICEI_FORCE_HTTPS=1`
   - `PSICEI_SITE_URL=https://tu-dominio/prueba/prueba`
5. Importa el SQL en phpMyAdmin.
6. Verifica HTTPS y que `.env` no sea accesible desde el navegador (403).

## Ramas del repositorio

| Rama | Uso |
|------|-----|
| `main` | Versión estable desplegada en producción |
| `develop` | Desarrollo y pruebas locales |

## Integrantes del equipo

> **Edita esta tabla con los datos reales de tu equipo antes de entregar.**

| Nombre | Matrícula | Rol |
|--------|-----------|-----|
| (Nombre completo) | (Matrícula) | Líder / Backend |
| (Nombre completo) | (Matrícula) | Frontend |
| (Nombre completo) | (Matrícula) | Base de datos |
| (Nombre completo) | (Matrícula) | Documentación |

## Variables de entorno mínimas

- `PSICEI_SITE_URL`, `PSICEI_DB_HOST`, `PSICEI_DB_USER`, `PSICEI_DB_PASS`, `PSICEI_DB_NAME`
- `PSICEI_ADMIN_PASSWORD`
- `RECAPTCHA_ENABLED`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` (opcional)
- `GEMINI_API_KEY` (opcional, asistente IA)

## Nota

Los módulos HTML en `MENU/` usan rutas fijas; evita renombrar carpetas sin actualizar `.htaccess` y enlaces internos.
