let express = require('express');
let app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    let campgrounds = [
        {name: 'Salmon Creek', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
        {name: 'Granite Hill', image: 'https://www.shutterstock.com/shutterstock/photos/1956989740/display_1500/stock-photo-travel-trailer-camping-in-the-woods-at-a-campground-1956989740.jpg'},
        {name: 'Mountain Goat', image: 'https://www.shutterstock.com/shutterstock/photos/1411568588/display_1500/stock-photo-kids-playground-in-the-park-surrounded-by-green-trees-1411568588.jpg'},

    ]
    res.render('campgrounds', {campgrounds: campgrounds});
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
});