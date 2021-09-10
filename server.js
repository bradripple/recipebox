require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const { User, Recipe } = require('./models');

const SECRET_SESSION = process.env.SECRET_SESSION;
console.log(SECRET_SESSION);

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));
app.use(flash());            // flash middleware

app.use(passport.initialize());      // Initialize passport
app.use(passport.session());         // Add a session

app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {

  res.render('index');
});

// Add this above /auth controllers
app.get('/profile', isLoggedIn, async (req, res) => {
  const { id, name, email } = req.user.get(); 

  const currentUser = await User.findOne({
    where: { id: id },
    include: [Recipe]
});
const parsedUser = currentUser.toJSON();

console.log('currentUser', parsedUser.Recipes);

const parsedRecipes = parsedUser.Recipes.map(recipe => {
  return recipe.toJSON();
})

  res.render('profile', { id, name, email, recipes: parsedRecipes });
});

app.use('/auth', require('./controllers/auth'));
app.use('/recipe', require('./controllers/recipe'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
