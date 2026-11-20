// Base class for expected (business/validation) errors carrying an HTTP status
export class AppError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
