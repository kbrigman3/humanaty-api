var firebase = require('firebase');
require('firebase/auth');
require('firebase/firestore');
var db = require('./firebase'); //get reference to firebase config file

var express = require('express');
var router = express.Router();

var database = firebase.firestore(db.app); //declare database using app initialization in firebase.js

//get request for user logged in status
router.get('/', function(req, res, next) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log('user logged in');
          res.send(true);
          return;
        } else {
          console.log("no user logged in");  
          res.send(false);
          return;
        }
     });
});
  
module.exports = router;  