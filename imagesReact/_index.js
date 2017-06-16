var express = require('express');
var jade = require('jade');
var app = express();

app.listen(3000);
app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.render('index');
});