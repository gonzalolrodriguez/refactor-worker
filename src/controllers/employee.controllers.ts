import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "../services/employee.service.ts";

// Principio de Inversión de Dependencias (DIP):

// El controlador recibe el servicio por parámetro en el constructor en lugar de instanciarlo con 'new'

export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  // POST de employees
  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, position, baseSalary, yearsOfService } = req.body;

      // se delega la lógica de creación y cálculo al Servicio 
      // se cumple el principio de responsabilidad unica
      
      const newEmployee = await this.employeeService.createEmployee({
        name,
        position,
        baseSalary,
        yearsOfService
      });

      return res.status(201).json(newEmployee);
    } catch (error) {
      next(error); // pasa el error al errorHandler
    }
  };

  // GET de employees
  getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      return res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };

  // GET de un employee por id
  getEmployeeById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const employee = await this.employeeService.getEmployeeById(id);

      if (!employee) {
        return res.status(404).json({ message: "Empleado no encontrado" });
      }

      return res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };
}
