import { StatusCodes } from "http-status-codes";


function logError(err) {
  console.error(err);
}

function logErrorMiddleware(err, req, res, next) {
  logError(err);
  next(err);
}

function returnError(err, req, res, next) {
  return res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .send(err.message || 'INTERNAL SERVER ERROR');
}

function isOperationalError(error) {
  if (error instanceof BaseError) {
    return error.isOperational;
  }
  return false;
}

export {
    logError,
    logErrorMiddleware,
    returnError,
    isOperationalError,
};

