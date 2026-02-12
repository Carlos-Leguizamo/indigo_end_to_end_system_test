# Sistema de Gestión End-to-End (Fullstack)

Sistema de Gestión de **Clientes, Productos y Ventas** desarrollado con tecnologías modernas, aplicando principios de **Clean Architecture**, autenticación con **JWT** y persistencia con **PostgreSQL**.

La aplicación está construida bajo una arquitectura escalable y mantenible, separando claramente las responsabilidades entre frontend y backend.

---

## Stack Tecnológico

### Frontend
- React
- Vite
- JavaScript
- Material UI (MUI)

### Backend
- .NET 10
- Entity Framework Core
- Clean Architecture
- JWT Authentication

### Base de Datos
- PostgreSQL

---

## Descripción General

La aplicación permite la gestión integral de clientes, productos y ventas dentro de un sistema con autenticación y control de acceso por usuario.

### Funcionalidades principales

- Gestión de Clientes (CRUD)
- Gestión de Productos (CRUD)
- Gestión de Ventas (CRUD)
- Registro de ventas con múltiples ítems (detalle de productos por venta)
- Cálculo automático del total de la venta
- Reportes de ventas por rango de fechas
- Autenticación y autorización mediante JWT

---

## Arquitectura del Backend

El backend está estructurado siguiendo los principios de Clean Architecture, garantizando separación de responsabilidades, mantenibilidad y escalabilidad.

```bash
server/
 ├── Core            → Entidades del dominio
 ├── Application     → Casos de uso y lógica de negocio
 ├── Infrastructure  → Persistencia (EF Core, DbContext, Repositorios)
 └── WebApi          → Controllers, configuración, autenticación
```

### Descripción de Capas

- **Core:** Contiene las entidades del dominio y reglas de negocio.
- **Application:** Implementa los casos de uso, servicios y lógica de aplicación.
- **Infrastructure:** Gestiona el acceso a datos mediante Entity Framework Core.
- **WebApi:** Expone los endpoints REST, configuración de JWT y middlewares.

---

## Autenticación

El sistema utiliza JSON Web Tokens (JWT) para:

- Autenticación de usuarios
- Protección de endpoints
- Autorización basada en token
- Control de acceso a recursos protegidos

---


## Requisitos del Sistema

- .NET 10 SDK
- Node.js v22 o superior
- PostgreSQL

---

## Características Técnicas

- Arquitectura basada en principios SOLID
- Separación clara entre dominio, aplicación e infraestructura
- Uso de DTOs para transferencia de datos
- Inyección de dependencias
- Relaciones uno a muchos (Venta → Ítems de Venta)
- Código estructurado para escalabilidad futura


## Endpoints Principales 

### Auth

- POST /api/auth/register 

- POST /api/auth/login 

## Products 

- GET /api/products

- GET /api/products/{id}

- POST /api/products

- PUT /api/products/{id}

- DELETE /api/products/{id}

## Clients

- GET /api/clients

- GET /api/clients/{id}

- POST /api/clients

- PUT /api/clients/{id}

- DELETE /api/clients/{id}

## Sales 

- POST /api/sales

- GET /api/sales

- GET /api/sales/report?from=yyyy-mm-dd&to=yyyy-mm-dd

## Instalación y Ejecución Backend

### 1 Clonar el repositorio

```bash
git clone https://github.com/Carlos-Leguizamo/indigo_end_to_end_system_test.git
cd indigo_end_to_end_system_test/server
```

---

### 2 Configurar la base de datos (PostgreSQL)

Asegúrate de tener PostgreSQL en ejecución.

Crea una base de datos:

```sql
CREATE DATABASE indigo_system;
```

---

### 3️ Configurar variables de entorno

En el proyecto `WebApi`, configura el archivo `appsettings.json` con tu cadena de conexión:

```json
{
  "ConnectionStrings": {
    "PostgresConnection": "PLACEHOLDER"
  },
  "JwtSettings": {
    "SecretKey": "PLACEHOLDER"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

```

### 4 Configura el .env con las variables de entorno
En el proyecto `WebApi`, configura el archivo `.env` con tu cadena de conexión:

