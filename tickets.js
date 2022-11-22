const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const recipeSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  ingredients: String,
});

recipeSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
});
  
recipeSchema.set('toJSON', {
  virtuals: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.get('/api/recipes', async (req, res) => {
  try {
    let recipes = await Recipe.find();
    res.send({recipes: recipes});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/recipes', async (req, res) => {
    const recipe = new Recipe({
    name: req.body.name,
    quantity: parseInt(req.body.quantity),
    ingredients: req.body.ingredients
  });
  try {
    await recipe.save();
    res.send({recipe:recipe});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    await Recipe.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));