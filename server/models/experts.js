const mongoose = require('mongoose');

const expertsSchema = mongoose.Schema({
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  slug: { type: String, default: '' },
  color: { type: String, default: '' },
  subcategory: {
    id: { type: String, default: '' },
    name: { type: String, default: '' }
  }
});

module.exports = mongoose.model('experts', expertsSchema);
