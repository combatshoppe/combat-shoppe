'use strict';

// modules
const express = require('express');
const app = express();

// configuration ===========================================

// set our port
const PORT = 3000;

//defining route
app.get('/tproute', function (ignore, res) {
	res.send('This is routing for the application developed using Node and Express...');
});

// setting up angular
app.use(express.static(__dirname + '/public'));

// frontend routes =========================================================
app.get('*', function(req, res) {
	console.log(req.url);
	res.sendFile(__dirname + '/index.html');
});

// sample mongo api route - client gets data from server's database
/*
// grab the PC model we just created
var Monster = require('./app/models/monster');
app.get('/api/monster', function(req, res) {
   // use mongoose to get all pcs in the database
   Monster.find(function(err, monsters) {
      // if there is an error retrieving, send the error.
      // nothing after res.send(err) will execute
      if (err)
         res.send(err);
      res.json(monsters); // return all monsters in JSON format
   });
});
*/

// startup our app at http://localhost:3000
app.listen(PORT, () => console.log(`Combat-Shoppe listening on http://127.0.0.1:${PORT}`));
