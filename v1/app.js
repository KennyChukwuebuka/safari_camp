const mysql         = require('mysql');
const express       = require('express');
const path          = require('path');
const app           = express();
const bodyParser    = require('body-parser');
const multer        = require('multer');
//const comment       = require('./models/comment'); 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//CSS setup
app.use(express.static(__dirname + '/public'));


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
    const createCampgroundsQuery = `
        CREATE TABLE IF NOT EXISTS campgrounds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL
        )
    `;

    const createCommentsTableQuery = `
        CREATE TABLE IF NOT EXISTS comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            comment TEXT NOT NULL,
            author VARCHAR(255) NOT NULL, -- Add the author column
            campground_id INT,
            FOREIGN KEY (campground_id) REFERENCES campgrounds(id)
        )
    `;

    connection.query(createCampgroundsQuery, function (err, result) {
        if (err) {
            console.log('Error creating campgrounds table:', err);
        } else {
            console.log('Campgrounds table created successfully');
            // After creating campgrounds table, create comments table
            connection.query(createCommentsTableQuery, function (err, result) {
                if (err) {
                    console.log('Error creating comments table:', err);
                } else {
                    console.log('Comments table created successfully');
                    //startServer(); // Start the server after table creation
                }
            });
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

// =======================================================
//COMMENT ROUTES

// NEW - Show form to create a new comment
app.get('/campgrounds/:id/comments/new', function (req, res) {
    const campgroundId = req.params.id;
    const sql = 'SELECT * FROM campgrounds WHERE id = ?';
    connection.query(sql, [campgroundId], function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send('Error fetching campground from database');
        } else {
            if (results.length === 0) {
                res.status(404).send('Campground not found');
            } else {
                const campground = results[0];
                res.render('comments/new', { campground: campground });
            }
        }
    });
});

// CREATE - Add new comment to database
app.post('/campgrounds/:id/comments', function (req, res) {
    const commentText = req.body.text; // Access text input directly
    const commentAuthor = req.body.author; // Access author input directly
    const campgroundId = req.params.id;
    const sql = 'INSERT INTO comments (comment, author, campground_id) VALUES (?, ?, ?)';
    connection.query(sql, [commentText, commentAuthor, campgroundId], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Error adding comment to database');
        } else {
            res.redirect('/campgrounds/' + campgroundId);
        }
    });
});


//=========================================================

// Start server
startServer();
