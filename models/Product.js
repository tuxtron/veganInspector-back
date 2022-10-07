const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({  
    name : String,
    brand : String,
    barcode : Number,
    imagePackage : String,
    ingredients : Array,
    comments : Array,
    error : Object,
    category : Object,
    observations : Object,
    imageIngredients : String,
    imageBarcode : String,
    verified : Boolean,
    reports : [{
        userId: Object,
        observations: String,
        verified : Boolean,
    }]
});
module.exports = mongoose.model('Product', ProductSchema);
    