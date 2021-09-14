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

router.get('/edit/:id', isLoggedIn, async function(req, res) {
    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;
        
        const notes = await Userfav.findOne({ 
            where:{ userId: id, recipeId } 
        });
        const parsedNotes = notes.toJSON();
        const note = parsedNotes.notes;
        // console.log('noooteesss', note);
        const thisRecipe = await Recipe.findOne({
            where: { id: req.params.id }
        });
        
        res.render('recipe/edit', { notes: note, recipe: thisRecipe });
    } catch (error) {
        
    }
});

router.delete('/:id/:idx', isLoggedIn, async function (req, res) {

    try {
        const { id } = req.user.get();
        const recipeId = req.params.id;
        const arrIdx = req.params.idx;
        console.log('arridx', arrIdx);

        const recipe = await Userfav.findOne({ 
            where:{ userId: id, recipeId } 
        });

        const note = recipe.dataValues.notes;
        console.log('The array of notes', note);
        note.splice(arrIdx, 1);
        console.log('splicednote:', note);

        const number = await Userfav.update({
            notes: note
        }, {
            where:{ userId: id, recipeId } 
        });

        res.redirect(`/notes/edit/${recipeId}`);
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;