const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const engine = require('ejs-mate');

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');



const app = express();


//invocar Mongo

require ('./config/conexionMongo');
require('./passport/local-auth');

const server = http.Server(app);
const io = socketIO(server);

// settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');



// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.createMessage = req.flash('createMessage');
  app.locals.user = req.user;
  console.log(app.locals)
  next();
});

// routes
app.use('/', require('./routes/index'));

// sockets
require('./sockets')(io);

// Starting the server
server.listen(app.get('port'), () => {
  console.log('server on port', app.get('port'));
});

// starting the server
/*
server.listen(3000, () => {
  console.log('Server on port', 3000);
});

*/
