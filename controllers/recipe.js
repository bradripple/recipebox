const express = require('express');
const router = express.Router();
const fs = require('fs');
// const { not } = require('sequelize/types/lib/operators');
const isLoggedIn = require('../middleware/isLoggedIn');
const { Recipe, Userfav } = require('../models');


router.get('/new', isLoggedIn, function(req, res) {
    res.render('recipe/new');
});

router.get('/all-recipes', isLoggedIn, async (req, res) => {
    try {
        const allRecipes = await Recipe.findAll({}); // array
        // console.log(allRecipes);

        res.render('recipe/all-recipes', { recipes: allRecipes});
    } catch (err) {
        console.log(err);
    }
});

// 
router.get('/details/:idx', isLoggedIn, async (req, res) => {
    console.log(req.params.idx);
    try {
        const context = {};
        const favRec = await Userfav.findOne({
            where: { id: req.params.idx }
        })
        if (favRec.notes) {
            context.notes = favRec.notes;
        }

        const thisRecipe = await Recipe.findOne({
            where: { id: req.params.idx }
        }); // array
        // console.log(thisRecipe.to);
        context.recipe = thisRecipe;
        res.render('recipe/details', context);
    } catch (err) {
        console.log(err);
    }
});


// adding association
router.post('/:id', isLoggedIn, async function (req, res) {
    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;

        const addRecipe = await Userfav.create({ userId: id, recipeId })

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }

});


//  actually adding the new recipe
router.post('/', isLoggedIn, async function (req, res) {
    try {
        const { id } = req.user.get();
        const { name, img_url, description, yields, prepTime, cookTime, totalTime, ingredients, instructions, tags, servings } = req.body;

        const ingredientArr = [ingredients];
        const instructionArr = [instructions];
        const tagsArr = [tags];

        const createdRecipe = await Recipe.create({ name, img_url, description, yields, prepTime, cookTime, totalTime, ingredientArr, instructionArr, tagsArr, servings });

        console.log(createdRecipe);

        const addRecipe = await Userfav.create({ userId: id, recipeId: createdRecipe.id })

        res.redirect('/profile');

    } catch (error) {
        console.log(error);

    }

});

router.delete('/:idx', isLoggedIn, async function (req, res) {

    try {
        const { id } = req.user.get();
        const recipeId = req.params.idx;

        const favass = await Userfav.findOne({ 
            where:{ userId: id, recipeId } 
        });
        console.log('favass', favass);
        await favass.destroy();

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;