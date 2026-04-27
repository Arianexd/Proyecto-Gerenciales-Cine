# Prompt para Gemini — Presentación CinemaBook

Copia y pega este prompt completo en Gemini:

---

```
Crea una presentación profesional de 3 diapositivas para el proyecto de software "CinemaBook"
(sistema de reserva de entradas de cine). Usa un estilo visual moderno con fondo claro y colores
profesionales: fondo blanco o gris muy claro (#F8F9FA), títulos en azul oscuro (#1A237E) o
azul acero (#1565C0), acentos en dorado/ámbar (#F9A825) o rojo cine suave (#C62828).
Tipografía moderna: Montserrat o Lato. Las tablas deben tener filas alternas en gris muy claro
(#ECEFF1) sobre fondo blanco, con encabezados en azul oscuro con texto blanco.

---

### DIAPOSITIVA 1 — PRODUCT BACKLOG

Título: "🎬 Product Backlog — CinemaBook"
Subtítulo: "28 Historias de Usuario priorizadas por valor de negocio"

Muestra una tabla con las 28 historias de usuario ordenadas por prioridad descendente.
Columnas: ID | Historia de Usuario | Prioridad | Story Points | Estado

| ID    | Historia de Usuario                                          | Prioridad  | SP  | Estado        |
|-------|--------------------------------------------------------------|------------|-----|---------------|
| HU-11 | Configurar asientos de sala con calidad acústica/visual      | 🔴 Crítica | 13  | ✅ Finalizado |
| HU-01 | Explorar el catálogo de películas                            | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-02 | Ver detalle de película y sus funciones                      | 🟠 Alta    | 3   | ✅ Finalizado |
| HU-03 | Gestión de Reservas                                          | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-04 | Gestión de Pagos                                             | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-06 | Gestión de inventario                                        | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-07 | Venta de snacks                                              | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-08 | Ver resumen de entradas al finalizar la compra               | 🟠 Alta    | 3   | ✅ Finalizado |
| HU-09 | Administrar el catálogo de películas (admin)                 | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-10 | Gestionar las salas del cine                                 | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-12 | Programar funciones de cine                                  | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-16 | Diseño de página de dashboard del administrador              | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-17 | Gestionar base de clientes registrados                       | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-22 | Implementar rol de cajero con acceso limitado                | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-13 | Gestionar las reservas de los clientes (admin)               | 🟡 Media   | 5   | ✅ Finalizado |
| HU-14 | Revisar y gestionar los pagos registrados                    | 🟡 Media   | 5   | ✅ Finalizado |
| HU-15 | Panel principal del administrador con métricas               | 🟡 Media   | 3   | ✅ Finalizado |
| HU-18 | Rediseñar página de inicio para más atractivo visual         | 🟡 Media   | 3   | ✅ Finalizado |
| HU-20 | Ampliar perfil del cliente con datos demográficos            | 🟡 Media   | 2   | ✅ Finalizado |
| HU-21 | Cuenta propia del cliente con historial de reservas          | 🟡 Media   | 5   | ✅ Finalizado |
| HU-23 | Mostrar precios en bolivianos                                | 🟡 Media   | 2   | ✅ Finalizado |
| HU-19 | Vender productos del snack bar junto con las entradas        | 🟢 Baja    | 5   | ✅ Finalizado |
| HU-05 | Pagar las entradas con tarjeta dentro del sistema            | ⚪ Mínima  | 8   | ⏳ Por hacer  |
| HU-24 | Integrar pasarela de pago real (Stripe / PayPal)             | ⚪ Mínima  | 13  | ⏳ Por hacer  |
| HU-25 | Enviar confirmación de reserva por correo electrónico        | ⚪ Mínima  | 5   | ⏳ Por hacer  |
| HU-26 | Mostrar recomendaciones de películas personalizadas          | ⚪ Mínima  | 8   | ⏳ Por hacer  |
| HU-27 | Aplicación móvil nativa para comprar entradas                | ⚪ Mínima  | 21  | ⏳ Por hacer  |
| HU-28 | Programa de fidelización con puntos y descuentos             | ⚪ Mínima  | 8   | ⏳ Por hacer  |

Agrega debajo de la tabla 4 tarjetas de resumen (cards) en fila con fondo azul claro (#E3F2FD)
y texto azul oscuro:
- 🎟️ Total Product Backlog: 28 HU / 185 Story Points
- ✅ Finalizadas en Sprint: 22 HU — 122 SP
- ⏳ Pendientes (baja prioridad): 6 HU — 63 SP
- 📈 Cobertura del backlog prioritario: 100%

---

### DIAPOSITIVA 2 — SPRINT BACKLOG

Título: "🗂️ Sprint Backlog — SCRUM Sprint 0"
Subtítulo: "22 historias seleccionadas por prioridad y capacidad del equipo · 122 Story Points · 100% Completado"

En la esquina superior derecha coloca un recuadro de contexto con borde azul y fondo
azul muy claro (#E8EAF6):
"Criterio de selección: se incluyeron el 100% de las HU de prioridad Crítica, Alta, Media
y Baja. Las 6 HU de prioridad Mínima (63 SP) quedaron fuera del sprint por su alto costo
relativo frente al valor de negocio inmediato que aportan."

Muestra la tabla del Sprint Backlog con todas las historias en estado Finalizado:

| ID    | Historia de Usuario                                   | Prioridad  | SP  | Estado        |
|-------|-------------------------------------------------------|------------|-----|---------------|
| HU-11 | Configurar asientos con calidad acústica/visual       | 🔴 Crítica | 13  | ✅ Finalizado |
| HU-01 | Explorar catálogo de películas                        | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-02 | Ver detalle de película y funciones                   | 🟠 Alta    | 3   | ✅ Finalizado |
| HU-03 | Gestión de Reservas                                   | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-04 | Gestión de Pagos                                      | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-06 | Gestión de inventario                                 | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-07 | Venta de snacks                                       | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-08 | Ver resumen de entradas al finalizar compra            | 🟠 Alta    | 3   | ✅ Finalizado |
| HU-09 | Administrar catálogo de películas                     | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-10 | Gestionar salas del cine                              | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-12 | Programar funciones de cine                           | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-16 | Diseño de dashboard del administrador                 | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-17 | Gestionar base de clientes registrados                | 🟠 Alta    | 5   | ✅ Finalizado |
| HU-22 | Rol de cajero con acceso limitado                     | 🟠 Alta    | 8   | ✅ Finalizado |
| HU-13 | Gestionar reservas de clientes (admin)                | 🟡 Media   | 5   | ✅ Finalizado |
| HU-14 | Gestionar pagos registrados                           | 🟡 Media   | 5   | ✅ Finalizado |
| HU-15 | Panel de administrador con métricas                   | 🟡 Media   | 3   | ✅ Finalizado |
| HU-18 | Rediseñar página de inicio                            | 🟡 Media   | 3   | ✅ Finalizado |
| HU-20 | Ampliar perfil del cliente                            | 🟡 Media   | 2   | ✅ Finalizado |
| HU-21 | Cuenta propia del cliente con historial               | 🟡 Media   | 5   | ✅ Finalizado |
| HU-23 | Mostrar precios en bolivianos                         | 🟡 Media   | 2   | ✅ Finalizado |
| HU-19 | Vender snacks junto con entradas                      | 🟢 Baja    | 5   | ✅ Finalizado |

Debajo de la tabla coloca un gran indicador visual de éxito: una barra de progreso al
100% en verde (#2E7D32) con el texto "Sprint completado al 100% — 22 de 22 historias
finalizadas". Complementa con un gráfico de torta completamente verde que diga
"✅ 22 HU Finalizadas (100%)".

---

### DIAPOSITIVA 3 — PRODUCT BACKLOG vs. SPRINT BACKLOG

Título: "📊 Cobertura del Product Backlog mediante el Sprint"
Subtítulo: "El Sprint 0 cubrió el 79% del Product Backlog priorizando el 100% del valor de negocio crítico"

Diseña esta diapositiva con dos columnas separadas por una línea vertical delgada en gris.

**COLUMNA IZQUIERDA — Product Backlog (28 HU · 185 SP)**
Muestra cada nivel de prioridad como una barra horizontal de cobertura con colores
y el porcentaje de HU que entraron al sprint:

| Prioridad   | Total HU | En Sprint | SP incluidos | Cobertura |
|-------------|----------|-----------|--------------|-----------|
| 🔴 Crítica  | 1 HU     | 1 HU      | 13 SP        | 100% ✅   |
| 🟠 Alta     | 13 HU    | 13 HU     | 76 SP        | 100% ✅   |
| 🟡 Media    | 7 HU     | 7 HU      | 25 SP        | 100% ✅   |
| 🟢 Baja     | 1 HU     | 1 HU      | 5 SP         | 100% ✅   |
| ⚪ Mínima   | 6 HU     | 0 HU      | 0 / 63 SP    | 0% ⏳     |

Agrega nota al pie de la tabla con fondo amarillo suave (#FFFDE7) y borde ámbar:
"Las 6 HU de prioridad Mínima representan 63 SP de alto costo con bajo impacto inmediato.
Candidatas para el siguiente sprint o iteración futura."

**COLUMNA DERECHA — Resultado del Sprint 0 (22 HU · 122 SP)**
Muestra un medidor de velocímetro o barra de progreso en verde al 100% con estos datos:

- Sprint comprometido: 122 Story Points
- Sprint entregado: 122 Story Points (100%)
- Historias completadas: 22 de 22 (100%)
- Historias pendientes: 0

Debajo coloca una tarjeta de conclusión con borde verde grueso (#2E7D32) y fondo verde
muy claro (#F1F8E9):

"🏆 Sprint 0 — COMPLETADO AL 100%
El equipo entregó las 22 historias comprometidas en el sprint, cubriendo el 100% de las
prioridades Crítica, Alta, Media y Baja del Product Backlog. Las únicas 6 historias no
incluidas son de prioridad Mínima, decisión estratégica justificada por su alto costo
(63 SP) frente al valor de negocio inmediato que representan."

Finalmente, agrega una fila de 3 métricas destacadas con fondo azul claro (#E3F2FD)
y texto azul oscuro:
- 🎯 Cobertura del backlog de valor: 22 de 28 HU (79% del total, 100% de lo prioritario)
- ⚡ Velocidad del equipo: 122 SP entregados en un sprint
- 🏆 Tasa de cumplimiento del sprint: 100% — 0 historias sin entregar

---

Instrucciones de diseño globales para las 3 diapositivas:
- Fondo principal: blanco (#FFFFFF) o gris muy claro (#F8F9FA)
- Color de títulos: azul oscuro (#1A237E)
- Color de subtítulos: azul medio (#1565C0)
- Acentos y destacados: dorado/ámbar (#F9A825) o rojo cine suave (#C62828)
- Encabezados de tablas: fondo azul oscuro (#1A237E) con texto blanco
- Filas alternas de tablas: blanco y gris muy claro (#ECEFF1)
- Cards/recuadros de resumen: fondo azul pálido (#E3F2FD) con borde azul (#1565C0)
- Indicadores de éxito/completado: verde (#2E7D32) con fondo (#F1F8E9)
- Indicadores de pendiente: ámbar (#F9A825) con fondo (#FFFDE7)
- Tipografía: Montserrat (títulos) y Lato o Roboto (cuerpo)
- Íconos de cine en los títulos: 🎬 🎟️ 🏛️ 📊
- Estilo ejecutivo/gerencial, limpio y con buen espaciado
- Resolución: 16:9 (widescreen)
```

