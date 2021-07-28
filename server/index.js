const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const { Server } = require('socket.io');

const router = require('./router');

const socketEvents = require('./socketEvents');
const config = require('./config/main');

// Database Setup

mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/donnyslist', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true
})
  .then(() => {
    console.log('Database is connected!');
  })
  .catch((err) => {
    console.log('Database not ready!');
    console.error(err);
  });

// Start the server
let server;
const app = express();

const corsOptions = {
  allRoutes: true,
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
  headers: 'Origin, X-Requested-With, Content-Type, Accept, Engaged-Auth-Token',
  credentials: true
};

if (process.env.NODE_ENV !== config.test_env) {
  server = app.listen(config.port);
  console.log(`Your server is running on port ${config.port}.`);
} else {
  server = app.listen(config.test_port, '0.0.0.0');
}

const io = new Server(server, { cors: corsOptions });
socketEvents(io);

// Set static file location for production
// app.use(express.static(__dirname + '/public'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Setting up basic middleware for all Express requests
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parses urlencoded bodies
app.use(express.json({ limit: '50mb' })); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
