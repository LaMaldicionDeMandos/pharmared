var xnconfig = require('nodejsconfig');
var fs = require('fs');
var data = fs.readFileSync(__dirname+'/config/config.properties', 'UTF8');
console.log('Scope: ' + process.env.NODE_ENV);

config = xnconfig.parse(process.env.NODE_ENV, data);
var bodyParser= require('body-parser');
var express = require('express');
var app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});
app.post("/register", function(req,res){
  var form=req.body;
  console.log(form.fantasyName);
  res.status(201).send('Farmacia Registrada');

});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


