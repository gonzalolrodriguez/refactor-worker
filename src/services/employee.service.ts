import { EmployeeRepository } from "../repository/employee.repository.ts";
import { IEmployee } from "../models/employee.model.ts";
import { ValidationError } from "../errorHandler/appError.ts";


//  Data Transfer Object para los datos necesarios al crear empleado
export interface CreateEmployeeDTO {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
}


// Principio de Inversión de Dependencias (DIP):
// El servicio recibe el repositorio por parámetro en el constructor en lugar de instanciarlo con 'new'

export class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async createEmployee(data: CreateEmployeeDTO): Promise<IEmployee> {
    const { name, position, baseSalary, yearsOfService } = data;

    if (!name || !position) {
      throw new ValidationError("Nombre y puesto son obligatorios");
    }

    if (typeof baseSalary !== "number" || baseSalary <= 0) {
      throw new ValidationError("El salario base debe ser mayor a 0");
    }

    if (
      typeof yearsOfService !== "number" ||
      yearsOfService < 0 ||
      !Number.isInteger(yearsOfService)
    ) {
      throw new ValidationError("La antigüedad debe ser un entero mayor o igual a 0");
    }

    // salario final = salario base + 2% del salario base por cada año de antigüedad
    const bonus = baseSalary * 0.02 * yearsOfService;
    const finalSalary = baseSalary + bonus;

    //Delega la persistencia al repository (SRP)
    const employee = await this.employeeRepository.create({
      name,
      position,
      baseSalary,
      yearsOfService,
      finalSalary
    });

    console.log(`Empleado creado: ${employee.name} - salario final: ${employee.finalSalary}`);
    return employee;
  }

  async getAllEmployees(): Promise<IEmployee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string): Promise<IEmployee | null> {
    return await this.employeeRepository.findById(id);
  }
}

