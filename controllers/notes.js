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

        res.redirect(`/recipe/detailsprofile/${recipeId}`);

    } catch (error) {
        console.log(error);
    }
})

router.delete('/:id', isLoggedIn, async function (req, res) {

    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;

        const recipe = await Userfav.findOne({ 
            where:{ userId: id, recipeId } 
        });
        // const noteIdx = recipe.dataValues.notes;
        // noteIdx.pop();
        const note = recipe.dataValues.notes.splice();
        const newNote = await Userfav.update(
            { 'notes':sequelize.fn('array_remove', sequelize.col('notes'),JSON.stringify(note)) },
            // { 'notes': sequelize.fn('array_append', sequelize.col('notes'), recipe.dataValues.notes.splice()) },
            { 'where': { userId: id, recipeId } }
        );
        console.log('favass', newNote);
        // await noteIdx.save();
        // await .destroy();

        res.redirect(`/recipe/detailsprofile/${recipeId}`);
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;