# ROLE PERMISSIONS

Este documento describe los roles y los permisos recomendados para la API.

Formato: cada sección contiene una tabla con permisos, descripción y ámbitos (endpoints / recursos).

---

## SuperAdmin

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| users:manage | Crear/editar/eliminar usuarios y asignar roles | `POST /api/users`, `DELETE /api/users/:id` |
| system:config | Acceso completo a configuración global | `GET/PUT /api/system/config` |
| roles:manage | Crear/editar roles y permisos | `POST /api/roles` |
| data:export | Exportar datos y reportes | `GET /api/reports/export` |

---

## Admin

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| users:view | Ver lista de usuarios | `GET /api/users` |
| restaurants:manage | CRUD de restaurantes y configuración | `POST /api/restaurants` |
| analytics:view | Ver dashboards y métricas | `GET /api/analytics` |
| settings:update | Actualizar ajustes de la organización | `PUT /api/settings` |

---

## RestaurantOwner

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| restaurant:update | Modificar datos del propio restaurante | `PUT /api/restaurants/:id` |
| menu:manage | Crear/editar/eliminar items del menú | `POST /api/restaurants/:id/menu` |
| orders:view | Ver y gestionar pedidos del restaurante | `GET /api/restaurants/:id/orders` |
| staff:manage | Invitar y gestionar personal del restaurante | `POST /api/restaurants/:id/staff` |

---

## Manager

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| orders:manage | Gestionar pedidos (aceptar/cancelar) | `PATCH /api/orders/:id` |
| menu:edit | Editar items del menú | `PUT /api/restaurants/:id/menu/:itemId` |
| reports:view | Ver reportes del restaurante | `GET /api/restaurants/:id/reports` |

---

## Staff

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| orders:process | Marcar pedidos como en preparación / listos | `PATCH /api/orders/:id/status` |
| orders:view | Ver pedidos asignados | `GET /api/orders?assignedTo=me` |
| profile:update | Actualizar su propio perfil | `PUT /api/users/me` |

---

## Customer

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| orders:create | Crear pedidos | `POST /api/orders` |
| orders:view | Ver sus pedidos | `GET /api/users/me/orders` |
| reviews:create | Enviar reseñas | `POST /api/restaurants/:id/reviews` |

---

## Guest / Public

| Permiso | Descripción | Ámbito / Ejemplo |
|---|---:|---|
| restaurants:publicView | Ver listados y detalles públicos | `GET /api/restaurants`, `GET /api/restaurants/:id` |
| auth:register | Registro y login | `POST /api/auth/register`, `POST /api/auth/login` |

---

### Notas y buenas prácticas

- Mantener permisos granulares (acciones por recurso) para evitar `isAdmin` monolíticos.
- Usar tablas `roles`, `permissions`, `role_permissions` en la DB para administrar dinámicamente.
- Definir permisos de tipo `resource:action` (ej. `restaurants:read`, `menu:create`).
- Implementar tests que validen que cada endpoint rechaza/acepta según permisos.
- Registrar auditoría para acciones críticas (crear/eliminar usuarios, cambios de permisos).
