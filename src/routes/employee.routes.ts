import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controllers.ts";
import { EmployeeService } from "../services/employee.service.ts";
import { EmployeeRepository } from "../repository/employee.repository.ts";

// Instanciación e inyección de dependencias
const employeeRepository = new EmployeeRepository();
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

const router = Router();

// Definición de endpoints requeridos por el README
router.post("/employees", employeeController.createEmployee);
router.get("/employees", employeeController.getEmployees);
router.get("/employees/:id", employeeController.getEmployeeById);

export default router;