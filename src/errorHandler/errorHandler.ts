import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError.ts";

// Middleware global para manejo centralizado de errores (SRP)
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Errores esperados de negocio/validación: se responden con su status y mensaje
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Errores de cliente propios de Express (ej: JSON mal formado): se mantiene el
  // comportamiento por defecto de Express, igual que en el servidor original
  if (typeof err?.status === "number" && err.status < 500) {
    return next(err);
  }

  // Cualquier otro error: no se exponen detalles internos
  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor" });
};
