import EmployeeModel, { IEmployee } from "../models/employee.model.ts";

// Principio de Responsabilidad Única (SRP) y Patrón Repository:
// Esta clase se encarga ÚNICAMENTE de la comunicación directa con la base de datos (MongoDB/Mongoose).
// El servicio no necesita saber detalles de Mongoose ni cómo se ejecutan las consultas.

export class EmployeeRepository {
  
  async create(employeeData: Partial<IEmployee>): Promise<IEmployee> {
    return await EmployeeModel.create(employeeData);
  }

  //fecha de creación descendente
  async findAll(): Promise<IEmployee[]> {
    return await EmployeeModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IEmployee | null> {
    return await EmployeeModel.findById(id);
  }
}

export const employeeRepository = new EmployeeRepository();