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
var LoginStrategy = require('passport-local').Strategy;
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
passport.use(new LoginStrategy(
    function(username, password, done) {
        var form = {username: username, password: password};
        request({method: 'post', url: config.login_url, body: form, json: true, headers: null},
            function(error, response, body){
                if (error)  {
                    done(error);
                }
                form.accessToken = body;
                done(null, form);
            });
    }
));
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

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            console.log("Error in authentication: " + JSON.stringify(info));
            return next(err);
        }
        console.log("user authenticated: " + JSON.stringify(user) + " doing login in session");
        req.login(user, function(err) {
            if (err) {
                console.log("Error in login into session: " + err);
                return next(err);
            }
            console.log("Login success, sending path to redirect");
            //res.append('Authorization', "Bearer " + user.accessToken);
            //res.redirect(config.success_url);
            res.send({accessToken: user.accessToken, url: config.success_url});
        });
    })(req, res, next);
});
app.get('/authenticate/:hash',
    passport.authenticate('hash', { failureRedirect: '/', session: true }),
    function(req, res) {
        res.append('Authorization', "Bearer " + req.user.accessToken);
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
        res.append('Authorization', "Bearer " + req.user.accessToken);
        return res.redirect(config.success_url);
    }
    console.log("User is not authenticated");
    return next();
};

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


