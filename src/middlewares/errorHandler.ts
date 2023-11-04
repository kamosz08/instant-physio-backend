import { ErrorRequestHandler } from 'express'

export class ErrorWithStatus extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const { statusCode = 500, message = 'Unknown error' } = err
  console.error(err)

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}
