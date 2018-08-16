var mongoose      = require('mongoose');
var expertssubcategoriesSchema = mongoose.Schema({
    id          : {type: String, default: ''},
    name 	: {type: String, default: ''},
    slug 	: {type: String, default: ''},
    color 	: {type: String, default: ''},
    experts : {
        id          : {type: String, default: ''},
        name        : {type: String, default: ''},
        slug        : {type: String, default: ''},
        rating      : {type: String, default: ''},
        expertise   : {type: Array, default: [] },
        apps        : {type: Array, default: [] },
        rates       : {type: Array, default: [] }
    }
});
// create the model for brands and expose it to our app
module.exports = mongoose.model('expertssubcategories', expertssubcategoriesSchema);
