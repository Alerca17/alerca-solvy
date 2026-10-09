# Solvy - Gestión de Servicios

Aplicación web para gestionar el ciclo de vida de servicios automotrices o técnicos. El sistema permite crear servicios, consultar la lista de servicios registrados y avanzar cada servicio por un flujo controlado de estados:

```text
PENDING -> IN_PROGRESS -> COMPLETED
```

El proyecto está dividido en dos aplicaciones:

- **Backend:** API REST construida con NestJS, TypeScript, Prisma y SQLite.
- **Frontend:** aplicación web construida con Next.js, React, TypeScript, Tailwind CSS y HeroUI.

La solución aplica separación de responsabilidades en ambos lados. El backend sigue una arquitectura hexagonal orientada al dominio y el frontend utiliza una arquitectura por capas con adaptadores, dominio, contexto de estado y componentes de presentación.

---

## Tabla de contenidos

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Arquitectura general](#arquitectura-general)
- [Arquitectura hexagonal del backend](#arquitectura-hexagonal-del-backend)
- [Capas del frontend](#capas-del-frontend)
- [Flujo funcional](#flujo-funcional)
- [Reglas de negocio](#reglas-de-negocio)
- [API REST](#api-rest)
- [Persistencia](#persistencia)
- [Validación de datos](#validación-de-datos)
- [Interfaz de usuario](#interfaz-de-usuario)
- [Configuración local](#configuración-local)
- [Pruebas](#pruebas)
- [Decisiones técnicas](#decisiones-técnicas)
- [Observaciones de la implementación actual](#observaciones-de-la-implementación-actual)

---

## Tecnologías

### Backend

- **NestJS:** framework modular para construir la API REST.
- **TypeScript:** tipado estático y organización del código.
- **Prisma:** ORM utilizado para acceder a la base de datos.
- **SQLite:** base de datos local almacenada en `backend/prisma/dev.db`.
- **class-validator:** validación de los DTO recibidos por la API.
- **Jest y Supertest:** pruebas automatizadas.
- **CORS:** habilitado para permitir la comunicación con el frontend.

### Frontend

- **Next.js 16 con App Router:** framework de React y punto de entrada de la aplicación.
- **React 19:** construcción de la interfaz y manejo de estado.
- **TypeScript:** definición de contratos y tipos.
- **Tailwind CSS 3:** utilidades de estilos.
- **HeroUI:** componentes visuales accesibles como `Tabs`, `Card`, `Input`, `Textarea`, `Button`, `Chip` y `Spinner`.
- **Zod:** validación de datos en el dominio del frontend.
- **React Hook Form:** gestión del formulario.
- **Testing Library y Jest:** pruebas de la lógica de validación.
- **React Context API:** estado compartido de los servicios.

---

## Estructura del proyecto

```text
alerca-solvy/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── dev.db
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── services/
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── presentation/
│   │   │   └── services.module.ts
│   │   └── infraestructure/
│   │       └── repositories/
│   ├── test/
│   ├── limpiar.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── adapters/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── domain/
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── jest.config.mjs
│   └── package.json
│
└── README.md
```

---

## Arquitectura general

La comunicación entre las aplicaciones sigue este flujo:

```text
Usuario
  |
  v
Frontend Next.js
  |
  | serviceAdapter: fetch HTTP
  v
Backend NestJS
  |
  | Controller -> Use Case -> Repository
  v
Prisma
  |
  v
SQLite
```

El frontend no accede directamente a Prisma ni conoce los detalles de la base de datos. El backend tampoco depende de los componentes visuales: expone una API REST con contratos de entrada y salida.

---

## Arquitectura hexagonal del backend

El backend organiza el módulo de servicios separando el dominio de los mecanismos externos. La idea central es que las reglas de negocio no dependan de NestJS, Prisma, HTTP ni SQLite.

### Capas y responsabilidades

#### 1. Dominio

Ubicación:

```text
backend/src/services/domain/
```

Contiene las reglas esenciales del negocio:

- `entities/service.entity.ts`
  - Define la entidad `Service`.
  - Mantiene `id`, `title`, `description`, `status` y `createdAt`.
  - Implementa `changeStatus`, que controla las transiciones permitidas.
- `enums/service-status.enum.ts`
  - Define `PENDING`, `IN_PROGRESS` y `COMPLETED`.
- `repositories/service.repository.ts`
  - Define el puerto que necesita el dominio para guardar y consultar servicios.

Esta capa no conoce Prisma ni la forma en que se transportan las peticiones HTTP.

#### 2. Aplicación

Ubicación:

```text
backend/src/services/application/use-cases/
```

Contiene los casos de uso de la aplicación:

- `CreateServiceUseCase`
  - Genera un UUID.
  - Crea el servicio con estado inicial `PENDING`.
  - Persiste la entidad mediante el puerto `ServiceRepository`.
- `GetAllServicesUseCase`
  - Solicita todos los servicios al repositorio.
- `ChangeServiceStatusUseCase`
  - Busca el servicio.
  - Devuelve un error si no existe.
  - Solicita a la entidad el cambio de estado.
  - Persiste el resultado.

Los casos de uso dependen de la interfaz `ServiceRepository`, no de una implementación concreta. NestJS resuelve esa dependencia mediante el token `ServiceRepository`.

#### 3. Adaptadores de entrada

Ubicación:

```text
backend/src/services/presentation/
```

La entrada HTTP está compuesta por:

- `services.controller.ts`
  - Traduce las peticiones HTTP a llamadas a casos de uso.
- `dtos/create-service.dto.ts`
  - Valida título y descripción.
- `dtos/change-service-status.dto.ts`
  - Valida que el estado pertenezca al enum del dominio.

El controlador no contiene reglas de negocio. Su responsabilidad es recibir datos, delegarlos y devolver el resultado.

#### 4. Adaptadores de salida

Ubicación:

```text
backend/src/infraestructure/repositories/
```

`ServicePrismaRepository` implementa el puerto `ServiceRepository` usando Prisma:

- `save` utiliza `upsert` para crear o actualizar.
- `findById` consulta un servicio por identificador.
- `findAll` devuelve todos los servicios.
- `mapToDomain` convierte el registro de Prisma en una entidad `Service`.

Si en el futuro se sustituye SQLite por PostgreSQL, MongoDB u otro mecanismo, el cambio principal queda aislado en este adaptador mientras se conserva el contrato del repositorio.

#### 5. Composición de dependencias

`services.module.ts` conecta las piezas:

```text
'ServiceRepository' -> ServicePrismaRepository
```

Los casos de uso reciben ese puerto mediante inyección de dependencias. Esta composición permite que la aplicación utilice una implementación real en producción y otra implementación simulada en pruebas.

### Diagrama de la arquitectura hexagonal

```text
                         +----------------------+
                         |   HTTP / REST API    |
                         | ServicesController   |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |      Aplicación      |
                         |      Use Cases       |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |       Dominio        |
                         | Service + reglas     |
                         | ServiceRepository   |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Puerto de salida     |
                         | ServiceRepository    |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         | Adaptador Prisma     |
                         | SQLite               |
                         +----------------------+
```

---

## Capas del frontend

El frontend está organizado para evitar que los componentes visuales mezclen renderizado, validación, estado y llamadas HTTP.

### 1. Capa de dominio

Ubicación:

```text
frontend/src/domain/
```

`service.schema.ts` define:

- El enum de estados `PENDING`, `IN_PROGRESS` y `COMPLETED`.
- El esquema `createServiceSchema`.
- El esquema `updateServiceStatusSchema`.
- Los tipos TypeScript inferidos desde Zod.

La validación de creación exige:

- Título de al menos tres caracteres.
- Título con al menos una letra.
- Descripción de al menos diez caracteres.

Esta capa es independiente de HeroUI y de las pantallas.

### 2. Capa de adaptadores

Ubicación:

```text
frontend/src/adapters/service.adapter.ts
```

`serviceAdapter` centraliza las llamadas HTTP:

- `getServices`
- `getServiceById`
- `createService`
- `updateServiceStatus`

La URL base se obtiene desde `NEXT_PUBLIC_API_URL` y, si no está definida, utiliza `http://localhost:3000`.

Los componentes no construyen URLs ni configuran manualmente `fetch`; solicitan operaciones al adaptador. Esto reduce el acoplamiento con el backend y concentra el manejo de errores HTTP.

### 3. Gestión de estado

Ubicación:

```text
frontend/src/context/ServiceContext.tsx
```

`ServiceProvider` mantiene:

- La lista de servicios.
- El estado de carga.
- La función `refreshServices`.

Al montarse, el contexto obtiene los servicios del backend. Después de crear un servicio o cambiar su estado, los componentes llaman a `refreshServices` para sincronizar la interfaz.

El hook `useServices` protege el uso del contexto y lanza un error si se utiliza fuera de `ServiceProvider`.

### 4. Capa de presentación

Ubicación:

```text
frontend/src/components/
```

- `ServiceForm`
  - Gestiona el formulario con React Hook Form.
  - Usa `zodResolver` para aplicar el esquema del dominio.
  - Muestra errores de validación mediante componentes HeroUI.
  - Crea el servicio a través del adaptador.
  - Refresca la lista al finalizar.
- `ServiceList`
  - Consume los servicios del contexto.
  - Muestra estados con `Chip`.
  - Muestra estados de carga con `Spinner`.
  - Permite avanzar el estado mediante `Button`.
  - Oculta la acción de avance cuando el servicio está completado.

Estos componentes coordinan la interacción del usuario, pero las reglas centrales de transición también están protegidas por el backend.

### 5. Composición de la aplicación

Ubicación:

```text
frontend/src/app/
```

- `layout.tsx`
  - Define metadatos, fuente global, tema oscuro y estilos globales.
- `providers.tsx`
  - Monta `HeroUIProvider` y `ServiceProvider`.
- `page.tsx`
  - Composición principal de la pantalla.
  - Organiza las pestañas para consultar o crear servicios.
- `globals.css`
  - Carga las capas base, componentes y utilidades de Tailwind CSS v3.

### Diagrama de capas del frontend

```text
Página Next.js
    |
    +--> Componentes de presentación
    |       ServiceForm / ServiceList
    |
    +--> Contexto de estado
    |       ServiceProvider / useServices
    |
    +--> Adaptador HTTP
    |       serviceAdapter
    |
    +--> API REST del backend
    |
    +--> Dominio
            Zod schemas + TypeScript types
```

---

## Flujo funcional

### Crear un servicio

```text
Usuario completa el formulario
  -> React Hook Form captura los datos
  -> Zod valida título y descripción
  -> serviceAdapter.createService()
  -> POST /services
  -> CreateServiceUseCase
  -> Service se crea con PENDING
  -> ServicePrismaRepository.save()
  -> SQLite
  -> ServiceContext.refreshServices()
  -> La lista se actualiza
```

### Consultar servicios

```text
ServiceProvider se monta
  -> refreshServices()
  -> serviceAdapter.getServices()
  -> GET /services
  -> GetAllServicesUseCase
  -> ServicePrismaRepository.findAll()
  -> La respuesta se guarda en el contexto
  -> ServiceList renderiza las tarjetas
```

### Cambiar el estado

```text
Usuario pulsa "Iniciar Servicio" o "Completar Servicio"
  -> ServiceList calcula el siguiente estado
  -> serviceAdapter.updateServiceStatus()
  -> PATCH /services/:id/status
  -> ChangeServiceStatusUseCase
  -> Service.changeStatus()
  -> Repository guarda el cambio
  -> ServiceContext.refreshServices()
  -> La tarjeta refleja el nuevo estado
```

---

## Reglas de negocio

Las transiciones válidas son estrictamente secuenciales:

| Estado actual | Siguiente estado permitido |
|---|---|
| `PENDING` | `IN_PROGRESS` |
| `IN_PROGRESS` | `COMPLETED` |
| `COMPLETED` | Ninguno |

La entidad de dominio aplica estas reglas incluso si un consumidor intenta llamar directamente a la API con una transición inválida. La interfaz también evita ofrecer acciones que no corresponden:

- En `PENDING` muestra **Iniciar Servicio**.
- En `IN_PROGRESS` muestra **Completar Servicio**.
- En `COMPLETED` muestra **Servicio Finalizado** y no muestra botón de cambio.

La protección en dos niveles es intencional: la UI mejora la experiencia, pero el backend es la autoridad final de la regla de negocio.

---

## API REST

El backend escucha por defecto en el puerto `3000`.

### Crear servicio

```http
POST /services
Content-Type: application/json
```

Body:

```json
{
  "title": "Reparación de motor",
  "description": "El cliente reporta un ruido extraño en el motor."
}
```

El servicio se crea inicialmente con estado `PENDING`.

### Listar servicios

```http
GET /services
```

Devuelve todos los servicios almacenados.

### Cambiar estado

```http
PATCH /services/:id/status
Content-Type: application/json
```

Body:

```json
{
  "status": "IN_PROGRESS"
}
```

Los valores permitidos son `PENDING`, `IN_PROGRESS` y `COMPLETED`, aunque la entidad solo permite transiciones hacia el siguiente estado válido.

---

## Persistencia

Prisma define el modelo `Service`:

```text
Service
├── id          String    primary key
├── title       String
├── description String
├── status      String
└── createdAt   DateTime
```

La base de datos utilizada es SQLite y se encuentra en:

```text
backend/prisma/dev.db
```

El esquema está definido en `backend/prisma/schema.prisma` y la migración inicial crea la tabla `Service`.

El archivo `backend/limpiar.js` es una utilidad manual para eliminar todos los registros de la tabla `Service` mediante Prisma. No forma parte del flujo normal de la API.

---

## Validación de datos

### Backend

NestJS utiliza `ValidationPipe` global con:

- `whitelist: true`: conserva únicamente propiedades permitidas por los DTO.
- `forbidNonWhitelisted: true`: rechaza propiedades no declaradas.

Los DTO usan `class-validator`:

- `CreateServiceDto` valida que título y descripción sean textos no vacíos.
- `ChangeServiceStatusDto` valida que el estado pertenezca al enum del dominio.

### Frontend

El formulario usa Zod y React Hook Form:

- La validación ocurre antes de hacer la petición.
- Los mensajes se muestran junto a cada campo.
- `zodResolver` conecta el esquema con React Hook Form.

La validación en el frontend mejora la experiencia, pero no reemplaza la validación del backend.

---

## Interfaz de usuario

La pantalla principal está compuesta por dos pestañas:

1. **Ver Servicios**
   - Presenta los servicios en una cuadrícula responsiva.
   - Usa tarjetas HeroUI.
   - Representa cada estado con un color:
     - `PENDING`: advertencia.
     - `IN_PROGRESS`: primario.
     - `COMPLETED`: éxito.
2. **Crear Nuevo Servicio**
   - Presenta el formulario de creación.
   - Deshabilita visualmente la acción mientras se envía.
   - Muestra un mensaje de éxito tras crear el servicio.

HeroUI se integra mediante `HeroUIProvider`. Tailwind CSS v3 se integra con PostCSS y el plugin `heroui()` definido en `tailwind.config.js`.

---

## Configuración local

### Requisitos

- Node.js compatible con las versiones utilizadas por el proyecto.
- npm.

### Backend

Desde la carpeta `backend`:

```bash
npm install
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:3000
```

El backend utiliza la variable `DATABASE_URL` definida para Prisma. Para SQLite debe apuntar al archivo local de base de datos.

### Frontend

En otra terminal, desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

El frontend utiliza la variable opcional:

```text
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Si no se define, el adaptador usa `http://localhost:3000` automáticamente. Next.js elegirá el puerto disponible para la aplicación web.

---

## Pruebas

### Backend

Scripts disponibles:

```bash
npm test
npm run test:watch
npm run test:cov
npm run test:e2e
```

También existe el script de lint:

```bash
npm run lint
```

### Frontend

Script disponible:

```bash
npm run test
```

La prueba de dominio verifica que:

- Un título y una descripción válidos sean aceptados.
- Un título compuesto únicamente por números sea rechazado.

La lógica de validación está aislada del renderizado, por lo que puede probarse sin levantar el navegador ni el servidor.

---

## Decisiones técnicas

### Separar dominio y transporte

Las entidades y reglas de negocio no dependen de HTTP, Prisma ni React. Esto permite cambiar mecanismos externos sin reescribir la lógica central.

### Usar puertos y adaptadores

El caso de uso conoce la interfaz `ServiceRepository`, mientras que Prisma implementa esa interfaz. Esto permite sustituir la persistencia y facilita las pruebas unitarias.

### Centralizar el estado del frontend

`ServiceContext` evita pasar la lista de servicios y las funciones de actualización a través de múltiples niveles de componentes. Después de cada operación, la fuente de datos se refresca desde el backend.

### Validar en ambos extremos

El frontend proporciona feedback inmediato y el backend mantiene la seguridad e integridad de la API.

### Proteger las transiciones en el dominio

La entidad `Service` es la autoridad para decidir si un cambio de estado es válido. La lógica no se deja únicamente en los botones de la interfaz.

---

## Observaciones de la implementación actual

Estas observaciones describen el estado actual del código y no cambian su funcionamiento:

- El backend tiene configurado el endpoint funcional `/services`, pero la prueba e2e incluida en `backend/test/app.e2e-spec.ts` todavía espera `GET /` con la respuesta `Hello World!`. Actualmente no se observa un controlador raíz que implemente ese endpoint, por lo que esa prueba no representa el flujo principal de servicios.
- El adaptador del frontend incluye `getServiceById`, pero el controlador mostrado expone listado, creación y cambio de estado; no se observa un endpoint `GET /services/:id`.
- La base de datos almacena `status` como texto y el repositorio lo convierte al enum de dominio al reconstruir la entidad.
- El nombre de la carpeta `infraestructure` conserva la denominación actual del proyecto.
- El frontend utiliza Tailwind CSS v3 mediante las directivas `@tailwind base`, `@tailwind components` y `@tailwind utilities`. La configuración de compilación debe mantenerse alineada con ese flujo y no mezclar el loader de Tailwind v4/Turbopack.
- Los errores de carga o actualización se registran en consola desde el adaptador, el contexto y los componentes. La interfaz actual no muestra un componente de error dedicado.

---

## Resumen

Solvy separa claramente las responsabilidades:

```text
Dominio
  -> define entidades, tipos y reglas

Aplicación
  -> ejecuta casos de uso

Adaptadores
  -> conectan HTTP y persistencia con el núcleo

Presentación
  -> expone la API y renderiza la interfaz

Estado
  -> sincroniza la información del backend con la UI
```

El resultado es una base pequeña pero extensible: las reglas de negocio están protegidas en el dominio, la persistencia está aislada detrás de un puerto, el frontend tiene validación y estado centralizado, y la interfaz refleja el ciclo de vida completo de un servicio.
