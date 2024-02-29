let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let campgrounds = [
    {name: 'Salmon Creek', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Granite Hill', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Mountain Goat', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Salmon Creek', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Granite Hill', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Mountain Goat', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Salmon Creek', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Granite Hill', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Mountain Goat', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Salmon Creek', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Granite Hill', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},
    {name: 'Mountain Goat', image: 'https://www.elacampground.com/wp-content/uploads/2019/06/Ela-Campground-87.jpg'},

];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){

   res.render('campgrounds', {campgrounds: campgrounds});
})

app.post('/campgrounds', function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect('/campgrounds');
})

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
});