const Sequelize = require('sequelize');

const sequelize = new Sequelize('cs2', 'admin', 'cs2', {
  dialect: 'postgres',
  host: 'postgres'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;
