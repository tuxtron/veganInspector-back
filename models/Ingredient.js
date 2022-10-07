const mongoose = require('mongoose');
const IngredientSchema = new mongoose.Schema({  
    name : String,
    apt_vegan : Boolean,
    apt_vegetarian : Boolean,
    verified : Boolean
});
module.exports = mongoose.model('Ingredient', IngredientSchema);
    