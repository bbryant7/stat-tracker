
const mongoose = require('mongoose');

const baileyStat = new mongoose.Schema({
        description: {type: String, required: true, unique: true},
        amount: Number
})

const stats = mongoose.model('bstats', baileyStat);

module.exports = stats;
