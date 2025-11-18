require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');



var participantRouter  = require('./routes/participants');

var db = require("./models");


var app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/participants', participantRouter );

// 404 handler 
app.use((req, res) => {
  return res.status(404).json({
    status: "fail",
    data: { statusCode: 404, result: "Not found" }
  });
});

// Central error handler 
app.use((err, req, res, next) => {
  const status = err.httpStatus || 500;

  if (status >= 400 && status < 500) {
    return res.status(status).json({
      status: "fail",
      data: {
        statusCode: status,
        result: err.message || "Request failed"
      }
    });
  }

  
  return res.status(500).json({
    status: "error",
    result: "Internal Server Error"
  });
});

module.exports = app;
