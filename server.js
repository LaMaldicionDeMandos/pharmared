var xnconfig = require('nodejsconfig');
var fs = require('fs');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
console.log('Scope: ' + process.env.NODE_ENV);

config = xnconfig.parse(process.env.NODE_ENV, data);
var bodyParser= require('body-parser');
var express = require('express');
var passport = require('passport');
var HashStrategy = require('passport-hash').Strategy;
var request = require('request');
var app = express();

var register=require('./routers/register');

passport.use(new HashStrategy(
    function(hash, done) {
        request(config.user_url + '?accessToken=' + hash, function (error, res, body) {
            if (error) {
                done(error);
            }
            if (res.statusCode != 200) {
                done(new Error('bar request'));
            }
            done(null, body);
        });
    }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/authenticate/:hash',
    passport.authenticate('hash', { failureRedirect: '/', session: false }),
    function(req, res) {
      res.redirect('http://www.google.com');
    });

app.get('/', ensureAuthenticated, function(req, res) {
  res.sendFile(__dirname + '/public/landing.html');
});
app.use("/register", register);

app.get('/errors', function(req, res) {
  res.sendFile(__dirname + '/public/error_popup.html');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("User is authenticated");
        return res.redirect('http://www.google.com');
        /*
        if(req.cookies.currentCountry && req.user.countries.indexOf(req.cookies.currentCountry)>=0) {
            req.user.currentCountry = req.cookies.currentCountry;
        } else {
            req.user.currentCountry = req.user.countries[0];
        }
        */
    }
    console.log("User is not authenticated");
    return next();
};

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


