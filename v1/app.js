const mysql = require('mysql');
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');

// Database connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shaRON_pass1234',
    database: 'safaricamp'
});

// Ensure campgrounds table is created before handling requests
createCampgroundsTable();

// Function to create campgrounds table
function createCampgroundsTable() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS campgrounds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL
        )
    `;

    connection.query(createTableQuery, function (err, result) {
        if (err) {
            console.log('Error creating campgrounds table:', err);
        } else {
            console.log('Campgrounds table created successfully');
            // Start the server after table creation
            // startServer();
        }
    });
}

// Function to start the server
function startServer() {
    app.listen(5000, function () {
        console.log('App listening on port 5000');
    });
}

// Routes

// Landing page
app.get('/', function (req, res) {
    res.render('landing');
});

//INDEX - This is our INDEX route
app.get('/campgrounds', function (req, res) {
    connection.query('SELECT * FROM campgrounds', function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching campgrounds from database');
        } else {
            res.render('index', { campgrounds: results });
        }
    });
});

// a route to return an image
app.get('/uploads/:filename', function (req, res) {
    res.sendFile(__dirname + '/uploads/' + req.params.filename);
});

//NEW - show form to create a new campground
app.get('/campgrounds/new', function (req, res) {
    res.render('new');
});

// CREATE - Route to add a new campground
app.post('/campgrounds', upload.single('image'), function (req, res) {
    let name = req.body.name;
    let image = req.file ? req.file.filename : '';
    image_url = 'http://localhost:5000/uploads/' + image;
    let newCampground = { name: name, image: image_url };

    console.log(newCampground);
    
    // Check if 'name' is provided (mandatory field)
    if (!name) {
        return res.status(400).send('Name is required.');
    }
    
    connection.query('INSERT INTO campgrounds SET ?', newCampground, function (err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error adding new campground');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

// SHOW - This is our SHOW route
app.get('/campgrounds/:id', function (req, res) {
    const campgroundId = req.params.id;
    const sql = 'SELECT * FROM campgrounds WHERE id = ?';
    connection.query(sql, campgroundId, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching campground from database');
        } else {
            if (results.length === 0) {
                res.status(404).send('Campground not found');
            } else {
                const campground = results[0];
                res.render('show', { campground: campground });
            }
        }
    });
});


// Start server
startServer();
