var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'NetSec19!',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/home.html'));
});

app.post('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;

	console.log('username -->' + username)
	console.log('password -->' + password)
	if (username && password) {
		// attack vector to bypass the password check (from the password field): 
		// k' OR 'a'='a
		connection.query("SELECT * FROM accounts WHERE username = '" + username + "' AND (password = '" + password + "')", 
			function(error, results, fields) {
				if (error) {
                                    console.error(error);
                                    response.redirect('/login.html');
                                } else {
				  if (results && results.length > 0) {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/personal-area');
				  } else {
				  	response.redirect('/login.html');
				  }			
				  response.end();
                                }
			}
		);
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/personal-area', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

const port = 80
app.listen(port, '192.168.0.2', function() {
	console.log('Listening to port: ' + port);
});