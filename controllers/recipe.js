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
        const ingredientArr = [ingredients];
        const instructionArr = [instructions];
        const tagsArr = [tags];

        const createdRecipe = await Recipe.create({ name, img_url, description, yields, prepTime, cookTime, totalTime, ingredientArr, instructionArr, tagsArr, servings });

        const addRecipe = await Userfav.create({ userId: id, recipeId: createdRecipe.id });

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