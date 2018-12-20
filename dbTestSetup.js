var mongoose = require('mongoose');
const dbURI = require("./settings").TEST_DB_URI;

var conStr;

function connect(dbUriString) {
 conStr = dbUriString ? dbUriString : dbURI;

 // This returns a promise
 return mongoose.connect(conStr,{ useNewUrlParser: true, useCreateIndex: true }); 
};

mongoose.connection.once('connected', function () { 
 console.log('Mongoose default connection open to ' + conStr);
});

mongoose.connection.once('error',function (err) { 
 console.log('Mongoose default connection error: ' + err);
});

module.exports = connect;
