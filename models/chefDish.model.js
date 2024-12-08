let { DataTypes, sequelize } = require("./../lib/index");

let chefDish = sequelize.define("chefDish", {
  chefId: {
    type: DataTypes.INTEGER,
    references: {
      model: "chef",
      key: "id",
    },
  },
  dishId: {
    type: DataTypes.INTEGER,
    references: {
      model: "dish",
      key: "id",
    },
  },
});

chef.belongsToMany(dish, { through: chefDish });
dish.belongsToMany(chef, { through: chefDish });

module.exports = { chefDish };
