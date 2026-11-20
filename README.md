# Práctica SOLID - Empleados y Salarios

API de empleados refactorizada a partir de un servidor monolítico (`src/servers/server-old.ts`), aplicando una separación clara de responsabilidades.

## Estructura

```
src/
├── controllers/   manejo de request/response
├── routes/        definición de endpoints e inyección de dependencias
├── services/      validaciones y regla de negocio
├── repository/    acceso a datos con Mongoose
├── models/        esquema de MongoDB
├── errorHandler/  errores tipados y middleware centralizado de errores
└── servers/       arranque del servidor
```

## Regla de negocio

El salario final se calcula así:

**salario final = salario base + 2% del salario base por cada año de antigüedad**

Ejemplo:

- Salario base: 1.000.000
- Antigüedad: 5 años
- Adicional: 10%
- Salario final: 1.100.000

## Endpoints

- POST /employees
- GET /employees
- GET /employees/:id

## Cambios realizados

- Separación del servidor original en capas: controller, service, repository y model.
- Inyección de dependencias por constructor (repository → service → controller).
- Manejo de errores centralizado: los errores de validación usan `ValidationError` (400) y cualquier error inesperado responde 500 con un mensaje genérico.
- Se mantiene el comportamiento observable de la API original (respuestas, códigos de estado y mensajes).
- Se agregó `.env.example` y `.env` dejó de versionarse.

## Cómo ejecutar

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```
