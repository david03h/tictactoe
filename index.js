const express = require('express'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	sessions = require('express-session'),
	bodyParser = require('body-parser');

express.basePath = __dirname;

//postatwowa konfiguracja
app.set('host', '0.0.0.0');

//bezpieczeństwo input
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(sessions({
	secret: "fndsgndsaopgnpsognk.lmdnntegjjndspbn",
	resave: false,
	saveUninitialized: true
}));

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/static',express.static('node_modules'));

//statyczne pliki
app.use(express.static('./public'));

//routing
app.use('/', require('./routes'));

//socketr
require('./controllers/socket.js')(io);

//odpalanie serwera
http.listen(process.env.PORT || 4000);

module.exports = app;