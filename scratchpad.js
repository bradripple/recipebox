let axios = require("axios").default;

async function createSeedFile() {
  let options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: { from: '0', size: '5', tags: 'dinner' },
    headers: {
      'x-rapidapi-host': 'tasty.p.rapidapi.com',
      'x-rapidapi-key': '9092927c70msh6cce79875d36059p18e631jsn7321df031c27'
    }
  };

  const seedArray = [];

  axios.request(options).then(function (response) {

    response.data.results.forEach(element => {

      if (element.instructions) {
        const ingredientArr = [];
        const instructionArr = [];
        const tagsArr = [];

        // console.log(element.sections);
        element.sections.map(element => {
          // console.log(element);
          element.components.map(component => {
            ingredientArr.push(component.raw_text);
          })
        });
        element.instructions.map(element => {
          instructionArr.push(element.display_text);
        });
        element.tags.map(element => {
          if (element.type === "meal") {
            tagsArr.push(element.display_name);
          }
        });
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
        // console.log('57', seedArray);
      }
      // console.log('59', seedArray);
      
    });
    console.log('seedArray:', seedArray);
    return seedArray;

  }).catch(function (error) {
    console.error(error);
  });
};



async function runThis() {
  let options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: { from: '0', size: '5', tags: 'dinner' },
    headers: {
      'x-rapidapi-host': 'tasty.p.rapidapi.com',
      'x-rapidapi-key': '9092927c70msh6cce79875d36059p18e631jsn7321df031c27'
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

// runThis()
// .then(seedArray => {
//   console.log(seedArray)
// })

createSeedFile().then(result => {
  console.log('result:', result);
})

async function runThis() {
  let options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: { from: '0', size: '5', tags: 'dinner' },
    headers: {
      'x-rapidapi-host': 'tasty.p.rapidapi.com',
      'x-rapidapi-key': '9092927c70msh6cce79875d36059p18e631jsn7321df031c27'
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