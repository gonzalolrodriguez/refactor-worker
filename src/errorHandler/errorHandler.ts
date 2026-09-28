import { Request, Response, NextFunction } from "express";

// Middleware global para manejo centralizado de errores (SRP)
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // Si el error tiene un mensaje personalizado de validación/negocio
  const message = err.message || "Error interno del servidor";
  const statusCode = err.statusCode || (message.includes("obligatorios") || message.includes("debe ser") ? 400 : 500);

  return res.status(statusCode).json({ message });
};
