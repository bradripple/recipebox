const express = require('express');
const router = express.Router();
const fs = require('fs');
const sequelize = require('sequelize');
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


router.get('/detailsprofile/:idx', isLoggedIn, async (req, res) => {
    console.log(req.params.idx);
    try {
        const context = {};
        const { id } = req.user.get();
        const defaultNote = ['Notes:']
        const favRec = await Userfav.findOne({
            where: { recipeId: req.params.idx, userId: id  }
        })
        if (favRec.notes) {
            context.notes = favRec.notes;
        } else {}

        const thisRecipe = await Recipe.findOne({
            where: { id: req.params.idx }
        }); // array
        // console.log(thisRecipe.to);
        context.recipe = thisRecipe;
        res.render('recipe/detailsprofile', context);
    } catch (err) {
        console.log(err);
    }
});

// adding association
router.post('/:id', isLoggedIn, async function (req, res) {
    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;
        const newNote = ['Notes:'];

        const addRecipe = await Userfav.create({ userId: id, recipeId, notes: newNote });

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }

});


//  actually adding the new recipe - add note here
router.post('/', isLoggedIn, async function (req, res) {
    try {
        const { id } = req.user.get();
        const { name, img_url, description, yields, prepTime, cookTime, totalTime, ingredients, instructions, tags, servings } = req.body;
        const ingredientArr = ingredients.split(',');
        const instructionArr = instructions.split('.');
        const tagsArr = tags.split(',');
        const defaultNote = ['Notes:']

        const createdRecipe = await Recipe.create({ name, img_url, description, yields, prepTime, cookTime, totalTime, ingredients: ingredientArr, instructions: instructionArr, tags: tagsArr, servings });

        const addRecipe = await Userfav.create({ userId: id, recipeId: createdRecipe.id, notes: defaultNote });

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
        // console.log('favass', favass);
        await favass.destroy();

        res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }

});
router.get('/deleterecipes', isLoggedIn, async (req, res) => {
    try {
        const allRecipes = await Recipe.findAll({}); // array
        // console.log(allRecipes);

        res.render('recipe/deleterecipes', { recipes: allRecipes});
    } catch (err) {
        console.log(err);
    }
});

router.delete('/delete/:idx', isLoggedIn, async function (req, res) {

    try {
        const recipeId = req.params.idx;
        console.log('recipeId', recipeId);

        const favass = await Recipe.destroy({ 
            where:{ id: recipeId } 
        });
        console.log('favass', favass);
        // await favass.destroy();

        res.redirect('/recipe/deleterecipes');
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;