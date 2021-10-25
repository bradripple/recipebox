# RecipeBox

## Link to App

https://ripplesrecipebox.herokuapp.com/auth/login


Homepage
![Imgur](https://i.imgur.com/ic5Nlvc.png)

Recipe Browse list
![Imgur](https://i.imgur.com/9AOrD05.jpg)

Details page for a recipe
![Imgur](https://i.imgur.com/YQqUaaS.jpg)

Signup Page
![Imgur](https://i.imgur.com/3mOseUe.png)

## Concept and User Stories

Site concept: A place to find, store and create notes on your favorite recipes free of long drawn out blog posts and ads.

* User needs to be able to log in to create a favorites list. 
* User needs to be able to submit their recipes. 
* User needs to be able to browse a database of recipes. 
* User needs to be able to add recipes to and edit/delete from their favorites list. 
* User needs to be able to make notes on their favorites.

## Features

* Login Authentication
* Sessions to keep user logged in between pages
* Flash messages for login/logout errors and successes
* EJS Templating and EJS Layouts
* Models that interact with databases using Sequelize
* RESTful routing
* RecipeBox profile page that you can upload your favorite recipes to


## Models
![Imgur](https://i.imgur.com/t3EdKSO.png)

## Installation and Setup Instructions

* Create a new project in VSCode or fork and clone a project of your choosing
* Install node modules from the package.json
```
npm i
```
* Setup models using Sequelize

In terminal (either VSCode, iTerm, etc), type in the following:
```sequelize
sequelize init
```

Create sequelize database
```sequelize
sequelize db:create {nameOfYourProject}_development
```

Create models and migrations (replace user with name of model; firstName/lastName/age/email can be replaced with any other attributes )
```sequelize
sequelize model:create --name user --attributes firstName:string,lastName:string,age:integer,email:string
```

Run the migration
```sequelize
sequelize db:migrate
```

In your models folder, you can make associations between different models that you create. Create a new association under //define association here. Below is one example for the user model:
```javascript
 static associate(models) {
      // define association here
      models.user.hasMany(models.comments)
      models.user.hasMany(models.favoriteRecipes)
    }
```

In your main js file, require the necessary packages:
```javascript
require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const axios = require("axios");
const API_KEY = process.env.API_KEY;
const app = express();
const session = require("express-session");
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require("./config/ppConfig");
const flash = require("connect-flash");

// require authorization middleware at top of page
const isLoggedIn = require("./middleware/isLoggedIn");
const { response } = require('express');
const db = require('./models');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

app.use(session({
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}))

//initialize passport and run session as middleware
app.use(passport.initialize());
app.use(passport.session());
//flash for temporary messages to the user
app.use(flash());
```

## Routes
| Routes        | Route Methods Used    | Notes                                                | 
| ------------- | ----------------------| -----------------------------------------------------| 
| auth.js       | GET, POST             | controls signup/login and auth of user               |
| notes.js      | PUT, GET, DELETE      | create notes data on recipe details page             |
| recipe.js     | GET, POST, PUT, DELETE| add/delete recipes in your recipebox, submit recipes |


## Sprints
#### 1st sprint: ERD, Wireframing, and Planning : Tuesday - Wednesday

I spent the first 2 days planning the general layout and look of the app. I also made sure to have a basic understanding of the data I would be seeding my models with to be sure to include the correct keys and datatypes.

#### 2nd sprint: API data, Models, and Seeding : Wednesday - Friday

I needed to sort through the data from the API to make sure I was getting the information I wanted to include in my Model.

Creating my Models I ran into a couple blockers here, dealing with arrays as a datatype requires a little extra work. Consulting the Sequelize docs helped me find what needed to be modified to accept arrays as a datatype.


Code snippet - grabbing API data
```javascript
'use strict';
require('dotenv').config();
let axios = require("axios").default;
const RECIPE_API_KEY = process.env.RECIPE_API_KEY;

async function runThis() {
  let options = {
    method: 'GET',
    url: 'https://tasty.p.rapidapi.com/recipes/list',
    params: { from: '0', size: '1755', tags:'dinner' },
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
```

#### 3rd sprint: Routes - GET, POST, PUT, DELETE : Friday - Monday

Setting up routes to display the Recipe database, add Recipes to your RecipeBox, submit Recipes to your RecipeBox. Creating the views and controller files for RESTFUL routing. Here I also ran into a few complications when dealing with arrays. All of these blockers were great opportunities to work on my process for solving problems. Consulting the sequelize docs, google searching, refactoring code to try to get different errors/hints, and utilizing my fellow programmers and instructors for their insight. 

```javascript
router.put('/:id', isLoggedIn, async function (req, res) {
    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;
        const note = req.body.notes;

        const newNote = await Userfav.update(
            { 'notes': sequelize.fn('array_append', sequelize.col('notes'), note) },
            { 'where': { userId: id, recipeId } }
        );
        console.log('newNote:', newNote);

        res.redirect(`/recipe/detailsprofile/${recipeId}`);

    } catch (error) {
        console.log(error);
    }
})
```

#### 4th sprint: CSS, README, and final test : Saturday - Tuesday

Once I got the functionality of the app finished I started on the CSS. 
Changes made:
* I utilized the cards from the userapp codealong and modified them for my needs
* I created a rotating RecipeBox logo on the header
* Incorporated a new font
* I added a slideshow to the homepage with images of recipes
* Updated the color scheme and made all the buttons look uniform


## Here is the css and html for my rotating RecipeBox logo
```css
.wrap {
	perspective: 800px;
	perspective-origin: 50% 100px;
    margin-top: 3em;
    margin-left: 45%
}
.cube {
	position: relative;
	width: 200px;
	transform-style: preserve-3d;
}
.cube div {
	position: absolute;
	width: 200px;
	height: 200px;
}
.back {
	transform: translateZ(-100px) rotateY(180deg);
    border: 1px solid black;
}
.right {
    transform: rotateY(-270deg) translateX(100px);
	transform-origin: top right;
    border: 1px solid black;
}
.left {
    transform: rotateY(270deg) translateX(-100px);
	transform-origin: center left;
    border: 1px solid black;
}
.front {
    transform: translateZ(100px);
    border: 1px solid black;
    font-size: 25px;
}
@keyframes spin {
	from { transform: rotateY(0); }
	to { transform: rotateY(360deg); }
}
.cube {
	animation: spin 30s infinite linear;
}
```
```html
  <div class="wrap">
    <a href="/"><div class="cube">
      <div class="front"><img src="https://i.imgur.com/DsbgUML.jpg" alt="">RecipeBox</div>
      <div class="back"><img src="https://i.imgur.com/DsbgUML.jpg" alt=""></div>
      <div class="left"><img src="https://i.imgur.com/DsbgUML.jpg" alt=""></div>
      <div class="right"><img src="https://i.imgur.com/DsbgUML.jpg" alt=""></div>
    </div></a>
  </div>
```

## Conclusion
Building out this app was a lot of fun! Lots of technical and creative aspects to this project. It was a great opportunity to work on my process for solving problems and learning to ask the right questions. I learned a lot of new skills and got to incorporate some new CSS that was really exciting. I'm very grateful to my class mates and instructors for their help and advice. 


## Ideas to Implement
* Mobile optimization
* Search function
* Random Recipe generator
