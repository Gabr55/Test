
//Ватермарк

$(document).ready(function () {
    var watermark = 'Введите запрос';
    $("input").val(watermark).addClass('watermark');
    $("input").blur(function () {
        if ($(this).val().length == 0) {
            $(this).val(watermark).addClass('watermark');
        }
    });
    $("input").focus(function () {
        if ($(this).val() == watermark) {
            $(this).val('').removeClass('watermark');
        }
    });
});








//React


var Image = React.createClass({
    render: function(){
        return <img src={this.props.image}/>
    }
});

var App = React.createClass({
    
    getInitialState: function(){
        return {images: []};
    },
    
    search: function(event){
        
        var tempThis = this;
        var imageQuery = event.target.value.toLowerCase();
        $.ajax({
            url: "https://api.flickr.com/services/feeds/photos_public.gne?tags=" + imageQuery + "&tagmode=any&format=json"
            , dataType: "jsonp"
            , jsonpCallback: "jsonFlickrFeed"
            , success: function (data) {
                console.log(data.items);
                
                var images = [];
                if (imageQuery == ''){
                    images = [];
                }
                else
                images = data.items;
                tempThis.setState({
                            images: images
                     });
              
            }
        });
        
    },
    
    render: function(){
        return (
        <div>
            <input type="text" onChange={this.search} />
            <div id="images">
                {
                    this.state.images.map(function(el){
                        //console.log(el);
                        return <Image
                            key={el.media.m}
                            image={el.media.m}
                        />
                    })
                }
            </div>
        </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('content'));



