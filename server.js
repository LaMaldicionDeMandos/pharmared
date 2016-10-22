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
        console.log('login - usernmane: ' + username + ' password: ' + password);
        var form = {username: username, password: password};
        request({method: 'post', url: config.login_url, body: form, json: true, headers: null},
            function(error, response, body){
                console.log('post to login... ');
                if (error)  {
                    console.log('some bad, ' + error);
                    done(error);
                }
              else if (response.statusCode==201) {
                    form.accessToken = body;
                    console.log('login ok ' + JSON.stringify(form));
                    done(null, form);
                }
                else {
                    done(body);
                }
            });
    }
));
passport.serializeUser(function(user, done) {
    var json = JSON.stringify(user);
    console.log('Serializing user ' + json);
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
        if (!user) {
            return next('user_not_authenticated');
        }
        req.login(user, function(err) {
            if (err) {
                console.log("Error in login into session: " + err);
                return next(err);
            }


               console.log("Login success, sending path to redirect");
               res.send(config.success_url + user.accessToken);

           });
    })(req, res, next);
});
app.get('/authenticate/:hash',
    passport.authenticate('hash', { failureRedirect: '/', session: true }),
    function(req, res) {
        res.redirect(config.success_url + req.user.accessToken);
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
        console.log("Access Token: " + req.user.accessToken);
        res.redirect(config.success_url + req.user.accessToken);
    } else {
        console.log("User is not authenticated");
        return next();
    }
};

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


