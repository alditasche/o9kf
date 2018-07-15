const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/over9000f');

const countrySchema = mongoose.Schema({
    cc: String,
    land: String,
    water: String
});

module.exports = mongoose.model('Country', countrySchema);

