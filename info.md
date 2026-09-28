



El proyecto está diseñado siguiendo una **arquitectura por capas** refinada con principios **SOLID** (principalmente *Single Responsibility Principle* e *Inversión de Dependencias*).

---

### 📁 Estructura General de `src/`

```text
src/
├── server.ts                       # Punto de entrada de la aplicación
├── servers/
│   └── server.ts                   # Archivo de inicio (o servidor modular)
├── routes/
│   └── employee.routes.ts          # Ruteador de Express (Endpoints HTTP)
├── controllers/
│   └── employee.controllers.ts     # Capa de Controladores (HTTP Request / Response)
├── services/
│   └── employee.service.ts         # Capa de Servicios (Reglas de negocio y validaciones)
├── repository/
│   └── employee.repository.ts      # Capa de Datos (Consultas a MongoDB con Mongoose)
├── models/
│   └── employee.model.ts           # Modelo de Mongoose e interfaz TypeScript
└── errorHandler/
    └── errorHandler.ts             # Middleware centralizado para manejo de errores
```

---

### 📄 Explicación Detallada por Capa / Archivo

#### 1. Punto de Entrada: [`src/server.ts` y [`src/servers/server.ts`]
- **Función:** Inicializa la aplicación de Express, habilita el middleware de JSON (`express.json()`), conecta la base de datos MongoDB vía `mongoose.connect(MONGO_URI)` y levanta el servidor HTTP en el puerto configurado (ej. `PORT=3000`).
- **Registra las rutas** (`app.use(employeeRoutes)`) y el **Manejador de Errores global** al final (`app.use(errorHandler)`).

---

#### 2. Capa de Rutas: [`src/routes/employee.routes.ts`]
- **Función:** Define los endpoints HTTP disponibles en la API:
  - `POST /employees` $\rightarrow$ Crear empleado.
  - `GET /employees` $\rightarrow$ Listar todos los empleados.
  - `GET /employees/:id` $\rightarrow$ Obtener un empleado por ID.
- **Inyección de Dependencias (DIP):** Aquí se ensamblan las piezas:
  ```ts
  const employeeRepository = new EmployeeRepository();
  const employeeService = new EmployeeService(employeeRepository);
  const employeeController = new EmployeeController(employeeService);
  ```

---

#### 3. Capa de Controladores: [`src/controllers/employee.controllers.ts`]
- **Responsabilidad (SRP):** Es la capa de **presentación HTTP**. Su única responsabilidad es recibir las peticiones (`req`), extraer datos (body o parámetros), delegar la lógica al **Servicio** y responder al cliente (`res.status(...).json(...)`).
- **Control de errores:** Si algo falla, atrapa la excepción en un `catch` y la transfiere al middleware con `next(error)`.

---

#### 4. Capa de Servicios: [`src/services/employee.service.ts`].
- **Funcionalidades:**
  1. **Validaciones de negocio:** Verifica que el nombre y puesto existan, que el sueldo base sea un número positivo y los años de antigüedad sean enteros $\ge 0$.
  2. **Cálculo de la regla de negocio:**
     $$\text{finalSalary} = \text{baseSalary} + (\text{baseSalary} \times 0.02 \times \text{yearsOfService})$$
  3. **Delegación de persistencia:** Llama a los métodos del `EmployeeRepository` para guardar o consultar información.

---

#### 5. Capa de Repositorio: [`src/repository/employee.repository.ts`]
- **Responsabilidad (SRP & Patrón Repository):** Aísla la interacción directa con **MongoDB/Mongoose**.
- **Ventaja:** El servicio no sabe ni le importa si usas MongoDB, PostgreSQL o una base de datos en memoria. Si mañana cambias de ORM o base de datos, solo modificas esta clase.
- **Métodos:** `create()`, `findAll()` (ordenado por fecha de creación descendente), y `findById()`.

---

#### 6. Capa de Modelo: [`src/models/employee.model.ts`]
- **Función:** Define el contrato de datos mediante TypeScript y Mongoose:
  - `IEmployee`: Interfaz con los tipos de campos (`name`, `position`, `baseSalary`, `yearsOfService`, `finalSalary`).
  - `employeeSchema`: Esquema Mongoose que mapea la colección en MongoDB con `timestamps: true` para generar automáticamente `createdAt` y `updatedAt`.

---

#### 7. Manejador de Errores: [`src/errorHandler/errorHandler.ts`
- **Función:** Middleware global de Express para atajar errores.
- Transforma excepciones no capturadas o lanzadas en el servicio (`throw new Error(...)`) en respuestas JSON limpias con el código HTTP correspondiente (`400 Bad Request` para errores de validación o `500 Internal Server Error`).

---

### 🔄 Flujo Completo de una Petición (`POST /employees`):

1. **Cliente / Postman** envía una petición `POST` a `/employees`.
2. **`employee.routes.ts`** recibe la petición y la deriva a `employeeController.createEmployee`.
3. **`employee.controllers.ts`** extrae los campos del body y llama a `employeeService.createEmployee(...)`.
4. **`employee.service.ts`** valida los datos y calcula `finalSalary`.
5. **`employee.repository.ts`** ejecuta `EmployeeModel.create(...)` en MongoDB.
6. **MongoDB** guarda el documento y retorna el empleado creado.
7. El flujo retorna hacia el controlador, que devuelve `status(201).json(nuevoEmpleado)`.