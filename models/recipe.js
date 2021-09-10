'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Recipe.belongsToMany(models.User, { through: 'Userfav', foreignKey: 'recipeId'});
    }
  };
  Recipe.init({
    name: DataTypes.STRING,
    img_url: DataTypes.STRING,
    description: DataTypes.STRING(1234),
    yields: DataTypes.STRING,
    prepTime: DataTypes.INTEGER,
    cookTime: DataTypes.INTEGER,
    totalTime: DataTypes.INTEGER,
    ingredients: DataTypes.ARRAY(DataTypes.STRING),
    instructions: DataTypes.ARRAY(DataTypes.STRING(1234)),
    tags: DataTypes.ARRAY(DataTypes.STRING),
    servings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};