var xnconfig = require('nodejsconfig');
var fs = require('fs');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
console.log('Scope: ' + process.env.NODE_ENV);

config = xnconfig.parse(process.env.NODE_ENV, data);
var bodyParser= require('body-parser');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
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
            var user = JSON.parse(body);
            user.accessToken = hash;
            done(null, user);
        });
    }));
passport.serializeUser(function(user, done) {
    console.log('Serializing user');
    var json = JSON.stringify(user);
    done(null, json);
});

passport.deserializeUser(function(json, done) {
    var user = JSON.parse(json);
    done(null, user);
});
app.enable('trust proxy');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
app.use(cookieParser('farmared_landing_secret'));
app.use(session({
    secret: 'farmared_landing_secret',
    name: 'cookie_pharmared_landing',
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: {maxAge: config.session_expire, secure: false}}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/authenticate/:hash',
    passport.authenticate('hash', { failureRedirect: '/', session: true }),
    function(req, res) {
      res.redirect(config.success_url);
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
        return res.redirect(config.success_url);
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


