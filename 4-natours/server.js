
const mongoose = require('mongoose')
require('dotenv').config()
const app = require('./app');



// dotenv.config({ path: './config.env' });
// const port = process.env.PORT || 3000;


mongoose.connect(process.env.DB,{
  useUnifiedTopology: true, useNewUrlParser: true
})
.then((con) => {
  console.log("Connected to Database!!!");
  // console.log(con);

  app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}...`);
  });
  
})
.catch((error) => {
  console.log("Failed to connect to the database!",error);
})

