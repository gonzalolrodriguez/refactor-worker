import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import employeeRoutes from "../routes/employee.routes.ts";
import { errorHandler } from "../errorHandler/errorHandler.ts";

const app = express();
app.use(express.json());

// Registro de rutas
app.use(employeeRoutes);

// Middleware centralizado de errores (debe ir después de las rutas)
app.use(errorHandler);

const PORT = Number(process.env.PORT ?? 3000);
const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/employees_db";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado exitosamente");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  });
