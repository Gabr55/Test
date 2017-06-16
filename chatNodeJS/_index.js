


var socket = require('socket.io');
var express = require('express');
var app = express();
var io = socket.listen(app.listen(3000));

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
    res.render('page');
});

var users = {};

function getUsers(obj){
    var tmp = [];
    for(var i in obj) {
        tmp.push(obj[i]);
    }
    return tmp.join(', ');
}

io.sockets.on('connection', function(client){
    console.log('Connected');
    
    var nickName;
    
    client.on('hello', function(data){
        nickName = data.name;
        client.emit('message',{msg: "Добро пожаловать в чат, " + nickName + "!"});
        client.broadcast.emit('message', {msg: nickName + " вошел в чат..."});
        
        if(Object.keys(users).length > 0){
            var userList = getUsers(users);
            client.emit('message',{msg: "Уже в чате: " + userList});
        }
        else {
            client.emit('message',{msg: 'Кроме Вас в чате никого нет...'})
        }
        users[client.id] = nickName;
    });
    
    client.on('disconnect', function(data){
        if (Object.keys(users).length >1){
            client.broadcast.emit('message', {msg: nickName + " покинул чат..."});
        }
        delete users[client.id];
    });
    
    //client.emit('message',{msg: "Добро пожаловать в чат!"});
    
    client.on('send', function(data){
        var string = nickName + ": " +data.msg;
        io.sockets.emit('message', {msg: string});
    });
});