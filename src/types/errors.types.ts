export abstract class AppError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}
export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403)
  }
}
