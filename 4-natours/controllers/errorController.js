const AppError = require('./../Utils/appError');
const dotenv = require('dotenv')
dotenv.config()
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0] // here is the simplet string to get the array of key
  // console.log(value)

  const message = `Duplicate field value: x. Please use another value!`;
  return new AppError(message,400)
};


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  console.log(err.isOperational)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log("err  :",err)
    let error = {...err}
    

    if (err.name === 'CastError') err = handleCastErrorDB(err);
    
    if ( err.code === 11000) err = handleDuplicateFieldsDB(err); 
    
    sendErrorProd(err, res);
  }
};