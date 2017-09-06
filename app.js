const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/baileystatdb');
const express = require('express');
const bodyParser = require('body-parser');
const bStat = require('./models/stat.js');
// const bcrypt = require('bcryptjs');
// const hash = bcrypt.hashSync(password, 8);
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
// const ObjectId = require('mongodb').ObjectID;
const app = express();

app.use(bodyParser.json())

const users = {
    'kitty': 'unicorn'
};

passport.use(new BasicStrategy(
  function(username, password, done) {
      const userPassword = users[username];
      if (!userPassword) { return done(null, false); }
      if (userPassword !== password) { return done(null, false); }
      return done(null, username);
  }
));

app.get('/api/hello',
    passport.authenticate('basic', {session: false}),
    function (req, res) {
        res.json({"hello": req.user, status: "success"})
    }
);

// get list of vending machine inventory
app.get('/api/activities',function(req, res){
  bStat.find().then(function(results){
    res.json({stat: results})
  })
})

// add new item to vending machine
app.post("/api/activities", function(req, res) {


  const newStat = new bStat({
    description: req.body.description,
    amount: req.body.amount,

  })

  newStat.save().then(function(){
    res.json({status: "success"})
  })
});

//Purchase item (update item quantity to 1 less)
app.post("/api/activities/:id", function(req, res) {
  bStat.findOneAndUpdate({_id:req.query.id},{$set:{amount:100}})
  .then(function(results){
    res.json({status: "success"})
  })
});



app.listen(3000, function() {
  console.log('Successfully started express application!');
})


process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
