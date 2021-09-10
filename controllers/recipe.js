const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Recipe, Userfav } = require('../models');


router.get('/new', function(req, res) {
    res.render('recipe/new');
});

router.get('/all-recipes', async (req, res) => {
    try {
        const allRecipes = await Recipe.findAll({}); // array
        // console.log(allRecipes);

        res.render('recipe/all-recipes', { recipes: allRecipes});
    } catch (err) {
        console.log(err);
    }
});

router.get('/details/:idx', async (req, res) => {
    console.log(req.params.idx);
    try {
        const thisRecipe = await Recipe.findOne({
            where: { id: req.params.idx }
        }); // array
        // console.log(thisRecipe.to);

        res.render('recipe/details', { recipe: thisRecipe});
    } catch (err) {
        console.log(err);
    }
});


// adding association
router.post('/:id', async function(req, res) {
    const { id } = req.user.get();
    const recipeId = req.params.id;

    // console.log('req', req.body);
    // let recipeId = req.body.addrecipe;
    const addRecipe = await Userfav.create({ userId: id, recipeId})

    // fs.writeFileSync('./user-favs.json', JSON.stringify(cars));

    res.redirect('/profile');
});


//  actually adding the new recipe
router.post('/', async function(req, res) {
    try {
        const { id } = req.user.get();
    const {name, img_url, description, yields, prepTime, cookTime, totalTime, ingredients, instructions, tags, servings} = req.body;

    const ingredientArr = [ingredients];
    const instructionArr = [instructions];
    const tagsArr = [tags];

    const createdRecipe = await Recipe.create({name, img_url, description, yields, prepTime, cookTime, totalTime, ingredientArr, instructionArr, tagsArr, servings});

    console.log(createdRecipe);

    const addRecipe = await Userfav.create({ userId: id, recipeId: createdRecipe.id})

    // console.log('req', req.body);
    // let recipeId = req.body.addrecipe;
    // const addRecipe = await Userfav.create({ userId: id, recipeId})

    // fs.writeFileSync('./user-favs.json', JSON.stringify(cars));

    res.redirect('/profile');
        
    } catch (error) {
        console.log(error);
        
    }
   
});

module.exports = router;