---

---

# Prompt para Gemini — Herramientas de Desarrollo por Rol

Copia y pega este prompt completo en Gemini:

---

```
Crea una presentación profesional de 3 diapositivas sobre las herramientas tecnológicas
utilizadas para el desarrollo del proyecto "CinemaBook" (sistema de reserva de entradas
de cine), organizadas por rol del equipo de desarrollo.

Diseño visual: fondo blanco (#FFFFFF) o gris muy claro (#F8F9FA), títulos en azul oscuro
(#1A237E), subtítulos en azul medio (#1565C0). Cada diapositiva usa un color de acento
distinto según el rol: verde (#1B5E20) para el Scrum Master, azul acero (#0D47A1) para
el Backend, violeta/índigo (#311B92) para el Frontend. Tipografía Montserrat (títulos)
y Roboto (cuerpo). Resolución 16:9. Estilo ejecutivo/gerencial y limpio.

---

### DIAPOSITIVA 1 — ROL: SCRUM MASTER / PRODUCT OWNER

Título: "🗂️ Herramientas del Scrum Master / Product Owner"
Subtítulo: "Gestión ágil del proyecto, planificación y seguimiento del equipo"
Color de acento: verde oscuro (#1B5E20) con fondo de cards verde pálido (#F1F8E9)

Presenta las herramientas en tarjetas visuales (cards) de 2 columnas, cada card con
ícono grande, nombre de la herramienta, categoría y descripción breve de cómo se usó:

CARD 1 — Jira (gerenciales-cine.atlassian.net)
- Categoría: Gestión de proyectos ágiles
- Uso: Creación y priorización del Product Backlog con 28 historias de usuario.
  Configuración del Sprint Backlog en SCRUM Sprint 0. Seguimiento de estados
  (Por hacer → En curso → En revisión → Finalizado). Asignación de prioridades
  (Crítica, Alta, Media, Baja, Mínima).

CARD 2 — GitHub
- Categoría: Control de versiones y colaboración
- Uso: Repositorio central del proyecto (rama main). Historial de commits por
  funcionalidad. Colaboración del equipo mediante push/pull. Seguimiento de cambios
  en el código fuente de backend y frontend.

CARD 3 — Canva
- Categoría: Diseño de presentaciones
- Uso: Elaboración de presentaciones visuales del proyecto para revisiones de sprint,
  demo al cliente y documentación del backlog. Diseño de diagramas y reportes del
  estado del producto.

CARD 4 — npm (Node Package Manager)
- Categoría: Gestión de dependencias
- Uso: Instalación y coordinación de paquetes tanto en el backend como en el
  frontend. Scripts de inicio del proyecto (npm run dev, npm run seed, npm run build).

Agrega al pie un recuadro verde claro con el texto:
"El Scrum Master coordinó 28 historias de usuario distribuidas en 1 sprint, logrando
un cumplimiento del 100% del Sprint Backlog comprometido."

---

### DIAPOSITIVA 2 — ROL: DESARROLLADOR BACKEND

Título: "⚙️ Herramientas del Desarrollador Backend"
Subtítulo: "API REST, base de datos y lógica de negocio del sistema CinemaBook"
Color de acento: azul acero (#0D47A1) con fondo de cards azul pálido (#E3F2FD)

Presenta las herramientas en una cuadrícula de 3 columnas con cards visuales:

CARD 1 — Node.js
- Categoría: Entorno de ejecución
- Uso: Runtime JavaScript del servidor. Ejecuta el servidor Express en el puerto 3000.
  Manejo asíncrono de peticiones HTTP.

CARD 2 — Express.js v4.18
- Categoría: Framework web / API REST
- Uso: Estructura de la API REST con 13 rutas registradas: /api/movies, /api/sessions,
  /api/reservations, /api/customers, /api/halls, /api/seats, /api/payments,
  /api/tickets, /api/auth, /api/me, /api/reviews, /api/snacks, /api/pos.
  Middleware de manejo de errores y CORS.

CARD 3 — MongoDB + Mongoose v8.0
- Categoría: Base de datos NoSQL + ODM
- Uso: Almacenamiento de entidades del sistema: Movie, MovieSession, Hall, Seat,
  Reservation, Payment, Ticket, Customer, User, Review, SnackProduct, SnackCategory,
  SnackSale. Conexión mediante MONGODB_URI en variables de entorno.

CARD 4 — JWT (jsonwebtoken v9.0)
- Categoría: Autenticación y seguridad
- Uso: Generación y validación de tokens Bearer para proteger rutas de admin y cajero.
  Roles diferenciados: admin, cajero, cliente.

CARD 5 — bcryptjs v3.0
- Categoría: Seguridad / encriptación
- Uso: Hash de contraseñas de usuarios antes de almacenarlas en MongoDB.
  Verificación segura en el proceso de login.

CARD 6 — Postman
- Categoría: Pruebas de API
- Uso: Prueba y documentación de todos los endpoints REST del backend. Colecciones
  organizadas por recurso para validar respuestas, códigos HTTP y estructura JSON.

CARD 7 — dotenv v16.3
- Categoría: Configuración de entorno
- Uso: Carga de variables de entorno (MONGODB_URI, PORT) desde el archivo .env
  para separar configuración del código.

CARD 8 — nodemon v3.0
- Categoría: Herramienta de desarrollo
- Uso: Reinicio automático del servidor al detectar cambios en archivos durante
  el desarrollo (npm run dev).

CARD 9 — cors v2.8
- Categoría: Seguridad HTTP
- Uso: Habilitación de solicitudes cross-origin para permitir que el frontend
  en el puerto 5173 consuma la API del backend en el puerto 3000.

Agrega al pie un recuadro azul claro con arquitectura resumida:
"Arquitectura: Cliente HTTP → Express.js (puerto 3000) → Mongoose ODM → MongoDB
13 recursos REST | 13 modelos de datos | Autenticación JWT | Roles: admin, cajero, cliente"

---

### DIAPOSITIVA 3 — ROL: DESARROLLADOR FRONTEND

Título: "🎨 Herramientas del Desarrollador Frontend"
Subtítulo: "Interfaz web del sistema CinemaBook — experiencia del cliente, cajero y administrador"
Color de acento: índigo/violeta (#311B92) con fondo de cards lila pálido (#EDE7F6)

Presenta las herramientas en una cuadrícula de 3 columnas con cards visuales:

CARD 1 — Next.js 14 (App Router)
- Categoría: Framework React / SSR
- Uso: Framework principal del frontend. App Router con rutas del sistema:
  · Públicas: /, /movies, /movies/[id], /booking/[sessionId], /payment/[reservationId],
    /confirmation/[reservationId], /my-ticket/[ticketId], /account, /account/login,
    /account/register
  · Admin: /admin, /admin/movies, /admin/halls, /admin/sessions, /admin/reservations,
    /admin/payments, /admin/customers, /admin/snacks, /admin/pos
  Middleware de protección de rutas para el área de administración.

CARD 2 — TypeScript v5.3
- Categoría: Tipado estático
- Uso: Tipado de todos los componentes, páginas y funciones. Definición de tipos
  en lib/types.ts para entidades del dominio (Movie, Session, Reservation, etc.).
  Detección de errores en tiempo de compilación.

CARD 3 — React 18
- Categoría: Librería de UI
- Uso: Componentes reutilizables: Navigation, LoadingSpinner, Modal, ConfirmDialog,
  TicketDisplay. Manejo de estado local con hooks (useState, useEffect).

CARD 4 — Tailwind CSS v3.3
- Categoría: Framework de estilos
- Uso: Diseño responsivo y estilos utilitarios en todas las páginas. Configuración
  personalizada en tailwind.config.js. Procesado con PostCSS y Autoprefixer.

CARD 5 — Axios v1.6
- Categoría: Cliente HTTP
- Uso: Todas las llamadas a la API REST del backend pasan por lib/api.ts con un
  cliente Axios configurado. Interceptor automático para adjuntar el token JWT
  Bearer en cada petición autenticada.

CARD 6 — react-hot-toast v2.4
- Categoría: Notificaciones UI
- Uso: Feedback visual al usuario en acciones como reservas exitosas, errores de
  pago, login y operaciones CRUD del administrador.

CARD 7 — VS Code
- Categoría: Editor de código
- Uso: Desarrollo de todos los componentes y páginas del frontend. Integración
  con ESLint para detección de errores en tiempo real. Extensiones para TypeScript
  y Tailwind CSS.

CARD 8 — ESLint v8.56 + eslint-config-next
- Categoría: Calidad de código
- Uso: Análisis estático del código TypeScript/React. Reglas específicas de Next.js
  para buenas prácticas (npm run lint).

CARD 9 — localStorage (Web API)
- Categoría: Persistencia en cliente
- Uso: Almacenamiento del token JWT de autenticación y del estado de selección
  de asientos durante el flujo de reserva. Gestionado mediante lib/auth.ts.

Agrega al pie un diagrama de flujo simplificado en recuadro lila claro mostrando
las 3 vistas principales según rol de usuario:

"👤 Cliente: Catálogo → Detalle película → Selección de asientos → Pago → Ticket QR
🏪 Cajero: POS → Venta directa de entradas + snacks en taquilla
🔧 Administrador: Dashboard → Películas / Salas / Sesiones / Reservas / Pagos / Clientes"

---

Instrucciones de diseño globales para las 3 diapositivas:
- Fondo principal: blanco (#FFFFFF) o gris muy claro (#F8F9FA)
- Títulos principales: azul oscuro (#1A237E), Montserrat Bold
- Subtítulos: azul medio (#1565C0), Montserrat Regular
- Cuerpo de texto: gris oscuro (#37474F), Roboto Regular
- Cards de herramientas: fondo blanco con borde izquierdo grueso del color de acento del rol,
  sombra suave, ícono de la tecnología en la esquina superior derecha
- Acento Diapositiva 1 (Scrum Master): verde (#1B5E20)
- Acento Diapositiva 2 (Backend): azul acero (#0D47A1)
- Acento Diapositiva 3 (Frontend): índigo (#311B92)
- Recuadros de resumen al pie: fondo muy claro del color de acento, borde sólido
- Íconos sugeridos por tecnología: Node.js 🟢, MongoDB 🍃, Express ⚡, Next.js ▲,
  TypeScript 🔷, React ⚛️, Tailwind 🌊, GitHub 🐙, Jira 🗂️, JWT 🔐
- Resolución: 16:9 (widescreen)
- Cada diapositiva debe sentirse autónoma pero parte de una misma presentación cohesiva
```

