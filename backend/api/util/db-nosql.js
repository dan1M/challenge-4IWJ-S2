const mongoose = require('mongoose');

mongoose
  .connect('mongodb://admin:cs2@mongodb:27017/cs2')
  .then(() => {
    console.log('database connected');
  })
  .catch(err => {
    console.log(err);
  });
