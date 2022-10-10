'use strict';

require('dotenv').config({ path: './variables.env' });
const connectToDatabase = require('./db');
const Product = require('./models/Product');
const Ingredient = require('./models/Ingredient');
const User = require('./models/User');
const Comment = require('./models/Comment');

module.exports.createProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Product.create(JSON.parse(event.body))
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.getOneProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Product.findById(event.pathParameters.id)
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.getOneProductValue = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("keyword = " + event.queryStringParameters.keyword )
  console.log("category = " + event.queryStringParameters.category )
  console.log("barcode = " + event.queryStringParameters.barcode )

  var value = {}
  var cadena 
  var busqueda
  if (event.queryStringParameters.keyword != undefined){
    cadena = "'"+"(.*)"+event.queryStringParameters.keyword+"(.*)"+"'"
    busqueda = cadena.replace(/['"]+/g, '')
    value = { name : {$regex: busqueda , $options: '-i'} }
    console.log("value = " + JSON.stringify(value) )
  }
  else if (event.queryStringParameters.category != undefined ){
    value = {category: event.queryStringParameters.category }
    console.log("value = " + JSON.stringify(value) )
  }
  else if (event.queryStringParameters.barcode != undefined ) {
    value = {barcode: Number(event.queryStringParameters.barcode) }
    console.log("value = " + JSON.stringify(value) )
  }
  else{
    callback(null, {
      statusCode: 502,
      body: JSON.stringify({
          message: 'unrequited value',
      }),
  })}

  connectToDatabase()
  .then(() => {
    Product.find(value)
      .then(product => callback(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product)
      }))
      .catch(err => callback(null, {
        statusCode: err.statusCode || 500,
        body: 'Could not fetch the product.'
      }));
    });
  };

module.exports.getAllProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Product.find()
        .then(products => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(products)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }))
    });
};

module.exports.updateProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndRemove(event.pathParameters.id)
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Removed product with id: ' + product._id, product: product })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.createReportProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{$push: { 'reports' : JSON.parse(event.body) }}, { new: true })
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteReportProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{$pull: { 'reports' : JSON.parse(event.body) }}, { new: true })

//*      Product.findByIdAndUpdate(event.pathParameters.id, {$pull : { reports : { $elemMatch : { _id : event.idReport}} }}) //
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.updateReportProduct = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{'report' : {'_id' : event._id}}, {'$set': {
        "reports.$.verified": event.verified
        }})
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};


module.exports.createIngredient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Ingredient.create(JSON.parse(event.body))
        .then(ingredient => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(ingredient)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};
module.exports.getOneIngredient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Ingredient.findById(event.pathParameters.id)
        .then(ingredient => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(ingredient)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.getAllIngredient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Ingredient.find()
        .then(ingredients => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(ingredients)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }))
    });
};

module.exports.updatIngredient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Ingredient.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(ingredient => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(ingredient)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteIngredient = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Ingredient.findByIdAndRemove(event.pathParameters.id)
        .then(ingredient => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Removed ingredient with id: ' + ingredient._id, ingredient: ingredient })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};
module.exports.createUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      User.create(JSON.parse(event.body))
        .then(user => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};
module.exports.getOneUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      User.findById(event.pathParameters.id)
        .then(user => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.getAllUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      User.find()
        .then(users => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(users)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }))
    });
};

module.exports.updatUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      User.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(user => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(user)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteUser = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      User.findByIdAndRemove(event.pathParameters.id)
        .then(user => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Removed User with id: ' + user._id, user: user })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.createComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Comment.create(JSON.parse(event.body))
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comment)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};
module.exports.getOneComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Comment.findById(event.pathParameters.id)
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comment)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.getAllComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Comment.find()
        .then(comments => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comments)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
            headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }))
    });
};

module.exports.updatComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Comment.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comment)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  connectToDatabase()
    .then(() => {
      Comment.findByIdAndRemove(event.pathParameters.id)
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ message: 'Removed Comment with id: ' + comment._id, comment: comment })
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.increaseComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Comment.findByIdAndUpdate(event.pathParameters.id, {$inc : {amountLike:1}}, { new: true })
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comment)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.decreaseComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Comment.findByIdAndUpdate(event.pathParameters.id, {$inc : {amountLike: -1}}, { new: true })
        .then(comment => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(comment)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.createReportComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{$push: { 'reports' : JSON.parse(event.body) }}, { new: true })
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.deleteReportComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{$pull: { 'reports' : JSON.parse(event.body) }}, { new: true })

//*      Product.findByIdAndUpdate(event.pathParameters.id, {$pull : { reports : { $elemMatch : { _id : event.idReport}} }}) //
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

module.exports.updateReportComment = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  connectToDatabase()
    .then(() => {
      Product.findByIdAndUpdate(event.pathParameters.id,{'report' : {'_id' : event._id}}, {'$set': {
        "reports.$.verified": event.verified
        }})
        .then(product => callback(null, {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(product)
        }))
        .catch(err => callback(null, {
          statusCode: err.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: 'Could not fetch the product.'
        }));
    });
};

