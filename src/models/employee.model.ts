import { Schema, model, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  position: string;
  baseSalary: number;
  yearsOfService: number;
  finalSalary: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Principio de Responsabilidad Única (SRP):
// Esquema en Mongo Db de empleados
const employeeSchema = new Schema<IEmployee>(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    yearsOfService: { type: Number, required: true },
    finalSalary: { type: Number, required: true }
  },
  {
    timestamps: true // genera createdAt y updatedAt automaticamente
  }
);

export default model<IEmployee>("Employee", employeeSchema);
