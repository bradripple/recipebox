'use strict';
require('dotenv').config();
let axios = require("axios").default;
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;

async function runThis() {
  let options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: { from: '0', size: '1755', tags:'breakfast' },
    headers: {
      'x-rapidapi-host': 'tasty.p.rapidapi.com',
      'x-rapidapi-key': RECIPE_API_KEY
    }
  };
  let seedArray = [];
  let response = await axios.request(options);
  let { data } = response;
  let { results } = data;

  for (let i = 0; i < results.length; i++) {
    let element = results[i];

    if (element.instructions) {
      const ingredientArr = [];
      const instructionArr = [];
      const tagsArr = [];

      for (let j = 0; j < element.sections.length; j++) {
        let sections = element.sections[j];
        sections.components.forEach(c => {
          ingredientArr.push(c.raw_text);
        })
      }
      for (let k = 0; k < element.instructions.length; k++) {
        let instruct = element.instructions[k];
        instructionArr.push(instruct.display_text);
      }

      for (let l = 0; l < element.tags.length; l++) {
        let tag = element.tags[l];
        if (tag.type === "meal") {
          tagsArr.push(tag.display_name);
        }
      }
      const newObj = {
        name: element.name,
        description: element.description,
        img_url: element.thumbnail_url,
        yields: element.yields,
        prepTime: element.prep_time_minutes,
        cookTime: element.cook_time_minutes,
        totalTime: element.total_time_minutes,
        servings: element.num_servings,
        ingredients: ingredientArr,
        instructions: instructionArr,
        tags: tagsArr,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      seedArray.push(newObj);
    }
  }
  // console.log(seedArray);
  return seedArray;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let seedThis = await runThis();
    console.log('seedThis:', seedThis)
    await queryInterface.bulkInsert('Recipes', seedThis, {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Recipes', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
