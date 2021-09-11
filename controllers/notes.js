const express = require('express');
const router = express.Router();
const fs = require('fs');
const isLoggedIn = require('../middleware/isLoggedIn');
const sequelize = require('sequelize');
const { Recipe, Userfav } = require('../models');

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

        res.redirect(`/recipe/details/${recipeId}`);

    } catch (error) {
        console.log(error);
    }
})

router.post('/:id', isLoggedIn, async function(req, res) {
    try {
        const { id } = req.user.get();
    const recipeId = req.params.id;

    const addRecipe = await Userfav.create({ userId: id, recipeId})

    res.redirect('/profile');
    } catch (error) {
        console.log(error);
    }
    
});
module.exports = router;