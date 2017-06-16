var socket;

window.onload = function(){
    socket = io.connect('http://localhost:3000')
    var messages = [];
    var content = document.getElementById('content');
    var field = document.getElementById('field');
    var form = document.getElementById('form');
    
    
    var name = prompt('Как Вас зовут?','Гость');
    if (name){
        socket.emit('hello', {name: name});
    }
    
    socket.on('message', function(data){
        if (data.msg){
            messages.push(data.msg);
            content.innerHTML = messages.join('<br/>');
        }
    });
 
    form.onsubmit = function(){
        var message = field.value;
        if (message){
            socket.emit('send', {msg: message});
            field.value = '';
        }
        return false;
    };
};

window.onunload = function(){
    socket.disconnect();
};