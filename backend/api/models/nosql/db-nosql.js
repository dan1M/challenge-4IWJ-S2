const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB_NOSQL_HOST);
    console.log('database connected');
  } catch (err) {
    console.log(err);
  }
};
connection();

module.exports = connection;
