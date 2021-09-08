let axios = require("axios").default;

let options = {
  method: 'GET',
  url: 'https://tasty.p.rapidapi.com/recipes/list',
  params: {from: '0', size: '20', tags: 'dinner'},
  headers: {
    'x-rapidapi-host': 'tasty.p.rapidapi.com',
    'x-rapidapi-key': '9092927c70msh6cce79875d36059p18e631jsn7321df031c27'
  }
};

axios.request(options).then(function (response) {

  const seedArray = [];


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
            if(element.type === "meal") {
                tagsArr.push(element.display_name);
            }
        });
      // logic here for slapping that stuff into your database
      const newObj = {
        // put all the stuff you need into this object
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
        tags: tagsArr
      };
  
      seedArray.push(newObj);
      
    }
    console.log(seedArray);

  });

}).catch(function (error) {
	console.error(error);
});