---

---

# Prompt para Gemini — Herramientas por Integrante del Equipo (8 diapositivas)

Copia y pega este prompt completo en Gemini:

---

```
Crea una presentación profesional de 8 diapositivas para el proyecto "CinemaBook"
(sistema de reserva de entradas de cine), donde cada diapositiva muestra las
herramientas tecnológicas utilizadas por un integrante específico del equipo de
desarrollo.

Diseño visual global: fondo blanco (#FFFFFF) o gris muy claro (#F8F9FA), títulos
en azul oscuro (#1A237E), subtítulos en azul medio (#1565C0). Tipografía Montserrat
(títulos) y Roboto (cuerpo). Resolución 16:9. Estilo ejecutivo/gerencial y limpio.
Cada diapositiva tiene un color de acento según el rol:
- Product Owner: dorado/ámbar (#F57F17) con fondo (#FFF8E1)
- Scrum Master: verde oscuro (#1B5E20) con fondo (#F1F8E9)
- Desarrollador Backend: azul acero (#0D47A1) con fondo (#E3F2FD)
- Desarrollador Frontend: índigo/violeta (#311B92) con fondo (#EDE7F6)

Las herramientas se muestran como tarjetas (cards) con ícono grande, nombre de la
herramienta, categoría y descripción breve de cómo la usó esa persona.
Cada card tiene fondo blanco, borde izquierdo grueso del color de acento del rol
y sombra suave.

---

### DIAPOSITIVA 1 — TORREZ CALLE ALVARO · Product Owner

Título: "🎯 Torrez Calle Alvaro — Product Owner"
Subtítulo: "Definición de requerimientos, priorización del backlog y visión del producto"
Color de acento: dorado (#F57F17) · fondo de cards (#FFF8E1)

CARD 1 — Jira (gerenciales-cine.atlassian.net)
- Categoría: Gestión de requerimientos
- Uso: Creación y priorización de las 28 historias de usuario del Product Backlog.
  Definición de prioridades (Crítica, Alta, Media, Baja, Mínima) y criterios de
  aceptación. Validación del estado de cada HU al cierre del sprint.

CARD 2 — GitHub
- Categoría: Revisión y seguimiento del producto
- Uso: Revisión del repositorio central del proyecto. Validación de que las
  funcionalidades entregadas corresponden a las historias de usuario aceptadas.
  Seguimiento del historial de commits por funcionalidad.

CARD 3 — Canva
- Categoría: Diseño y presentaciones
- Uso: Elaboración de presentaciones del producto para revisiones de sprint,
  demo al cliente y documentación de la visión del proyecto. Diseño de
  diagramas de flujo y mockups del sistema.

CARD 4 — Notion
- Categoría: Documentación del producto
- Uso: Redacción y organización de documentación del proyecto: criterios de
  aceptación, glosario del dominio y actas de revisión de sprint.

CARD 5 — npm
- Categoría: Coordinación del entorno
- Uso: Instalación y verificación del entorno de desarrollo del proyecto
  (npm install, npm run dev, npm run seed) para validar el estado del producto
  en ejecución local.

Pie de diapositiva (recuadro dorado claro):
"El Product Owner definió y priorizó 28 historias de usuario, logrando que el
equipo entregara el 100% del backlog de valor crítico, alto, medio y bajo."

---

### DIAPOSITIVA 2 — QUECAÑA MAMANI ARIANE LUZ · Scrum Master

Título: "🗂️ Quecaña Mamani Ariane Luz — Scrum Master"
Subtítulo: "Coordinación del equipo, gestión del sprint y facilitación del proceso ágil"
Color de acento: verde oscuro (#1B5E20) · fondo de cards (#F1F8E9)

CARD 1 — Jira (gerenciales-cine.atlassian.net)
- Categoría: Gestión ágil del sprint
- Uso: Configuración del SCRUM Sprint 0 con las 22 historias seleccionadas (122 SP).
  Seguimiento del tablero Kanban (Por hacer → En curso → En revisión → Finalizado).
  Generación de reportes de burndown y métricas de velocidad del equipo.

CARD 2 — GitHub
- Categoría: Control y seguimiento de entregas
- Uso: Monitoreo del historial de commits del equipo. Verificación de que cada
  historia de usuario tuviese su implementación correspondiente en el repositorio.
  Revisión de ramas y colaboración del equipo.

CARD 3 — Canva
- Categoría: Diseño y documentación visual
- Uso: Elaboración de reportes visuales del sprint, tableros de retrospectiva
  y presentaciones de la ceremonia Sprint Review. Diseño de diagramas del
  proceso ágil y métricas del equipo.

CARD 4 — npm
- Categoría: Gestión de entorno
- Uso: Coordinación de la instalación de dependencias del proyecto en backend
  y frontend. Ejecución de scripts de inicio (npm run dev, npm run build)
  para validar el entorno del equipo.

CARD 5 — Google Meet / Zoom
- Categoría: Comunicación del equipo
- Uso: Facilitación de ceremonias Scrum: Sprint Planning, Daily Standup,
  Sprint Review y Sprint Retrospective del equipo de 6 desarrolladores.

Pie de diapositiva (recuadro verde claro):
"El Scrum Master coordinó 1 sprint con 22 historias (122 SP), logrando
un cumplimiento del 100% del Sprint Backlog comprometido."

---

### DIAPOSITIVA 3 — RAMOS TORREZ OZIEL RODMAN · Desarrollador Backend

Título: "⚙️ Ramos Torrez Oziel Rodman — Desarrollador Backend"
Subtítulo: "API REST, autenticación y lógica de negocio del sistema CinemaBook"
Color de acento: azul acero (#0D47A1) · fondo de cards (#E3F2FD)

CARD 1 — Node.js
- Categoría: Entorno de ejecución
- Uso: Runtime JavaScript del servidor. Manejo asíncrono de peticiones HTTP.
  Ejecución del servidor Express en el puerto 3000.

CARD 2 — Express.js v4.18
- Categoría: Framework API REST
- Uso: Desarrollo de rutas REST para los recursos principales: /api/movies,
  /api/sessions, /api/reservations. Middleware de manejo de errores y CORS.

CARD 3 — MongoDB + Mongoose v8.0
- Categoría: Base de datos NoSQL + ODM
- Uso: Modelado de entidades Movie, MovieSession y Reservation. Conexión
  mediante MONGODB_URI. Implementación de cascade deletes entre entidades
  relacionadas.

CARD 4 — JWT (jsonwebtoken v9.0) + bcryptjs v3.0
- Categoría: Autenticación y seguridad
- Uso: Generación y validación de tokens Bearer para rutas protegidas.
  Hash seguro de contraseñas antes del almacenamiento en MongoDB.

CARD 5 — Postman
- Categoría: Pruebas de API
- Uso: Prueba y documentación de los endpoints REST del backend. Validación
  de respuestas HTTP, códigos de estado y estructura de datos JSON.

CARD 6 — VS Code + nodemon v3.0
- Categoría: IDE y herramienta de desarrollo
- Uso: Desarrollo del código backend. Reinicio automático del servidor al
  detectar cambios en archivos durante el desarrollo (npm run dev).

CARD 7 — GitHub
- Categoría: Control de versiones
- Uso: Versionado del código fuente backend. Push de funcionalidades al
  repositorio central. Colaboración con el equipo mediante commits.

Pie de diapositiva (recuadro azul claro):
"Backend: Node.js + Express.js (puerto 3000) → Mongoose ODM → MongoDB
Responsable: rutas de películas, sesiones, reservas y autenticación JWT."

---

### DIAPOSITIVA 4 — ROJAS VALENCIA DAYANA GRETEL · Desarrolladora Frontend

Título: "🎨 Rojas Valencia Dayana Gretel — Desarrolladora Frontend"
Subtítulo: "Interfaz de usuario, páginas públicas y panel de administración de CinemaBook"
Color de acento: índigo (#311B92) · fondo de cards (#EDE7F6)

CARD 1 — Next.js 14 (App Router)
- Categoría: Framework principal
- Uso: Desarrollo de páginas del sistema: rediseño de la página de inicio (HU-18),
  gestión de clientes registrados (HU-17) y cuenta del cliente con historial
  de reservas (HU-21). Uso del App Router con rutas dinámicas.

CARD 2 — TypeScript v5.3
- Categoría: Tipado estático
- Uso: Tipado de componentes y funciones. Definición de tipos en lib/types.ts
  para entidades del dominio. Detección de errores en tiempo de compilación.

CARD 3 — React 18
- Categoría: Librería de UI
- Uso: Componentes reutilizables para la vista de clientes y panel de admin.
  Manejo de estado con hooks useState y useEffect.

CARD 4 — Tailwind CSS v3.3
- Categoría: Framework de estilos
- Uso: Diseño responsivo en todas las páginas desarrolladas. Estilos de la
  página de inicio y sección de gestión de clientes del administrador.

CARD 5 — Axios v1.6
- Categoría: Cliente HTTP
- Uso: Llamadas a la API REST del backend a través de lib/api.ts. Interceptor
  para adjuntar el token JWT Bearer en peticiones autenticadas.

CARD 6 — ESLint v8.56
- Categoría: Calidad de código
- Uso: Análisis estático del código TypeScript/React. Aplicación de reglas
  específicas de Next.js para buenas prácticas (npm run lint).

CARD 7 — GitHub
- Categoría: Control de versiones
- Uso: Repositorio central del proyecto. Commits de las historias de usuario
  HU-17, HU-18 y HU-21. Colaboración con el equipo mediante push/pull.

Pie de diapositiva (recuadro lila claro):
"Páginas desarrolladas: inicio, gestión de clientes (admin), perfil y
historial de reservas del cliente (HU-17, HU-18, HU-21)."

---

### DIAPOSITIVA 5 — AGUIRRE FREDERICK · Desarrollador Backend

Título: "⚙️ Aguirre Frederick — Desarrollador Backend"
Subtítulo: "Gestión de pagos, tickets digitales y configuración del entorno"
Color de acento: azul acero (#0D47A1) · fondo de cards (#E3F2FD)

CARD 1 — Node.js
- Categoría: Entorno de ejecución
- Uso: Runtime del servidor backend. Base para la ejecución de scripts de
  generación de datos y servicios de tickets.

CARD 2 — Express.js v4.18
- Categoría: Framework API REST
- Uso: Desarrollo de rutas para pagos y tickets: /api/payments, /api/tickets.
  Lógica de negocio para el flujo de pago y generación de entradas.

CARD 3 — MongoDB + Mongoose v8.0
- Categoría: Base de datos NoSQL + ODM
- Uso: Modelado de entidades Payment y Ticket. Implementación de la relación
  entre reserva, pago y ticket digital en la base de datos.

CARD 4 — nodemon v3.0
- Categoría: Herramienta de desarrollo
- Uso: Reinicio automático del servidor al detectar cambios en archivos
  durante el desarrollo (npm run dev). Agiliza el ciclo de desarrollo
  del módulo de pagos y tickets.

CARD 5 — dotenv v16.3
- Categoría: Configuración de entorno
- Uso: Carga de variables de entorno (MONGODB_URI, PORT) desde el archivo
  .env para separar configuración sensible del código fuente.

CARD 6 — Postman
- Categoría: Pruebas de API
- Uso: Prueba de los endpoints de pagos y tickets. Validación del flujo
  completo: reserva → pago → generación de ticket con QR.

CARD 7 — VS Code + GitHub
- Categoría: IDE y control de versiones
- Uso: Desarrollo del módulo de pagos y tickets. Versionado y push al
  repositorio central del proyecto.

Pie de diapositiva (recuadro azul claro):
"Flujo implementado: Reserva confirmada → Pago registrado →
Ticket digital generado → Vista del ticket en /my-ticket/[ticketId]."

---

### DIAPOSITIVA 6 — ALARCON CHAMBI ROY BRAYAN · Desarrollador Frontend

Título: "🎨 Alarcon Chambi Roy Brayan — Desarrollador Frontend"
Subtítulo: "Selección de asientos, flujo de reserva y experiencia del cliente en CinemaBook"
Color de acento: índigo (#311B92) · fondo de cards (#EDE7F6)

CARD 1 — Next.js 14 (App Router)
- Categoría: Framework principal
- Uso: Desarrollo de las páginas del flujo de reserva: selección de asientos
  /booking/[sessionId], confirmación /confirmation/[reservationId] y vista
  del ticket /my-ticket/[ticketId].

CARD 2 — React 18
- Categoría: Librería de UI
- Uso: Componentes interactivos para la selección visual de asientos con
  previsualización de calidad acústica/visual. Manejo de estado del mapa
  de asientos con hooks.

CARD 3 — TypeScript v5.3
- Categoría: Tipado estático
- Uso: Tipado de los componentes de selección de asientos y confirmación.
  Interfaces para los tipos Seat, Reservation y Session.

CARD 4 — Tailwind CSS v3.3
- Categoría: Framework de estilos
- Uso: Diseño visual del mapa de asientos con colores diferenciados por
  calidad (premium, estándar, básico). Estilos responsivos para el flujo
  de reserva.

CARD 5 — localStorage (Web API)
- Categoría: Persistencia en cliente
- Uso: Almacenamiento del estado de selección de asientos durante el flujo
  de reserva. Persistencia entre páginas sin necesidad de llamadas adicionales
  a la API.

CARD 6 — react-hot-toast v2.4
- Categoría: Notificaciones UI
- Uso: Feedback visual al usuario durante la selección de asientos (asiento
  ocupado, límite alcanzado) y en la confirmación de la reserva exitosa.

CARD 7 — VS Code + GitHub
- Categoría: IDE y control de versiones
- Uso: Desarrollo del módulo de selección de asientos. Versionado del código
  frontend y colaboración mediante el repositorio central.

Pie de diapositiva (recuadro lila claro):
"Flujo implementado: Catálogo → Selección de asientos con calidad preview →
Confirmación de reserva → Visualización del ticket QR."

---

### DIAPOSITIVA 7 — ROJAS CACERES LUIS DANIEL · Desarrollador Backend

Título: "⚙️ Rojas Caceres Luis Daniel — Desarrollador Backend"
Subtítulo: "Gestión de salas, asientos y rol de cajero en el sistema CinemaBook"
Color de acento: azul acero (#0D47A1) · fondo de cards (#E3F2FD)

CARD 1 — Node.js
- Categoría: Entorno de ejecución
- Uso: Runtime del servidor. Base para los módulos de gestión de salas,
  asientos y el sistema de punto de venta del cajero.

CARD 2 — Express.js v4.18
- Categoría: Framework API REST
- Uso: Desarrollo de rutas: /api/halls, /api/seats, /api/pos. Implementación
  del rol de cajero con acceso limitado mediante middleware de autorización.

CARD 3 — MongoDB + Mongoose v8.0
- Categoría: Base de datos NoSQL + ODM
- Uso: Modelado de entidades Hall y Seat. Lógica de generación automática
  de asientos por sala en seed.js (filas, columnas, calidad acústica/visual).

CARD 4 — JWT (jsonwebtoken v9.0)
- Categoría: Autenticación y roles
- Uso: Validación del token Bearer para rutas del cajero. Diferenciación
  de roles (admin, cajero, cliente) en el middleware de autorización.

CARD 5 — cors v2.8
- Categoría: Seguridad HTTP
- Uso: Configuración de solicitudes cross-origin para permitir que el
  frontend (puerto 5173) consuma la API del backend (puerto 3000).

CARD 6 — Postman
- Categoría: Pruebas de API
- Uso: Prueba de los endpoints de salas, asientos y punto de venta.
  Validación de la lógica de generación de asientos y acceso por rol.

CARD 7 — VS Code + GitHub
- Categoría: IDE y control de versiones
- Uso: Desarrollo del módulo de salas, asientos y cajero (HU-10, HU-11,
  HU-22). Commits al repositorio central del proyecto.

Pie de diapositiva (recuadro azul claro):
"Módulos implementados: gestión de salas (HU-10), configuración de asientos
con calidad acústica/visual (HU-11) y rol de cajero limitado (HU-22)."

---

### DIAPOSITIVA 8 — PABON VILLAFUERTE ROMAN TELESFORO · Desarrollador Frontend

Título: "🎨 Pabon Villafuerte Roman Telesforo — Desarrollador Frontend"
Subtítulo: "Panel de administración, snack bar y punto de venta en CinemaBook"
Color de acento: índigo (#311B92) · fondo de cards (#EDE7F6)

CARD 1 — Next.js 14 (App Router)
- Categoría: Framework principal
- Uso: Desarrollo de páginas del panel de administración: dashboard con
  métricas (HU-15, HU-16), gestión de snacks (HU-07, HU-19) y punto de
  venta del cajero /admin/pos.

CARD 2 — React 18
- Categoría: Librería de UI
- Uso: Componentes del dashboard (métricas, gráficas, resúmenes). Formularios
  de gestión de snacks y pantalla POS del cajero. Manejo de estado con hooks.

CARD 3 — TypeScript v5.3
- Categoría: Tipado estático
- Uso: Tipado de los componentes del panel admin y POS. Interfaces para
  SnackProduct, SnackCategory y SnackSale.

CARD 4 — Tailwind CSS v3.3
- Categoría: Framework de estilos
- Uso: Diseño del dashboard administrativo con cards de métricas, tablas
  de datos y la interfaz del punto de venta del cajero.

CARD 5 — Axios v1.6
- Categoría: Cliente HTTP
- Uso: Llamadas a /api/snacks, /api/pos y /api/me a través de lib/api.ts.
  Interceptor JWT para autenticación del administrador y cajero.

CARD 6 — react-hot-toast v2.4
- Categoría: Notificaciones UI
- Uso: Feedback visual en operaciones CRUD del administrador (crear/editar/
  eliminar productos snack) y confirmaciones de ventas en el POS.

CARD 7 — VS Code + GitHub
- Categoría: IDE y control de versiones
- Uso: Desarrollo del módulo de administración y snack bar. Versionado
  del código y push al repositorio central del proyecto.

Pie de diapositiva (recuadro lila claro):
"Módulos implementados: dashboard admin (HU-15, HU-16), snack bar (HU-07,
HU-19), precios en bolivianos (HU-23) y punto de venta del cajero."

---

Instrucciones de diseño globales para las 8 diapositivas:
- Fondo principal: blanco (#FFFFFF) o gris muy claro (#F8F9FA)
- Títulos principales: azul oscuro (#1A237E), Montserrat Bold 28px
- Subtítulos: azul medio (#1565C0), Montserrat Regular 16px
- Cuerpo de texto en cards: gris oscuro (#37474F), Roboto Regular 12px
- Nombre de herramienta en card: negrita del color de acento del rol
- Categoría en card: gris medio (#78909C), itálica, 11px
- Header de cada diapositiva: banda horizontal con el color de acento del
  rol en transparencia del 15%, con nombre completo y rol a la derecha
- Avatar placeholder circular en la esquina superior derecha con las
  iniciales de la persona, fondo del color de acento, texto blanco
- Cards: cuadrícula de 3-4 columnas, fondo blanco, borde izquierdo 4px
  del color de acento, sombra box-shadow suave, padding 12px
- Ícono de tecnología en cada card: esquina superior derecha, 24px
- Pie de diapositiva: recuadro con fondo muy claro del color de acento,
  borde sólido 1px del color de acento, texto 12px, padding 8px
- Resolución: 16:9 (widescreen)
- Cada diapositiva debe sentirse autónoma pero parte de una misma presentación
```

