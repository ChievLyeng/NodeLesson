const mongoose = require('mongoose');
require('dotenv').config()

const app = require('./app');

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((error) => {
    console.error('DB connection error:', error);
  });


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