```bash
POSTGRES_CONNECTION=Host=localhost;Port=5432;Database=indigo_db;Username=postgres;Password=tu_password
JWT_KEY=my-super-secret-jwt-key-indigo-2026-secure-app-123456
JWT_ISSUER=IndigoApp
JWT_AUDIENCE=IndigoUsers
```


Reemplaza `tu_password` por tu contraseña real de PostgreSQL.

---

### 5 Restaurar dependencias

Desde la carpeta `server`:

```bash
dotnet restore
```

---

### 6 Aplicar migraciones y crear la base de datos

Si ya tienes migraciones creadas:

```bash
dotnet ef database update --project Infrastructure --startup-project WebApi
```

Si necesitas crear una nueva migración:

```bash
dotnet ef migrations add InitialCreate --project Infrastructure --startup-project WebApi
dotnet ef database update --project Infrastructure --startup-project WebApi
```

---

### 6️ Ejecutar el backend

```bash
dotnet run --project WebApi
```

O si estás dentro de `WebApi`:

```bash
dotnet run 

dotnet wacth run
```

---

### 7️ Verificar que esté funcionando

La API estará disponible en:

```
https://localhost:5039
```


## Backend listo

Si todo está correctamente configurado, el servidor estará ejecutándose y podrás consumir los endpoints desde el frontend.


---
---

## Arquitectura del Frontend

El frontend fue desarrollado con **React 19 + Vite**, utilizando una estructura modular basada en separación por responsabilidades.

La organización del proyecto sigue un enfoque por capas funcionales:

- `api/` → Comunicación con el backend
- `context/` → Manejo de estado global (Autenticación)
- `components/` → Componentes reutilizables
- `layout/` → Layouts principales
- `pages/` → Vistas principales del sistema
- `routes/` → Configuración de rutas
- `theme/` → Configuración visual (MUI)

---

## Estructura Actual del Proyecto

```bash
client/
 ├── src/
 │   ├── api/
 │   │    ├── auth.js
 │   │    ├── clients.js
 │   │    ├── products.js
 │   │    └── sales.js
 │   │
 │   ├── assets/
 │   │    └── react.svg
 │   │
 │   ├── components/
 │   │    ├── ConfirmDialog.jsx
 │   │    ├── Navbar.jsx
 │   │    ├── ProtectedRoute.jsx
 │   │    └── Sidebar.jsx
 │   │
 │   ├── context/
 │   │    └── AuthContext.jsx
 │   │
 │   ├── layout/
 │   │    ├── AuthLayout.jsx
 │   │    └── DashboardLayout.jsx
 │   │
 │   ├── pages/
 │   │    ├── Clients.jsx
 │   │    ├── Dashboard.jsx
 │   │    ├── Login.jsx
 │   │    ├── Products.jsx
 │   │    ├── Register.jsx
 │   │    └── Sales.jsx
 │   │
 │   ├── routes/
 │   │    └── AppRoutes.jsx
 │   │
 │   ├── theme/
 │   │    └── theme.js
 │   │
 │   ├── App.jsx
 │   ├── App.css
 │   ├── index.css
 │   └── main.jsx
 │
 ├── index.html
 ├── package.json
 ├── vite.config.js
 └── .env
```


## Manejo de Autenticación

La autenticación se gestiona mediante:

- JWT (JSON Web Token)

- Context API (AuthContext)

- Protección de rutas mediante ProtectedRoute

- Layouts diferenciados para áreas públicas y privadas

Flujo:

- Usuario inicia sesión.

- Se almacena el token.

- El contexto mantiene el estado autenticado.

- ProtectedRoute valida acceso a rutas privadas.


## Instalación y Ejecución Fronted

### 1 Clonar el repositorio

```bash
git clone https://github.com/Carlos-Leguizamo/indigo_end_to_end_system_test.git
cd indigo_end_to_end_system_test/client
```

---

### 2 Instala dependencias

```bash
npm install
```

### 3 Configura la variable de entorno para la URL del backend
Crea un archivo `.env` en la carpeta `client` (raiz del proyecto) con el siguiente contenido:

```
VITE_API_URL = http://localhost:5039/api
```

> **Nota:** Si el backend corre en otro puerto o dominio, actualiza la URL.

### 4 Inicia el servidor de desarrollo
```bash
npm run dev
```

- El frontend estará disponible en: `http://localhost:5173` (o el puerto que indique Vite).



**Desarrollado por: Carlos Leguizamo**