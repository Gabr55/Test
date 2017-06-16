var socket;
window.onload = function () {
    socket = io.connect('http://localhost:3000');
    
    var content = document.getElementById('content');
    var field = document.getElementById('field');
    var form = document.getElementById('form');
    var imgBox = document.getElementById('imgBox');
    
    
    
    //Ватермарк
    $(document).ready(function () {
        var watermark = 'Введите запрос';
        $("#field").val(watermark).addClass('watermark');
        $("#field").blur(function () {
            if ($(this).val().length == 0) {
                $(this).val(watermark).addClass('watermark');
            }
        });
        $("#field").focus(function () {
            if ($(this).val() == watermark) {
                $(this).val('').removeClass('watermark');
            }
        });
    });
    
    
    
    
    
    form.onsubmit = function () {
        var name = field.value;
        
         var url = '/'+name;
        
        
        if (name) {
            socket.emit('send', {
                sendName: name
            });
            field.value = '';
        }
        else 
            alert('Введите запрос!')
        return false;
    };
    
    socket.on('imgSend', function(data){
        if(data.imgs){
            imgBox.innerHTML = data.imgs;
        }
        else 
            imgBox.innerHTML = '<img class="image" src="http://ck.ck.ua/wp-content/themes/ckua/images/notfound.jpg">';
    });
};