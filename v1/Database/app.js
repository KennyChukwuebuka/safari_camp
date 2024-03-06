let mysql       = require('mysql'),
    express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shaRON_pass1234',
    database: 'safaricamp'
});

connection.connect(function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
})

app.listen(3000, function(){
    console.log('App listening on port 3000');
})
