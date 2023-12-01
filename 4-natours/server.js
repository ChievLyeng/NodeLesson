
const mongoose = require('mongoose')
require('dotenv').config()


process.on('uncaughtException',err => {
  console.log("UNCAUGHT EXCEPTION!  ")
  console.log(err.name,err.message)
  process.exit(1)
})

// dotenv.config({ path: './config.env' });
// const port = process.env.PORT || 3000;

const app = require('./app');

mongoose.connect(process.env.DB,{
  useUnifiedTopology: true, useNewUrlParser: true
})
.then((con) => {
  console.log("Connected to Database!!!");
  // console.log(con);
})

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

// handle unhandleRejection error
process.on('unhandledRejection', err => {
  console.log(err.name,err.message)
  console.log("UNHANDLED REJECTION! Shutting down...")
  server.close(() => {
    process.exit(1)
  })
})


