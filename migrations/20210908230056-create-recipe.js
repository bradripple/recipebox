'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      img_url: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING(1234)
      },
      yields: {
        type: Sequelize.STRING
      },
      prepTime: {
        type: Sequelize.INTEGER
      },
      cookTime: {
        type: Sequelize.INTEGER
      },
      totalTime: {
        type: Sequelize.INTEGER
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      instructions: {
        type: Sequelize.ARRAY(Sequelize.STRING(1234))
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      servings: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Recipes');
  }
};