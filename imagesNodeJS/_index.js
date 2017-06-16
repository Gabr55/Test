var socket = require('socket.io');
var express = require('express');
var request = require('request');
var url = require('url');
var jade = require('jade');
var fs = require('fs');
var app = express();
var io = socket.listen(app.listen(3000));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.render('page');
    
    
    //Принять данны при валидации формы и в переменную name
    
    
    io.sockets.on('connection', function (client) {
        
        console.log('Connected');
        
        client.on('send', function (data) {
            var options = {
                protocol: 'https'
                , host: 'api.flickr.com'
                , pathname: '/services/feeds/photos_public.gne'
                , query: {
                    tags: data.sendName
                    , tagmode: 'any'
                    , format: 'json'
                }
            };
            
            var getUrl = url.format(options);
            request(getUrl, function (err, response, body) {
                console.log(body);

                function jsonpParse(jsonpData) {
                    var startPos = jsonpData.indexOf('({');
                    var endPos = jsonpData.indexOf('})');
                    var jsonString = jsonpData.substring(startPos + 1, endPos + 1);
                    return JSON.parse(jsonString);
                }
                
                var json = jsonpParse(body);
                console.log(json);
                console.log(json.link);
                var imgs = [];
                for (var i in json.items){
                    imgs.push(json.items[i].media.m);
                }
                console.log(imgs);
                
                                
                jade.renderFile('tpl/images.jade', {imgs: imgs}, function(err, html){
                    console.log(html);
                    client.emit('imgSend', {imgs: html});
                })
                //!!!! Отрендерить в папку public шаблон images.jade и передать {imgs: imgs}
                
                /*
                Возможно:
                var jade = require('jade');

                // Отрендерить строку
                jade.render('string of jade', {
                    options: 'here'
                });

                // Отрендерить файл
                jade.renderFile('path/to/some.jade', {
                    options: 'here'
                }, function (err, html) {
                    // опции опциональны,
                    // коллбеком может быть второй аргумент
                });

                //Компилировать функцию
                var fn = jade.compile('string of jade', options);
                fn.call(scope, locals);
                */
                
                });
            });
        });
    });
