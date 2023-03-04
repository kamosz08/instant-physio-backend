import { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const { statusCode = 500, message } = err
  console.error(err)

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}
