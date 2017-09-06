
const mongoose = require('mongoose');

const baileyStat = new mongoose.Schema({
        description: {type: String, required: true, unique: true},
        stat: [{
          date: String,
          amount: Number
        }
      ]
})

const stats = mongoose.model('bstats', baileyStat);

module.exports = stats;
