# CAE Backend

API REST del sistema de gestión del **Club Atlético Estudiantes Tucumán**. Este backend permite administrar socios, deportes, categorías, profesores, horarios, pagos, noticias y notificaciones del club.

## Tecnologías

- **Node.js** y **TypeScript**
- **NestJS 12** – Framework para desarrollar la API REST.
- **PostgreSQL** – Base de datos relacional.
- **Prisma ORM 7** – Acceso y administración de la base de datos.
- **Supabase** – Base de datos alojada y almacenamiento de imágenes.
- **JWT** – Autenticación mediante tokens.
- **bcrypt** – Hash de contraseñas.
- **Vitest** – Ejecución de pruebas.

## Funcionalidades

### Autenticación y usuarios
- Inicio de sesión mediante correo electrónico y contraseña.
- Generación de tokens JWT.
- Contraseñas almacenadas mediante hash.
- Roles de usuario: `admin` y `member`.
- Protección de rutas según autenticación y permisos.

### Socios
- Registro, consulta, modificación y eliminación de socios.
- Asociación de socios con uno o más deportes.
- Asignación automática de categorías según la edad.
- Consulta de la información del socio autenticado.
- Registro de pagos mensuales.
- Consulta del estado de las cuotas.

### Deportes y categorías
- Administración de deportes.
- Administración de categorías por deporte.
- Definición de edades mínimas y máximas.
- Control de rangos de edades para evitar superposiciones.

### Profesores
- Registro y administración de profesores.
- Asociación de profesores con sus respectivos deportes.

### Horarios
- Administración de horarios de entrenamiento.
- Asociación con deportes y categorías.
- Organización por día de la semana y franja horaria.
- Validación de horarios y prevención de superposiciones para un mismo deporte y día.

### Noticias
- Publicación, consulta, modificación y eliminación de noticias.
- Clasificación por deporte o noticias generales del club.
- Asociación de imágenes a las publicaciones.

### Notificaciones
- Generación automática de avisos relacionados con las cuotas de los socios.
- Clasificación de notificaciones según el estado de pago:
  - `por_vencer`
  - `pendiente`
  - `vencida`
  - `inactivo`
  - `sin_pagos`

### Imágenes
- Carga y eliminación de imágenes mediante Supabase Storage.
- Formatos permitidos: JPG, PNG y WebP.
- Tamaño máximo permitido: 5 MB.
- Generación de nombres únicos para los archivos.

## Estructura del proyecto

```text
cae-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── prisma7.config.ts
├── src/
│   ├── common/
│   │   ├── password.ts
│   │   └── today.ts
│   ├── database/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── modules/
│   │   ├── app/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── members/
│   │   ├── sports/
│   │   ├── categories/
│   │   ├── coaches/
│   │   ├── schedules/
│   │   ├── news/
│   │   ├── notifications/
│   │   └── uploads/
│   └── main.ts
├── postman/
│   └── cae-backend.postman_collection.json
├── package.json
└── tsconfig.json
```

Cada módulo contiene la lógica correspondiente a una funcionalidad del sistema. Los controladores reciben las solicitudes HTTP y los servicios gestionan las operaciones y reglas de negocio.

La carpeta `database` contiene la configuración y el servicio de Prisma. La carpeta `common` reúne funciones compartidas por distintos módulos.

## Base de datos

La aplicación utiliza PostgreSQL y Prisma ORM.

Los principales modelos de datos son:

| Modelo | Descripción |
|---|---|
| User | Cuentas de usuario y roles. |
| Member | Información personal de los socios. |
| Payment | Pagos y períodos abonados. |
| Sport | Deportes del club. |
| Category | Categorías asociadas a deportes. |
| MemberSport | Relación entre socios, deportes y categorías. |
| Coach | Profesores del club. |
| Schedule | Horarios de entrenamiento. |
| News | Noticias y publicaciones. |

Las relaciones entre modelos utilizan claves foráneas y restricciones de integridad. Las migraciones de Prisma permiten mantener el esquema de la base de datos actualizado.

## Instalación y configuración

### Requisitos

- Node.js
- npm
- PostgreSQL mediante Supabase.
- Una cuenta de Supabase con un proyecto configurado.

### 1. Clonar el repositorio

```bash
git clone https://github.com/EstebanWytry/cae-backend.git
cd cae-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/postgres"
JWT_SECRET="clave_secreta"

SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_SECRET_KEY="tu_clave_secreta"
```

- `DATABASE_URL`: cadena de conexión a PostgreSQL.
- `JWT_SECRET`: clave utilizada para firmar y verificar los tokens JWT.
- `SUPABASE_URL`: URL del proyecto de Supabase.
- `SUPABASE_SECRET_KEY`: clave secreta utilizada para acceder a Supabase Storage.

