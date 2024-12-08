let { DataTypes, sequelize } = require('./../lib/index');

let dish = sequelize.define('dish', {
  name: DataTypes.STRING,
  cuisine: DataTypes.STRING,
  preparationTime: DataTypes.INTEGER,
});

module.exports = { dish };