---

---

# Prompt para Gemini — Organigrama del Equipo CinemaBook

Copia y pega este prompt completo en Gemini:

---

```
Crea una diapositiva profesional de organigrama para el equipo de desarrollo del
proyecto "CinemaBook" (sistema de reserva de entradas de cine). La diapositiva
debe mostrar claramente la jerarquía y los roles del equipo Scrum.

Diseño visual: fondo blanco (#FFFFFF) o gris muy claro (#F8F9FA), títulos en
azul oscuro (#1A237E). Tipografía Montserrat (nombres y roles) y Roboto (detalles).
Resolución 16:9. Estilo ejecutivo/corporativo y limpio.

---

### ESTRUCTURA DEL ORGANIGRAMA

Título de la diapositiva: "👥 Equipo de Desarrollo — CinemaBook"
Subtítulo: "Proyecto SIS-226 · Metodología SCRUM · Sprint 0 — 22 HU completadas (122 SP)"

El organigrama tiene 3 niveles jerárquicos con líneas de conexión en azul oscuro
(#1A237E), flechas sólidas y esquinas redondeadas:

---

**NIVEL 1 — PRODUCT OWNER** (nodo superior, centrado)
Color del nodo: dorado oscuro (#F57F17) con texto blanco, borde dorado (#E65100)
Avatar circular con iniciales "TCA" sobre fondo dorado

Nodo:
┌─────────────────────────────────┐
│  🎯 PRODUCT OWNER               │
│  ─────────────────              │
│  Torrez Calle                   │
│  Alvaro                         │
│  ─────────────────              │
│  Jira · GitHub · Canva           │
└─────────────────────────────────┘

---

**NIVEL 2 — SCRUM MASTER** (nodo centrado debajo del PO, conectado con línea)
Color del nodo: verde oscuro (#1B5E20) con texto blanco, borde verde (#33691E)
Avatar circular con iniciales "QMA" sobre fondo verde

Nodo:
┌─────────────────────────────────┐
│  🗂️ SCRUM MASTER                │
│  ─────────────────              │
│  Quecaña Mamani                 │
│  Ariane Luz                     │
│  ─────────────────              │
│  Jira · GitHub · Canva           │
└─────────────────────────────────┘

---

**NIVEL 3 — EQUIPO DE DESARROLLO** (6 nodos en 2 filas de 3, conectados al Scrum Master)
Los nodos de Backend usan azul acero (#0D47A1), texto blanco, borde (#1565C0).
Los nodos de Frontend usan índigo (#311B92), texto blanco, borde (#4527A0).

Fila superior (3 desarrolladores):

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ ⚙️ BACKEND      │  │ 🎨 FRONTEND     │  │ ⚙️ BACKEND      │
│ ─────────────── │  │ ─────────────── │  │ ─────────────── │
│ Ramos Torrez    │  │ Rojas Valencia  │  │ Aguirre         │
│ Oziel Rodman    │  │ Dayana Gretel   │  │ Frederick       │
│ ─────────────── │  │ ─────────────── │  │ ─────────────── │
│ Node.js         │  │ Next.js 14      │  │ Node.js         │
│ Express.js      │  │ TypeScript      │  │ Express.js      │
│ MongoDB · JWT   │  │ Tailwind CSS    │  │ MongoDB · dotenv│
└─────────────────┘  └─────────────────┘  └─────────────────┘

Fila inferior (3 desarrolladores):

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 🎨 FRONTEND     │  │ ⚙️ BACKEND      │  │ 🎨 FRONTEND     │
│ ─────────────── │  │ ─────────────── │  │ ─────────────── │
│ Alarcon Chambi  │  │ Rojas Caceres   │  │ Pabon Villaf.   │
│ Roy Brayan      │  │ Luis Daniel     │  │ Roman Telesforo │
│ ─────────────── │  │ ─────────────── │  │ ─────────────── │
│ Next.js 14      │  │ Node.js         │  │ Next.js 14      │
│ React · Tailwind│  │ Express.js      │  │ React · Tailwind│
│ localStorage    │  │ MongoDB · JWT   │  │ Axios · POS     │
└─────────────────┘  └─────────────────┘  └─────────────────┘

---

### LEYENDA Y MÉTRICAS (banda inferior de la diapositiva)

Coloca una banda horizontal en la parte inferior con 3 secciones de color:

SECCIÓN 1 (fondo dorado claro #FFF8E1):
🎯 Product Owner — 1 integrante
Responsabilidad: Visión del producto y backlog

SECCIÓN 2 (fondo verde claro #F1F8E9):
🗂️ Scrum Master — 1 integrante
Responsabilidad: Coordinación y proceso ágil

SECCIÓN 3 (fondo azul/índigo claro, degradado):
👩‍💻 Equipo Dev — 6 integrantes
⚙️ Backend: 3 devs (Ramos, Aguirre, Rojas Caceres)
🎨 Frontend: 3 devs (Rojas Valencia, Alarcon, Pabon)

---

### MÉTRICAS DEL SPRINT (tarjetas flotantes en esquina superior derecha)

Coloca 3 pequeñas cards verticales apiladas con fondo azul muy claro (#E3F2FD)
y borde azul, texto compacto:

📋 Sprint 0 · 1 Sprint completado
✅ 22 / 28 HU finalizadas
⚡ 122 Story Points entregados

---

Instrucciones adicionales de diseño:
- Las líneas de conexión del organigrama deben ser rectas con codo (elbow connectors)
  en azul oscuro (#1A237E), grosor 2px
- Todos los nodos tienen esquinas redondeadas (border-radius 8px) y sombra suave
- Los avatares circulares con iniciales deben aparecer centrados encima del nombre
  en cada nodo, diámetro 40px
- El nodo del Scrum Master está conectado con línea discontinua al Product Owner
  (relación de coordinación, no de subordinación directa)
- Los 6 nodos de devs están conectados con líneas sólidas al Scrum Master
- Agrega una etiqueta flotante sobre las líneas de conexión: "coordina" (PO→SM)
  y "facilita" (SM→Devs)
- Resolución: 16:9 (widescreen)
- El diseño debe caber cómodamente en una sola diapositiva sin que se vea abarrotado
```