Las credenciales deben mantenerse privadas y no deben subirse al repositorio.

En Supabase Storage debe existir un bucket público llamado `news-images`, utilizado para almacenar las imágenes de las noticias.

### 4. Aplicar las migraciones

```bash
npx prisma migrate deploy
```

### 5. Generar Prisma Client

```bash
npx prisma generate --schema=prisma/schema.prisma
```

### 6. Iniciar el servidor

Modo desarrollo:

```bash
npm run start:dev
```

El servidor estará disponible en:

```text
http://localhost:3000
```

## Autenticación y permisos

La autenticación utiliza JWT. Para acceder a las rutas protegidas se debe enviar el token en el encabezado HTTP:

```http
Authorization: Bearer <token>
```

El inicio de sesión se realiza mediante:

```http
POST /auth/login
```

Ejemplo de solicitud:

```json
{
  "email": "admin@ejemplo.com",
  "password": "contraseña"
}
```

La respuesta incluye el token de acceso, el identificador del usuario, su correo electrónico y su rol.

El token tiene una duración de una hora.

Las operaciones administrativas requieren un usuario autenticado con el rol `admin`. Las rutas públicas y las operaciones disponibles para socios se indican en la sección de endpoints.

## Endpoints de la API

Base URL:

```text
http://localhost:3000
```

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/login` | Público | Iniciar sesión. |
| GET | `/sports` | Público | Listar deportes. |
| GET | `/sports/:id` | Público | Consultar deporte. |
| POST | `/sports` | Admin | Crear deporte. |
| PATCH | `/sports/:id` | Admin | Modificar deporte. |
| DELETE | `/sports/:id` | Admin | Eliminar deporte. |
| GET | `/members/me` | Admin / Socio | Consultar el propio perfil. |
| GET | `/members` | Admin | Listar socios. |
| GET | `/members/:id` | Admin | Consultar socio. |
| POST | `/members` | Admin | Registrar socio. |
| PATCH | `/members/:id` | Admin | Modificar socio. |
| DELETE | `/members/:id` | Admin | Eliminar socio. |
| POST | `/members/:id/payments` | Admin | Registrar pago. |
| GET | `/categories` | Admin | Listar categorías. |
| GET | `/categories/:id` | Admin | Consultar categoría. |
| POST | `/categories` | Admin | Crear categoría. |
| PATCH | `/categories/:id` | Admin | Modificar categoría. |
| DELETE | `/categories/:id` | Admin | Eliminar categoría. |
| GET | `/coaches` | Público | Listar profesores. |
| GET | `/coaches/:id` | Público | Consultar profesor. |
| POST | `/coaches` | Admin | Crear profesor. |
| PATCH | `/coaches/:id` | Admin | Modificar profesor. |
| DELETE | `/coaches/:id` | Admin | Eliminar profesor. |
| GET | `/schedules` | Público | Listar horarios. |
| GET | `/schedules/:id` | Público | Consultar horario. |
| POST | `/schedules` | Admin | Crear horario. |
| PATCH | `/schedules/:id` | Admin | Modificar horario. |
| DELETE | `/schedules/:id` | Admin | Eliminar horario. |
| GET | `/news` | Público | Listar noticias. |
| GET | `/news/:id` | Público | Consultar noticia. |
| POST | `/news` | Admin | Crear noticia. |
| PATCH | `/news/:id` | Admin | Modificar noticia. |
| DELETE | `/news/:id` | Admin | Eliminar noticia. |
| GET | `/notifications` | Admin | Consultar notificaciones. |
| POST | `/uploads` | Admin | Subir imagen. |
| DELETE | `/uploads/:filename` | Admin | Eliminar imagen. |

Para filtrar notificaciones se puede utilizar el parámetro `type`:

```http
GET /notifications?type=pendiente
```

## Pruebas

El proyecto utiliza Vitest para ejecutar las pruebas automatizadas.

Ejecutar las pruebas unitarias:

```bash
npm run test
```

Ejecutar las pruebas en modo observación:

```bash
npm run test:watch
```

Ejecutar las pruebas con cobertura:

```bash
npm run test:cov
```

Ejecutar las pruebas end-to-end:

```bash
npm run test:e2e
```

También se incluye una colección de Postman en:

```text
postman/cae-backend.postman_collection.json
```

Para utilizarla, importar el archivo en Postman y configurar la variable `base_url` con la dirección del servidor.

## Otros comandos

Compilar el proyecto:

```bash
npm run build
```

Ejecutar el servidor compilado:

```bash
npm run start:prod
```

Ejecutar el análisis estático:

```bash
npm run lint
```

Formatear el código:

```bash
npm run format
```

---

**Proyecto:** Club Atlético Estudiantes Tucumán  
**Repositorio:** [cae-backend](https://github.com/EstebanWytry/cae-backend)