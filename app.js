const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/baileystatdb');
const express = require('express');
const bodyParser = require('body-parser');
const bStat = require('./models/stat.js');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
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
// basic authentication
app.get('/api/hello',
    passport.authenticate('basic', {session: false}),
    function (req, res) {
        res.json({"hello": req.user, status: "success"})
    }
);

// get list of activities
app.get('/api/activities',function(req, res){
  bStat.find().then(function(results){
    res.json({stat: results})
  })
})

// create new activity
app.post("/api/activities", function(req, res) {
  const newStat = new bStat({
    description: req.body.description,
    stat: []
  })

  newStat.save().then(function(){
    res.json({status: "success"})
  })
});


// add a stat
app.put("/api/activities/:id", function(req, res) {
    bStat.updateOne({task:req.params.task}, {$push: {stat: req.body}})
      .then(function(results){
        res.json({status: 'success', stat: results})
      })
      .catch(function(error){
        console.log(error);
      })
});

// delete a activity
app.delete("/api/stats/:id", function(req, res) {
  console.log('you be here?');

  bStat.deleteOne({
      task: req.params.task
    })
    .then(function(results) {
      res.json({
        status: 'success',
        stat: results
      })
    })
  console.log('coleslaw');
})



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
