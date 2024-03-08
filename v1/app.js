let mysql       = require('mysql'),
    express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shaRON_pass1234',
    database: 'safaricamp'
});

// Ensure campgrounds table is created before handling requests
createCampgroundsTable();

// Function to create campgrounds table
function createCampgroundsTable() {
    let createTableQuery = `
        CREATE TABLE IF NOT EXISTS campgrounds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableQuery, function(err, result) {
        if(err) {
            console.log('Error creating campgrounds table:', err);
        } else {
            console.log('Campgrounds table created successfully');
            // Start the server after table creation
            startServer();
        }
    });
}

// Function to start the server
function startServer() {
    app.listen(3000, function(){
        console.log('App listening on port 3000');
    });
}

// create the landing page 
app.get("/", function(req, res) {
    res.render("landing");
});

// Route to display all campgrounds
app.get('/campgrounds', function(req, res) {
    connection.query('SELECT * FROM campgrounds', function(err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching campgrounds from database');
        } else {
            res.render('campgrounds', { campgrounds: results });
        }
    });
});

// Route to display the form to create a new campground
app.get('/campgrounds/new', function(req, res){
    res.render('new');
});

// Route to add a new campground
app.post('/campgrounds', function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name: name, image: image};
    connection.query('INSERT INTO campgrounds SET ?', newCampground, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Error adding new campground');
        } else {
            res.redirect('/campgrounds');
        }
    });
});
