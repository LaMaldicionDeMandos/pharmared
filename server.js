var xnconfig = require('nodejsconfig');
var fs = require('fs');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
console.log('Scope: ' + process.env.NODE_ENV);

config = xnconfig.parse(process.env.NODE_ENV, data);
var bodyParser= require('body-parser');
var express = require('express');
var passport = require('passport');
var HashStrategy = require('passport-hash').Strategy;
var app = express();

var register=require('./routers/register');

passport.use(new HashStrategy(
    function(hash, done) {
      //TODO get user
//      db.users.findByToken(token, function(err, user) {
//        if (err) { return done(err); }
//        if (!user) { return done(null, false); }
        return done(null, {name: 'mockupUser'});
//      });
    }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/authenticate/:hash',
    passport.authenticate('hash', { failureRedirect: '/', session: false }),
    function(req, res) {
      res.send('User authenticated ' + JSON.stringify(req.user));
    });

app.get('/', function(req, res) {
  res.sendFile('index.html');
});
app.use("/register", register);

app.get('/errors', function(req, res) {
  res.sendFile(__dirname + '/public/error_popup.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


