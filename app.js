require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const db = require('./models');
const AdminService = require('./services/AdminService');
const adminService = new AdminService(db);


var participantsRouter  = require('./routes/participants');

var db = require("./models");
db.sequelize.sync({ force: false }).then(async () => {
  await adminService.ensureDefaultAdmin();
})

var app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/participants', participantsRouter );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// Error handler – IMPORTANT: return JSON, not render()
app.use(function (err, req, res, next) {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;
