const fs = require('fs');
const Tour = require('../../models/tourModel')
const mongoose = require('mongoose')
require('dotenv').config()

//connect to db
mongoose.connect(process.env.DB,{
  useUnifiedTopology: true, useNewUrlParser: true
})
.then((con) => {
  console.log("Connected to Database!!!");
  // console.log(con);
  
})
.catch((error) => {
  console.log("Failed to connect to the database!",error);
})

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//import data into db
const importData = async () => {
  try{
      await Tour.create(tours);
      console.log("Data successfully loaded!");
  }catch(err){
    console.log(err)
  }
}

// delete all data from collection
const deleteData = async () => {
  try{
    await Tour.deleteMany();
    console.log("Data successfully Deleted!");
  }catch(err){
    console.log(err)
  }
  process.exit();
}

if (process.argv[2] === '--import'){
  importData();
}
else if(process.argv[2] === '--delete'){
  deleteData();
}

// node dev-data/data/import-dev-data.js
// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete
console.log(process.argv);