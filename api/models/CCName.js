const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/over9000f');
const ccnameSchema = mongoose.Schema({
    cc: String,
    name: String
});

module.exports = mongoose.model('CCName', ccnameSchema);
