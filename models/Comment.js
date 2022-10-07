const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({  
    creationDate : Date,
    message : String,
    amountLike : Number,
    idProduct : Object, 
    idUser : Object,
    report : Array
});
module.exports = mongoose.model('Comment', CommentSchema);
    